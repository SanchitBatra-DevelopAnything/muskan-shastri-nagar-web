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
}
