import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { EditorderServiceService } from '../services/editorder-service.service';

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
  visibleDeliveryDialog:boolean = false;
  visibleBalanceDialog:boolean = false;
  isLoadingInDialog:boolean = false;
  deliverTo:any;
  selectedIndex:any;
  collectedBalance:number;

  constructor(private route:ActivatedRoute , private apiService : ApiService , private editOrderService:EditorderServiceService , private router:Router) { }
  ngOnInit(): void {

    this.date = this.route.snapshot.params['date'];
    this.orderKey = this.route.snapshot.params['key'];

    this.fetchOrderDetails();
    this.editOrderService.selectedRegularOrder(this.order); //sets this for edit.
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
      this.addIndexToItemList();
      this.checkForDelivery();
      this.isLoading = false;
      this.collectedBalance = this.order.balanceAmount;
    })
  }

  addIndexToItemList()
  {
    let index = 0;
    this.itemList.map((item:any)=>{
      item['rowIndex'] = index++;
    });
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
    this.isLoadingInDialog = true;
    let originalBalance = this.order.balanceAmount;
    this.order.balanceAmount = originalBalance - this.collectedBalance;
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.isLoadingInDialog = false;
      this.visibleBalanceDialog = false;
      this.collectedBalance = this.order.balanceAmount;
    } , (err)=>{
      this.order.balanceAmount = originalBalance;
      this.isLoadingInDialog = false;
      this.visibleBalanceDialog = false;
    })
  }

  deliverOrder()
  {
    this.order.status = "D";
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.apiService.sendDeliveryMessage(this.orderKey , true,this.order.Contact,this.order.customerName , this.deliverTo);
    });
  }

  cancelOrder()
  {
    this.order.status = "C";
    this.apiService.updateOrder(this.date,this.orderKey,this.order).subscribe((_)=>{
      this.apiService.sendCancelMessage(this.orderKey,true,this.order.Contact,this.order.customerName);
    });
  }

  showDialog(index:any)
  {
    if(index != "full")
    {
      this.selectedIndex = index;
    }
    this.visibleDeliveryDialog = true;
  }

  addDeliveryPersonName()
  {
    console.log(this.itemList[this.selectedIndex]);
    this.itemList[this.selectedIndex]['deliveredTo'] = this.deliverTo;
    this.order.items = this.itemList;
    this.isLoadingInDialog = true;
    this.apiService.updateOrder(this.date, this.orderKey,this.order).subscribe((_)=>{
      this.deliverTo = undefined;
      this.isLoadingInDialog = false;
      this.fetchOrderDetails();
      this.visibleDeliveryDialog = false;
    });
  }

  showBalanceDialog()
  {
    this.visibleBalanceDialog = true;
  }

  editOrder()
  {
    this.router.navigate(['order/REGULAR/edit']);
  }

}
