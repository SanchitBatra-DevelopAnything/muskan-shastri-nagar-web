import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorderServiceService {

  constructor() { }

  selectedRegularOrder:any;
  selectedCustomOrder:any;

  setRegularOrder(order:any , orderKey:any)
  {
    this.selectedRegularOrder = {...order , 'orderKey' : orderKey};
  }

  getRegularOrder()
  {
    return this.selectedRegularOrder;
  }

  setCustomOrder(order:any , orderKey : any)
  {
    this.selectedCustomOrder = {...order , 'orderKey' : orderKey};
  }

  getCustomOrder()
  {
    return this.selectedCustomOrder;
  }
}
