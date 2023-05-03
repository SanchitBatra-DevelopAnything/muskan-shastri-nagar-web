import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Component({
  selector: 'app-order-type-selection',
  templateUrl: './order-type-selection.component.html',
  styleUrls: ['./order-type-selection.component.scss']
})
export class OrderTypeSelectionComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  openOrder(orderType:any)
  {
    if(orderType == "CUSTOM")
    {
      this.router.navigate(['/order/CUSTOM']);
    }
    else
    {
      this.router.navigate(['/order/'+orderType])
    }
  }

}
