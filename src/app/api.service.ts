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
    let modifiedOrder = {...order , 'orderType' : "custom" , 'status' : "ND"};
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+deliveryDate+'.json',modifiedOrder);
  }

  public addRegularOrder(order:any) : Observable<any> {
    let deliveryDate = order.deliveryDate;
    let modifiedOrder = {...order , 'orderType' : "regular" , 'status' : "ND"};
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+deliveryDate+'.json',modifiedOrder);
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

    let allDetails = `https://shastri-nagar-shop-app.web.app/#/detail/${deliveryDate}/${id}`;

    let baseUrl = allDetails.split("#")[0];
    allDetails = baseUrl+`#/detail/${deliveryDate}/${id}`;


    let message = `Hi ${name},\nYour order with ID : ${id} is accepted.\nPlease find details.\n\nTotal:Rs.${total}\nAdvance:Rs.${advance}\nBalance:Rs.${balance}\n\nBooked On:${bookingDate}\nDeliver Date:${deliveryDate}\nDelivery Time:${deliveryTime}\nOther Details:${allDetails}\n\nThanks for ordering from Muskan Bakers And Sweets`;
    window.open(`https://wa.me/+91${phoneNumber}/?text=${encodeURIComponent(message)}`);
  }

  public sendUpdateOrderWhatsapp(orderKey:any , isRegular:boolean)
  {
    let mobile = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").Contact;
    let name = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").customerName;
    let deliveryDate = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").deliveryDate;
    let allDetails = "https://shastri-nagar-shop-app.web.app/#/detail/"+deliveryDate+"/"+orderKey;
    let message = `Hi ${name},\nYour order with ID : ${orderKey} is updated.\n\nNew Details:${allDetails}\n\nThanks for ordering from Muskan Bakers And Sweets`;
    let encoded = encodeURIComponent(message);
    window.open("https://wa.me/+91"+mobile+"/?text="+encoded);
  }

  public sendDeliveryMessage(orderKey : any , isRegular:boolean , deliveredTo:string)
  {
    let mobile = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").Contact;
    let name = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").customerName;
    let message = `Hi ${name},\nYour order with ID : ${orderKey} is Delivered to ${deliveredTo}.\n\nThanks for ordering from Muskan Bakers And Sweets`;
    let encoded = encodeURI(message);
    window.open("https://wa.me/+91"+mobile+"/?text="+encoded);
  }

  public sendCancelMessage(orderKey : any , isRegular:boolean)
  {
    let mobile = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").Contact;
    let name = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").customerName;
    let message = `Hi ${name},\nYour order with ID : ${orderKey} is Cancelled.\n\nThanks for ordering from Muskan Bakers And Sweets`;
    let encoded = encodeURI(message);
    window.open("https://wa.me/+91"+mobile+"/?text="+encoded);
  }

  public getActiveOrders(date : String) : Observable<any> {
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+date+'.json');
  }
  
  public getOrder(date : any , key : any) : Observable<any>
  {
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+date+'/'+key+'.json');
  }

  public updateOrder(date : any , key : any , orderInfo : any) : Observable<any> {
    return this.http.patch('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+date+'/'+key+'.json',orderInfo);
  }
}
