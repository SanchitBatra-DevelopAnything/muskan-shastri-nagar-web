// import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { threadId } from 'worker_threads';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  isLoading:boolean = false;
  loadedOrder:any = {};
  isRegularOrder:boolean = true;
  showGiftQuantity:boolean = false;

  constructor(private router:Router , private route:ActivatedRoute , private apiService:ApiService) { }

  ngOnInit(): void {
    let key = this.route.snapshot.params['orderKey'];
    let date = this.route.snapshot.params['date'];
    this.getOrderDetails(date , key);
  }

  getOrderDetails(date:any , key:any)
  {
    this.isLoading = true;
    this.apiService.getOrder(date,key).subscribe((order)=>{
      if(order == null)
      {
        this.loadedOrder = {};
        return;
      }
      this.loadedOrder = order;
      if(this.loadedOrder.orderType.toString().toLowerCase() == "regular" || this.loadedOrder.orderType.toString().toLowerCase()== "gift")
      {
        if(this.loadedOrder.orderType.toString().toLowerCase()== "gift")
        {
          this.showGiftQuantity = true;
        }
        else
        {
          this.showGiftQuantity = false;
        }
        this.isRegularOrder = true;
      }
      else
      {
        this.isRegularOrder = false;
      }
      this.isLoading = false;
    });
  }

  getDeliveryDate(date:string)
  {
    return this.apiService.getUserFormatDate(date);
  }

}
