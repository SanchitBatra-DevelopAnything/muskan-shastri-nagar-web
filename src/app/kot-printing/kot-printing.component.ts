import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-kot-printing',
  templateUrl: './kot-printing.component.html',
  styleUrls: ['./kot-printing.component.scss']
})
export class KotPrintingComponent implements OnInit {


  order:any;
  date:any;
  orderKey:any;
  isLoading:boolean = false;
  itemList:any;
  orderReadyForDelivery:boolean = false;

  constructor(private route:ActivatedRoute , private apiService : ApiService) { }
  ngOnInit(): void {

    this.date = this.route.snapshot.params['date'];
    this.orderKey = this.route.snapshot.params['key'];

    this.fetchOrderDetails();

  }

  fetchOrderDetails()
  {
    this.isLoading = true;
    this.apiService.getOrder(this.date,this.orderKey).subscribe((order)=>{
      if(order ==  null || order == undefined)
      {
        this.order = {};
        this.isLoading = false;
        this.itemList = [];
        return;
      }
      this.order = order;
      this.itemList = this.order.items;
      this.checkForDelivery();
      this.isLoading = false;
    })
  }

  checkForDelivery()
  {
    let totalItems = this.itemList.length;
    let preparedItems = 0;
    this.itemList.forEach((item:any)=>{
      if(item.prepared == "YES")
      {
        preparedItems++;
      }
    });
    if(preparedItems == totalItems)
    {
      this.orderReadyForDelivery = true;
    }
    else
    {
      this.orderReadyForDelivery = false;
    }
  }

  updateBalance()
  {
    this.isLoading = true;
    let originalBalance = this.order.balanceAmount;
    this.order.balanceAmount = 0;
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.isLoading = false;
    } , (err)=>{
      this.order.balanceAmount = originalBalance;
      this.isLoading = false;
    })
  }

  deliverOrder()
  {
    this.order.status = "D";
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.apiService.sendDeliveryMessage(this.orderKey , true,this.order.Contact,this.order.customerName);
    });
  }

  cancelOrder()
  {
    this.order.status = "C";
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.apiService.sendCancelMessage(this.orderKey,true,this.order.Contact,this.order.customerName);
    });
  }

}
