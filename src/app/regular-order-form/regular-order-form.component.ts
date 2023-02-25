import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

// @Pipe({
//   name: 'indexOf'
// })
// export class IndexOfPipe implements PipeTransform {

//   transform(items:any[] , item:any): any {
//     return items.indexOf(item);
//   }

// }


@Component({
  selector: 'app-regular-order-form',
  templateUrl: './regular-order-form.component.html',
  styleUrls: ['./regular-order-form.component.scss']
})


export class RegularOrderFormComponent implements OnInit {

  items:any;
  selectedItem:any;
  isLoading = false;
  showPoundInput:boolean= false;
  currentQuantity = 0;
  currentPound = 0;

  products:any;
  paymentOptions:any;

  regularOrderForm:FormGroup;




  constructor(private apiService:ApiService , private router : Router) { 
  }

  ngOnInit(): void {
    this.regularOrderForm = new FormGroup({
      'totalAmount' : new FormControl({value : 0 , disabled : true},[Validators.required]),
      'advanceAmount' : new FormControl(null , [Validators.required]),
      'balanceAmount' : new FormControl(null,[Validators.required]),
      'advancePaymentMode' : new FormControl('CARD',[Validators.required]),
    });
    this.items = [];
    this.products = [];
    this.paymentOptions = [{'name' : 'CARD'},{'name' : 'ONLINE'},{'name' : 'CASH'}];
    this.loadInventoryItems();
  }

  loadInventoryItems()
  {
    this.isLoading = true;
    this.apiService.getInventoryItems().subscribe((items)=>{
      this.items = Object.values(items);
      this.isLoading = false;
    });
  }

  addProduct()
  {
    if(this.showPoundInput)
    {
      let formedName = `${this.currentPound}Pd. ${this.selectedItem.itemName}`;
      let productPrice = this.currentPound * this.selectedItem.price;
      let quantity = this.currentQuantity;
      let totalPrice = this.currentQuantity * productPrice;
      this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice});
    }
    else
    {
      let formedName = this.selectedItem.itemName;
      let productPrice = this.selectedItem.price;
      let quantity = this.currentQuantity;
      let totalPrice = quantity * productPrice;
      this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice});
    }
    this.currentQuantity = 0;
    this.currentPound = 0; 
    this.selectedItem = {};
    this.showPoundInput = false;
    this.updateTotal();
  }

  updateTotal()
  {
    let totalAmt = 0;
    this.products.forEach((element : any)=>{
      totalAmt+=element.total;
    });
    console.log("total hua" + totalAmt);
    this.regularOrderForm.patchValue({
      'totalAmount' : totalAmt,
    })
  }

  checkValueChange()
  {
    console.log(this.selectedItem);
    if(this.selectedItem.type.includes("CAKES"))
    {
      this.showPoundInput = true;
    }
    else
    {
      this.showPoundInput = false;
    }
  }

  createRegularOrder()
  {
    this.updateFormValue();
    let regularOrderInformation = {...this.regularOrderForm.getRawValue() , 'items' : this.products};
    this.isLoading = true;
    sessionStorage.setItem("regularOrderDetails" , JSON.stringify(regularOrderInformation));
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let regularOrderInfo = JSON.parse(sessionStorage.getItem("regularOrderDetails")+"");

    const regularOrder = {
      ...customerInfo,
      ...regularOrderInfo
    };

    // this.apiService.addCustomOrder(customOrder).subscribe((orderId)=>{
    //   //sessionStorage.clear();
    //   this.isLoading = false;
      
    //   this.sendWhatsapp(orderId)
    //   sessionStorage.clear();
    //   this.router.navigate(['/']);
    // });


    this.apiService.addRegularOrder(regularOrder).subscribe((orderId)=>{
      this.isLoading = false;
      // this.sendWhatsapp(orderId);
      sessionStorage.clear();
      this.router.navigate(['/']);
    })
  }

  updateFormValue()
  {

  }

}
