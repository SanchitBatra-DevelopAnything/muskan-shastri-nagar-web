import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorderServiceService } from '../services/editorder-service.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  customerForm:FormGroup;
  today:any;
  @Input()
  isCounterOrder:boolean;

  @Input()
  action:any;

  constructor(private utilityService : UtilityService , private editOrderService:EditorderServiceService) { }

  ngOnInit(): void {

    if(this.action==="edit")
    {
      let order = this.editOrderService.getRegularOrder();
      if(order==null)
      {
        order = this.editOrderService.getCustomOrder();
        if(order == null)
        {
          order= this.editOrderService.getGiftOrder();
        }
      }
      this.customerForm = new FormGroup({
        'customerName' : new FormControl(order['customerName'],[Validators.required]),
        'Address' : new FormControl(order['Address']),
        'Contact' : new FormControl(order['Contact'],[Validators.required]),
        'alternateContact' : new FormControl(order['alternateContact']),
        'bookingDate' : new FormControl(order['bookingDate'],[Validators.required]),
        'deliveryDate' : new FormControl(order['deliveryDate'] , [Validators.required]),
        'deliveryTime' : new FormControl(order['deliveryTime'],[Validators.required]),
        'deliveryType' : new FormControl(order['deliveryType'],[Validators.required]),
     });
    }
    else
    {
      this.customerForm = new FormGroup({
        'customerName' : new FormControl('',[Validators.required]),
        'Address' : new FormControl(''),
        'Contact' : new FormControl('',[Validators.required]),
        'alternateContact' : new FormControl(''),
        'bookingDate' : new FormControl('',[Validators.required]),
        'deliveryDate' : new FormControl('' , [Validators.required]),
        'deliveryTime' : new FormControl('',[Validators.required]),
        'deliveryType' : new FormControl('',[Validators.required]),
     });
    }
   if(this.isCounterOrder)
   {
     this.loadInitialValues();
   }

   this.today = new Date().toISOString().split('T')[0];


   if(!this.firstTime() && this.action!="edit")
   {
    let customerInfo = null;
    if(sessionStorage.getItem("customerInfo")!=null)
    {
      customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    }
    this.customerForm.patchValue({
      'customerName' : customerInfo.customerName,
      'Address' : customerInfo.Address,
      'Contact' : customerInfo.Contact,
      'bookingDate' : customerInfo.bookingDate,
      'deliveryDate' : customerInfo.deliveryDate,
      'deliveryType' : customerInfo.deliveryType,
      'deliveryTime' : customerInfo.deliveryTime,
    });
   }
  }

  loadInitialValues()
  {
    this.customerForm.patchValue({
      'customerName' : "COUNTER",
      'Address' : "SHOP",
      'Contact' : 'invalid-whatsapp',
      'bookingDate' : this.getDate(),
      'deliveryDate' : this.getDate(),
      'deliveryType':'0',
      'deliveryTime' : '06:00 PM',
    });
  }

  getDate()
  {
    let d = new Date();
    let formedDate = d.getFullYear()+"-";
    if(d.getMonth() + 1 < 10)
    {
      formedDate+="0"+(d.getMonth()+1)+'-';
    }
    else
    {
      formedDate+=(d.getMonth()+1)+"-";
    }

    if(d.getDate() < 10)
    {
      formedDate+="0"+d.getDate();
    }
    else
    {
      formedDate+=d.getDate();
    }
    return formedDate;
  }

  firstTime()
  {
    return sessionStorage.getItem("customerInfo")==null||undefined;
  }

  nextPage() : void
  {
    sessionStorage.setItem("customerInfo",JSON.stringify(this.customerForm.value));
    this.utilityService.formChange.next(2);
  }

}
