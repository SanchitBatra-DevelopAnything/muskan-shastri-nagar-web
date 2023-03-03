import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  isEditMode : boolean = false;

  products:any;
  paymentOptions:any;

  regularOrderForm:FormGroup;




  constructor(private apiService:ApiService , private router : Router , private route:ActivatedRoute) { 
  }

  ngOnInit(): void {
    this.regularOrderForm = new FormGroup({
      'totalAmount' : new FormControl({value : 0 , disabled : true},[Validators.required]),
      'advanceAmount' : new FormControl(null , [Validators.required]),
      'balanceAmount' : new FormControl({value : 0 , disabled : true},[Validators.required]),
      'advancePaymentMode' : new FormControl('CARD',[Validators.required]),
    });
    this.items = [];
    this.products = [];
    this.paymentOptions = [{'name' : 'CARD'},{'name' : 'ONLINE'},{'name' : 'CASH'}];
    this.loadInventoryItems();

    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    if(orderKey!=null || orderKey!=undefined)
    {
      this.isEditMode = true;
      this.loadOnEditMode(selectedDate , orderKey);
    }
  }

  loadOnEditMode(date : any , key : any)
  {
    this.isLoading = true;
    this.apiService.getOrder(date , key).subscribe((order : any)=>{
      sessionStorage.setItem("orderOnUpdate",JSON.stringify(order));
      this.regularOrderForm.patchValue({
        'totalAmount' : order.totalAmount,
        'advanceAmount' : order.advanceAmount,
        'balanceAmount' : order.balanceAmount,
        'advancePaymentMode' : order.advancePaymentMode
      });
      this.products = order.items;
      this.isLoading = false;
    });
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
    this.regularOrderForm.patchValue({
      'advanceAmount' : 0,
      'balanceAmount' : this.regularOrderForm.getRawValue().totalAmount,
    });
  }

  updateTotal()
  {
    let totalAmt = 0;
    this.products.forEach((element : any)=>{
      totalAmt+=element.total;
    });
    this.regularOrderForm.patchValue({
      'totalAmount' : totalAmt,
    })
  }

  checkValueChange()
  {
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
    // this.updateFormValue();
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
      this.router.navigate(['/']);
      this.apiService.sendWhatsapp(orderId,true);
      sessionStorage.clear();
    })
  }

  deleteProduct(product:any)
  {
    this.products = this.products.filter((p:any)=>{
      return JSON.stringify(p)!=JSON.stringify(product);
    });
    this.updateTotal();
  }

  updateBalance(advancePaid : any)
  {
    let adv = Number(advancePaid.target.value);
    let total = this.regularOrderForm.getRawValue().totalAmount;
    this.regularOrderForm.patchValue({
      'balanceAmount' : total - adv,
    });
  }

  updateRegularOrder()
  {
    this.isLoading = true;
    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    let regularOrderInfo = {...this.regularOrderForm.getRawValue() , 'items' : this.products};
    this.apiService.updateOrder(selectedDate , orderKey , regularOrderInfo).subscribe(()=>{
      this.isLoading = false;
      this.router.navigate(['/']);
      this.apiService.sendUpdateOrderWhatsapp(orderKey , true);
      sessionStorage.clear();
      //send whatsapp here.
    });
  }

  

}
