import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throws } from 'assert';
import { ApiService } from '../api.service';
import { EditorderServiceService } from '../services/editorder-service.service';

@Component({
  selector: 'app-edit-custom-order',
  templateUrl: './edit-custom-order.component.html',
  styleUrls: ['./edit-custom-order.component.scss']
})
export class EditCustomOrderComponent implements OnInit {

  isDelivered:boolean = false;
  isCancelled:boolean = false;
  isPrepared:boolean = false;
  deliverTo:string;
  isLoading:boolean = false;
  loadedOrder:any = {};
  isRegularOrder:boolean = false;
  type:string;
  visibleDeliveryDialog:boolean = false;



  constructor(private route : ActivatedRoute , private apiService:ApiService,private editOrderService:EditorderServiceService,private router:Router) { }

  ngOnInit(): void {
    let key = this.route.snapshot.params['key'];
    let date = this.route.snapshot.params['date'];
    this.getOrderDetails(date , key);

    this.type = this.route.snapshot.params['type'];
    if(this.type == null || this.type == undefined)
    {
      this.type = "owner";
    }
  }

  showDialog()
  {
    this.visibleDeliveryDialog = true;
  }


  deliverOrder()
  {
    this.isLoading = true;
    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    this.apiService.updateOrder(selectedDate,orderKey,{'status' : "D" , 'deliveredTo' : this.deliverTo}).subscribe(()=>{
      this.getOrderDetails(selectedDate,orderKey);
      this.apiService.sendDeliveryMessage(orderKey,false,this.loadedOrder.Contact,this.loadedOrder.customerName,this.deliverTo);
      sessionStorage.clear();
    });
  }

  markAsPrepared()
  {
    this.isLoading = true;
    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    this.apiService.updateOrder(selectedDate,orderKey,{'status' : "P"}).subscribe(()=>{
      this.getOrderDetails(selectedDate,orderKey);
      sessionStorage.clear();
    });
  }

  cancelOrder()
  {
    this.isLoading = true;
    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    this.apiService.updateOrder(selectedDate,orderKey,{'status' : "C" }).subscribe(()=>{
      this.getOrderDetails(selectedDate,orderKey);
      this.apiService.sendCancelMessage(orderKey,false , this.loadedOrder.Contact , this.loadedOrder.customerName);
      sessionStorage.clear();
    });
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
      sessionStorage.setItem("orderOnUpdate",JSON.stringify(order));
      this.loadedOrder = order;
      if(order.status == "D")
      {
        this.isDelivered = true;
        this.deliverTo = order.deliveredTo;
        this.isPrepared = false;
        this.isCancelled = false;
      }
      else if(order.status == "C")
      {
        this.isDelivered = false;
        this.isPrepared = false;
        this.isCancelled = true;
      }
      else if(order.status == "P")
      {
        this.isDelivered = false;
        this.isPrepared = true;
        this.isCancelled = false;
      }
      else
      { //not delivered and no action yet.
        this.isCancelled = false;
        this.isPrepared = false;
        this.isDelivered = false;
      }
      this.editOrderService.setCustomOrder(order,key);
      this.isLoading = false;
      this.isLoading = false;
    });
  }

  getDeliveryDate(date:string)
  {
    return this.apiService.getUserFormatDate(date);
  }

  editOrder()
  {
    this.router.navigate(['order/CUSTOM/edit']);
  }

  viewHistory()
  {
    this.router.navigate(['history/' + this.route.snapshot.params['key']])
  }


}
