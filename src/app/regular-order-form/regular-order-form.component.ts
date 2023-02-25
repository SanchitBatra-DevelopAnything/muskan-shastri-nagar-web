import { Component, OnInit } from '@angular/core';
interface City {
  name: string,
  code: string
}

@Component({
  selector: 'app-regular-order-form',
  templateUrl: './regular-order-form.component.html',
  styleUrls: ['./regular-order-form.component.scss']
})


export class RegularOrderFormComponent implements OnInit {

  items:any;
  selectedItem:any;
  isLoading = false;




  constructor() { 
  this.items = [{
    'itemName' : 'patties6pc',
    'price' : 720
  } , 
  {
    'itemName' : 'chocolate cake',
    'price' : 72
  } ,
  {
    'itemName' : 'strawberry cake',
    'price' : 70
  } ,
  {
    'itemName' : 'patties9pc',
    'price' : 725
  } ,]
  }

  ngOnInit(): void {
    
  }

}
