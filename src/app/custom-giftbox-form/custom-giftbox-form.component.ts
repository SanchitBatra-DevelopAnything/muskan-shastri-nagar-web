import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-custom-giftbox-form',
  templateUrl: './custom-giftbox-form.component.html',
  styleUrls: ['./custom-giftbox-form.component.scss']
})
export class CustomGiftboxFormComponent implements OnInit {

  form:FormGroup;
  isLoading:boolean = false;
  paymentOptions:any;

  constructor(private utilityService:UtilityService , private route:ActivatedRoute , private apiService:ApiService , private router:Router) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'totalAmount' : new FormControl(null,[Validators.required]),
      'balanceAmount' : new FormControl(null,[Validators.required]),
      'advanceAmount' : new FormControl(null,[Validators.required]),
      'particulars' : new FormControl(null),
      'advancePaymentMode' : new FormControl(null , [Validators.required]),
    });

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


    //let action = this.route.snapshot.params['action'];
    // if(action === "edit")
    // {
    //   let order = this.editOrderService.getCustomOrder();
    //   //this is actually editiing the order.
    //   this.apiService.addCustomOrder(customOrder,true,order['orderKey']).subscribe((orderId)=>{
    //     //sessionStorage.clear();
    //     this.apiService.addHistory(customOrder , order['orderKey']).subscribe((_)=>{
    //       this.isLoading = false;
    //       let action = this.route.snapshot.params['action'];
    //       this.apiService.sendWhatsapp({'name' : order['orderKey']},false,true);
    //       sessionStorage.clear();
    //       this.router.navigate(['/']);
    //     });
    //   });
    // }
    
    
      this.apiService.addGiftOrder(giftOrder,false,"").subscribe((orderId)=>{
        //sessionStorage.clear();
        this.apiService.addHistory(giftOrder , orderId['name']).subscribe((_)=>{
            this.isLoading = false;
            this.apiService.sendWhatsapp({'name' : orderId['name']} , "gift" , false);
            sessionStorage.clear();
            this.router.navigate(['/']);
        });
      });
  }

}
