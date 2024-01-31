import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorderServiceService } from '../services/editorder-service.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  customerForm:UntypedFormGroup;
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
      this.customerForm = new UntypedFormGroup({
        'customerName' : new UntypedFormControl(order['customerName'],[Validators.required]),
        'Address' : new UntypedFormControl(order['Address']),
        'Contact' : new UntypedFormControl(order['Contact'],[Validators.required]),
        'bookingDate' : new UntypedFormControl(order['bookingDate'],[Validators.required]),
        'deliveryDate' : new UntypedFormControl(order['deliveryDate'] , [Validators.required]),
        'deliveryTime' : new UntypedFormControl(order['deliveryTime'],[Validators.required]),
        'deliveryType' : new UntypedFormControl(order['deliveryType'],[Validators.required]),
     });
    }
    else
    {
      this.customerForm = new UntypedFormGroup({
        'customerName' : new UntypedFormControl('',[Validators.required]),
        'Address' : new UntypedFormControl(''),
        'Contact' : new UntypedFormControl('',[Validators.required]),
        'bookingDate' : new UntypedFormControl('',[Validators.required]),
        'deliveryDate' : new UntypedFormControl('' , [Validators.required]),
        'deliveryTime' : new UntypedFormControl('',[Validators.required]),
        'deliveryType' : new UntypedFormControl('',[Validators.required]),
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
