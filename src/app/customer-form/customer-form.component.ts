import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  constructor(private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      'customerName' : new FormControl('',[Validators.required]),
      'Address' : new FormControl(''),
      'Contact' : new FormControl('',[Validators.required]),
      'bookingDate' : new FormControl('',[Validators.required]),
      'deliveryDate' : new FormControl('' , [Validators.required]),
      'deliveryTime' : new FormControl('',[Validators.required]),
      'deliveryType' : new FormControl('',[Validators.required]),
   });

   if(this.isCounterOrder)
   {
     this.loadInitialValues();
   }

   this.today = new Date().toISOString().split('T')[0];


   if(!this.firstTime())
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
      'bookingDate' : '',
      'deliveryDate' : '',
      'deliveryType' : '0',
      'deliveryTime' : '',
    });
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
