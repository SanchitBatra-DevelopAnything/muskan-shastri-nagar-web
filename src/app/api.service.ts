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
}
