import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditorderServiceService {

  constructor() { }

  selectedRegularOrder:any;
  selectedCustomOrder:any;

  setRegularOrder(order:any)
  {
    this.selectedRegularOrder = order;
  }

  setCustomOrder(order:any)
  {
    this.selectedCustomOrder = order;
  }
}
