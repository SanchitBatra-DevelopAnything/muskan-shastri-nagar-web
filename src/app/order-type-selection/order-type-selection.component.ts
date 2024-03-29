import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-type-selection',
  templateUrl: './order-type-selection.component.html',
  styleUrls: ['./order-type-selection.component.scss']
})
export class OrderTypeSelectionComponent implements OnInit {

  showOrders:boolean = false;

  constructor(private router:Router) { }

  ngOnInit(): void {
    sessionStorage.clear();
  }

  openOrder(orderType:any)
  {
    if(orderType == "CUSTOM")
    {
      this.router.navigate(['/order/CUSTOM/new']);
    }
    else
    {
      this.router.navigate(['/order/'+orderType+"/new"])
    }
  }

  setSystem(system:string)
  {
    localStorage.setItem('on' , system);
    this.showOrders = true;
  }



}
