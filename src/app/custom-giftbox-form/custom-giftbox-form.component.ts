import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { EditorderServiceService } from '../services/editorder-service.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-custom-giftbox-form',
  templateUrl: './custom-giftbox-form.component.html',
  styleUrls: ['./custom-giftbox-form.component.scss']
})
export class CustomGiftboxFormComponent implements OnInit {

  form:UntypedFormGroup;
  isLoading:boolean = false;
  paymentOptions:any;

  constructor(private utilityService:UtilityService , private route:ActivatedRoute , private apiService:ApiService , private router:Router , private editOrderService:EditorderServiceService) { }

  ngOnInit(): void {
    let action = this.route.snapshot.params['action'];
    let order = this.editOrderService.getGiftOrder();
    console.log(order);
    if(action == "edit")
    {
      this.form = new UntypedFormGroup({
        'totalAmount' : new UntypedFormControl(order['totalAmount'],[Validators.required]),
        'balanceAmount' : new UntypedFormControl(order['balanceAmount'],[Validators.required]),
        'advanceAmount' : new UntypedFormControl(order['advanceAmount'],[Validators.required]),
        'particulars' : new UntypedFormControl(order['particulars']),
        'advancePaymentMode' : new UntypedFormControl(order['advancePaymentMode'] , [Validators.required]),
      })
    }
    else
    {
      this.form = new UntypedFormGroup({
        'totalAmount' : new UntypedFormControl(null,[Validators.required]),
        'balanceAmount' : new UntypedFormControl(null,[Validators.required]),
        'advanceAmount' : new UntypedFormControl(null,[Validators.required]),
        'particulars' : new UntypedFormControl(null),
        'advancePaymentMode' : new UntypedFormControl('CARD' , [Validators.required]),
      });
    }
    

    this.paymentOptions = [{'name' : 'CARD'},{'name' : 'ONLINE'},{'name' : 'CASH'}];


    if(!this.firstTime())
    {
      let customOrderInfo = null;
    if(sessionStorage.getItem("giftOrderDetails")!=null)
    {
      customOrderInfo = JSON.parse(sessionStorage.getItem("giftOrderDetails")+"");
      console.log("DETAILS = ");
      console.log(customOrderInfo);
    }
    this.form.patchValue({
      'totalAmount' : customOrderInfo.totalAmount,
      'balanceAmount' : customOrderInfo.balanceAmount,
      'advanceAmount' : customOrderInfo.advanceAmount,
      'advancePaymentMode' : customOrderInfo.advancePaymentMode,
      'particulars' : customOrderInfo.particulars
    });
    }
  }

  firstTime()
  {
    return sessionStorage.getItem("giftOrderDetails")==null||undefined;
  }

  goBack()
  {
    console.log(JSON.stringify(this.form.value));
    console.log(this.form.value);
    sessionStorage.setItem("giftOrderDetails",JSON.stringify(this.form.value));
    this.utilityService.formChange.next(1);
  }


  submitForm()
  {
    alert("Gift order will be placed and whatsapp will be sent on OK");
    this.isLoading = true;
    sessionStorage.setItem("giftOrderDetails" , JSON.stringify(this.form.value));
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let giftOrderInfo = JSON.parse(sessionStorage.getItem("giftOrderDetails")+"");

    const giftOrder = {
      ...customerInfo,
      ...giftOrderInfo
    };

    let action = this.route.snapshot.params['action'];
    if(action == "edit")
    {
      let order = this.editOrderService.getGiftOrder();
      //this is actually editiing the order.
      this.apiService.addGiftOrder(giftOrder,true,order['orderKey']).subscribe((orderId)=>{
        //sessionStorage.clear();
        this.apiService.addHistory(giftOrder , order['orderKey']).subscribe((_)=>{
          this.isLoading = false;
          let action = this.route.snapshot.params['action'];
          this.apiService.sendWhatsapp({'name' : order['orderKey']},"gift",true);
          sessionStorage.clear();
          this.router.navigate(['/']);
        });
      });

    }
    else
    {
      this.apiService.addGiftOrder(giftOrder,false,"").subscribe((orderId)=>{
        this.apiService.addHistory(giftOrder , orderId['name']).subscribe((_)=>{
            this.isLoading = false;
            this.apiService.sendWhatsapp({'name' : orderId['name']} , "gift" , false);
            sessionStorage.clear();
            this.router.navigate(['/']);
        });
      });
    }      
  }

}
