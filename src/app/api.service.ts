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
    let dateSplitter = deliveryDate.split("-");
    let date = dateSplitter[2];
    let month = dateSplitter[1];
    let year = dateSplitter[0];
    let modifiedOrder = {...order , 'orderType' : "regular" , 'status' : "ND" , "cakesSeenBy" : "" , "snacksSeenBy" : ""};
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+month+'/'+year+'/'+date+'.json',modifiedOrder);
  }

  public addRegularOrder(order:any) : Observable<any> {
    let deliveryDate = order.deliveryDate;
    let dateSplitter = deliveryDate.split("-");
    let date = dateSplitter[2];
    let month = dateSplitter[1];
    let year = dateSplitter[0];
    let modifiedOrder = {...order , 'orderType' : "regular" , 'status' : "ND" , "cakesSeenBy" : "" , "snacksSeenBy" : ""};
    return this.http.post('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+month+'/'+year+'/'+date+'.json',modifiedOrder);
  }

  public sendWhatsapp(orderId:any , isRegular:boolean)
  {
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let customerOrderDetails = isRegular ? JSON.parse(sessionStorage.getItem("regularOrderDetails")+"") : JSON.parse(sessionStorage.getItem("customOrderDetails")+"");
    let name = customerInfo.customerName;
    let phoneNumber = customerInfo.Contact;

    let deliveryDate1 = customerInfo.deliveryDate.replace("/","-");
    let bookingDateArray = customerInfo.bookingDate.replace("/","-").split("-");
    let deliveryDateArray = customerInfo.deliveryDate.replace("/","-").split("-");
    let deliveryDate = deliveryDateArray[2]+"-"+deliveryDateArray[1]+"-"+deliveryDateArray[0];
    let bookingDate = bookingDateArray[2]+"-"+bookingDateArray[1]+"-"+bookingDateArray[0];
    let deliveryTime = customerInfo.deliveryTime;

    let total = customerOrderDetails.totalAmount;
    let advance = customerOrderDetails.advanceAmount;
    let balance = customerOrderDetails.balanceAmount;

    let id = orderId['name'];

    let allDetails = `https://shastri-nagar-shop-app.web.app/#/detail/${deliveryDate1}/${id}`;

    let baseUrl = allDetails.split("#")[0];
    allDetails = baseUrl+`#/detail/${deliveryDate1}/${id}`;


    let message = `Hi ${name},\nYour order with ID : ${id} is accepted.\nPlease find details.\n\nTotal:Rs.${total}\nAdvance:Rs.${advance}\nBalance:Rs.${balance}\n\nBooked On:${bookingDate}\nDeliver Date:${deliveryDate}\nDelivery Time:${deliveryTime}\nOther Details:${allDetails}\n\nThanks for ordering from Muskan Bakers And Sweets`;
    window.open(`https://wa.me/+91${phoneNumber}/?text=${encodeURIComponent(message)}`);
  }

  public sendUpdateOrderWhatsapp(orderKey:any , isRegular:boolean)
  {
    let mobile = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").Contact;
    let name = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").customerName;
    let deliveryDate = JSON.parse(sessionStorage.getItem("orderOnUpdate")+"").deliveryDate;
    let allDetails = "https://shastri-nagar-shop-app.web.app/#/detail/"+deliveryDate+"/"+orderKey;
    let deliveryDateArray = deliveryDate.split("-");
    deliveryDate = deliveryDateArray[2]+"-"+deliveryDateArray[1]+"-"+deliveryDateArray[0];
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

  sendOrdersToWorker()
  {
    let link = 'https://shastri-nagar-shop-app.web.app/#/viewOrders/chef';
    let message = `Please click this link for Today's Orders : \n\n ${link}`;
    let encoded = encodeURIComponent(message);

    window.open("https://wa.me/?text="+encoded);
  }

  public getActiveOrders(dateInput : String) : Observable<any> {
    let dateSplitter = dateInput.split("-");
    let date = dateSplitter[2];
    let month = dateSplitter[1];
    let year = dateSplitter[0];
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+month+'/'+year+'/'+date+'.json');
  }
  
  public getOrder(dateInput : any , key : any) : Observable<any>
  {
    let dateSplitter = dateInput.split("-");
    let date = dateSplitter[2];
    let month = dateSplitter[1];
    let year = dateSplitter[0];
    return this.http.get('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+month+'/'+year+'/'+date+'/'+key+'.json');
  }

  public updateOrder(dateInput : any , key : any , orderInfo : any) : Observable<any> {
    let dateSplitter = dateInput.split("-");
    let date = dateSplitter[2];
    let month = dateSplitter[1];
    let year = dateSplitter[0];
    return this.http.patch('https://shastri-nagar-shop-app-default-rtdb.firebaseio.com/activeOrders/'+month+'/'+year+'/'+date+'/'+key+'.json' , orderInfo);
  }

  public getUserFormatDate(date:string)
  {
    let d = date.replace("/","-").split("-");
    return d[2]+"-"+d[1]+"-"+d[0];
  }
}
