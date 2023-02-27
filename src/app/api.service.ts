import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

 public addItemToInventory(item:any):Observable<any>
  {
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/inventory.json',item);
  }

  public getInventoryItems() : Observable<any> {
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/inventory.json');
  }

  public deleteItemFromInventory(key:any):Observable<any> {
    return this.http.delete('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/inventory/'+key+'.json');
  }

  public getInventoryItem(key:any):Observable<any> {
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/inventory/'+key+'.json');
  }

  public editInventoryItem(key:any , item:any) : Observable<any> {
    return this.http.put('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/inventory/'+key+'.json',item);
  }

  public addCustomOrder(order:any) : Observable<any> {
    let deliveryDate = order.deliveryDate;
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/customOrders/'+deliveryDate+'.json',order);
  }

  public addRegularOrder(order:any) : Observable<any> {
    let deliveryDate = order.deliveryDate;
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/regularOrders/'+deliveryDate+'.json',order);
  }

  public sendWhatsapp(orderId:any , isRegular:boolean)
  {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let customerOrderDetails = isRegular ? JSON.parse(sessionStorage.getItem("regularOrderDetails")+"") : JSON.parse(sessionStorage.getItem("customOrderDetails")+"");
    let name = customerInfo.customerName;
    let phoneNumber = customerInfo.Contact;

    let bookingDate = customerInfo.bookingDate.replace("/","-");
    let deliveryDate = customerInfo.deliveryDate.replace("/","-");
    let deliveryTime = customerInfo.deliveryTime;

    let total = customerOrderDetails.totalAmount;
    let advance = customerOrderDetails.advanceAmount;
    let balance = customerOrderDetails.balanceAmount;

    let id = orderId['name'];

    let allDetails = "https://muskan-admin-app.web.app";


    let message = `Hi ${name},\nYour order with ID : ${id} is accepted.\nPlease find details.\n\nTotal:Rs.${total}\nAdvance:Rs.${advance}\nBalance:Rs.${balance}\n\nBooked On:${bookingDate}\nDeliver Date:${deliveryDate}\nDelivery Time:${deliveryTime}\nOther Details:${allDetails}\n\nThanks for ordering from Muskan Bakers And Sweets`;
    window.open(`https://wa.me/+91${phoneNumber}/?text=${encodeURI(message)}`);
  }
}
