import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorderServiceService {

  constructor() { }

  selectedRegularOrder:any;
  selectedCustomOrder:any;
  selectedGiftOrder:any;

  setRegularOrder(order:any , orderKey:any)
  {
    this.selectedCustomOrder = null;
    this.selectedGiftOrder=null;
    this.selectedRegularOrder = {...order , 'orderKey' : orderKey};
  }

  getRegularOrder()
  {
    return this.selectedRegularOrder;
  }

  setCustomOrder(order:any , orderKey : any)
  {
    this.selectedRegularOrder = null;
    this.selectedGiftOrder = null;
    this.selectedCustomOrder = {...order , 'orderKey' : orderKey};
  }

  getCustomOrder()
  {
    return this.selectedCustomOrder;
  }

  setGiftOrder(order:any , orderKey:any)
  {
    this.selectedCustomOrder = null;
    this.selectedRegularOrder = null;
    this.selectedGiftOrder = {...order , 'orderKey' : orderKey};
  }

  getGiftOrder()
  {
    return this.selectedGiftOrder;
  }
}
