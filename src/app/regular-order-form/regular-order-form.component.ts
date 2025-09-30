import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { EditorderServiceService } from '../services/editorder-service.service';
import { UtilityService } from '../services/utility.service';

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
  deliveredTo:string = "";
  isDelivered:boolean = false;

  products:any;
  paymentOptions:any;

  regularOrderForm:FormGroup;

  isCancelled:boolean = false;
  isPrepared:boolean = false;

  deliveryDate:string;
  deliveryTime:string;
  showGramLabel:boolean = false;

  type:string;
  orderType:string;



  constructor(private apiService:ApiService , private router : Router , private route:ActivatedRoute , private utilityService:UtilityService , private editOrderService:EditorderServiceService) { 
  }

  ngOnInit(): void {

    let action = this.route.snapshot.params['action'];
    if(action === "edit")
    {
      let order = this.editOrderService.getRegularOrder();
      sessionStorage.setItem("orderOnUpdate" , JSON.stringify(order));
      this.regularOrderForm = new FormGroup({
        'totalAmount' : new FormControl({value : order['totalAmount'] , disabled : true},[Validators.required]),
        'advanceAmount' : new FormControl(order['advanceAmount'] , [Validators.required]),
        'balanceAmount' : new FormControl({value : order['balanceAmount'] , disabled : true},[Validators.required]),
        'discount':new FormControl(order['discount'],[Validators.required]),
        'advancePaymentMode' : new FormControl(order['advancePaymentMode'],[Validators.required]),
        'particulars' : new FormControl(order['particulars']),
      });
      this.items = [];
      this.items = order['items'];
      this.products = [...this.items];
      console.log("EDIT RECOGNIZED");
    }
    else
    {
      this.regularOrderForm = new FormGroup({
        'totalAmount' : new FormControl({value : 0 , disabled : true},[Validators.required]),
        'advanceAmount' : new FormControl(null , [Validators.required]),
        'balanceAmount' : new FormControl({value : 0 , disabled : true},[Validators.required]),
        'discount' : new FormControl(0,[Validators.required]),
        'advancePaymentMode' : new FormControl('CARD',[Validators.required]),
        'particulars' : new FormControl(''),
      });
      this.items = [];
      this.products = [];
    }

    this.paymentOptions = [{'name' : 'CARD'},{'name' : 'ONLINE'},{'name' : 'CASH'}];
    this.loadInventoryItems();

    let selectedDate = this.route.snapshot.params['date'];
    let orderKey = this.route.snapshot.params['key'];
    if(orderKey!=null || orderKey!=undefined)
    {
      this.isEditMode = true;
      console.log("orderKey was not null , so edit recognized");
      this.loadOnEditMode(selectedDate , orderKey);
    }
    this.type = this.route.snapshot.params['type'];
    if(this.type == null || this.type == undefined)
    {
      this.type = "owner";
    }

    this.orderType = this.route.snapshot.params['orderType'];

  }

  isCounterOrder()
  {
    if(this.orderType.toString().toLowerCase() == "counter")
    {
      console.log("YES COUNTER ORDER");
      return true;
    }
    return false;
  }

  loadOnEditMode(date : any , key : any)
  {
    this.isLoading = true;
    this.apiService.getOrder(date , key).subscribe((order : any)=>{
      console.log("Load on edit method ne ye order liya : "+JSON.stringify(order));
      this.regularOrderForm.patchValue({
        'totalAmount' : order.totalAmount,
        'advanceAmount' : order.advanceAmount,
        'balanceAmount' : order.balanceAmount,
        'discount' : order.discount,
        'advancePaymentMode' : order.advancePaymentMode,
        'particulars' : order.particulars,
      });
      this.products = order.items;
      this.deliveryDate = order.deliveryDate;
      this.deliveryTime = order.deliveryTime;
      if(order.status == "D")
      {
        this.isDelivered = true;
        this.deliveredTo = order.deliveredTo;
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
      let formedName = `${this.currentPound}Pound. ${this.selectedItem.itemName}`;
      let productPrice = this.currentPound * this.selectedItem.price;
      let quantity = this.currentQuantity;
      let totalPrice = this.currentQuantity * productPrice;
      this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice , 'prepared' : 'NO' , "itemType" : "CAKES" , "weight" : this.currentPound});
    }
    else
    {
      let formedName = this.selectedItem.itemName;
      let productPrice = this.selectedItem.price;
      let quantity = this.currentQuantity;
      let totalPrice = quantity * productPrice;
      if(this.selectedItem.type.includes('PANEER'))
      {
        this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice , 'prepared' : 'NO' , "itemType" : "PANEER & CHAAP"});  
      }
      else if(this.selectedItem.type.includes('PASTRIES'))
      {
        this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice , 'prepared' : 'NO' , "itemType" : "CAKES"});  
      }
      else if(this.selectedItem.type.toLowerCase().includes('factory'))
      {
        this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice , 'prepared' : 'YES' , "itemType" : "FACTORY ITEM"}); //factory items mobile app par nahi jaayenge , and assumed already prepared as per requirement. taaki green dot aaye.  
      }
      else
      {
        this.products.push({'name' : formedName , 'pricePerProduct' : productPrice , 'quantity' : quantity , 'total' : totalPrice , 'prepared' : 'NO' , "itemType" : "SNACKS"});
      }
    }
    this.currentQuantity = 0;
    this.currentPound = 0; 
    this.selectedItem = {};
    this.showPoundInput = false;
    this.updateTotal();
    // this.regularOrderForm.patchValue({
    //   'advanceAmount' : 0,
    //   'balanceAmount' : this.regularOrderForm.getRawValue().totalAmount,
    // });
     this.regularOrderForm.patchValue({
       'balanceAmount' : this.regularOrderForm.getRawValue().totalAmount - this.regularOrderForm.getRawValue().advanceAmount,
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
      this.showGramLabel = false;
      this.showPoundInput = true;
    }
    else
    {
      if(this.selectedItem.type.includes("PANEER"))
      {
        this.showGramLabel = true;
      }
      {
        this.showGramLabel = false;
      }
      this.showPoundInput = false;
    }
  }

  createRegularOrder()
  {
    alert("Order will be placed , and whatsapp will be sent on OK");
    console.log(this.regularOrderForm.getRawValue());
    let regularOrderInformation = {...this.regularOrderForm.getRawValue() , 'items' : this.products};
    this.isLoading = true;
    sessionStorage.setItem("regularOrderDetails" , JSON.stringify(regularOrderInformation));
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let regularOrderInfo = JSON.parse(sessionStorage.getItem("regularOrderDetails")+"");

    const regularOrder = {
      ...customerInfo,
      ...regularOrderInfo
    };

    let action = this.route.snapshot.params['action'];
    if(action === "edit")
    {
      let order = this.editOrderService.getRegularOrder();
      //this is actually editiing the order.
      this.apiService.addRegularOrder(regularOrder,true,order['orderKey']).subscribe((_)=>{
        this.apiService.addHistory(regularOrder , order['orderKey']).subscribe((_:any)=>{
          let originalOrder = JSON.parse(sessionStorage.getItem('orderOnUpdate') || '{}');
          if(originalOrder['deliveryDate']!=null && originalOrder['deliveryDate']!=regularOrder['deliveryDate'])
          {
              this.apiService.updateOrder(originalOrder['deliveryDate'] , order['orderKey'] , {'status' : 'C'}).subscribe((_)=>{
              this.isLoading = false;
              let action = this.route.snapshot.params['action'];
              this.apiService.sendWhatsapp({'name' : order['orderKey']},"regular",true);
              sessionStorage.clear();
              this.router.navigate(['/']);
            });
          }
          else
          {
            this.isLoading = false;
          // this.sendWhatsapp(orderId);
            this.apiService.sendWhatsapp({'name' : order['orderKey']},"regular",true);
            this.router.navigate(['/']);
            sessionStorage.clear();
          }
        });
      });
    }
    else
    {
      this.apiService.addRegularOrder(regularOrder,false,"").subscribe((orderId)=>{
        this.apiService.addHistory(regularOrder , orderId['name']).subscribe((_)=>{
          this.isLoading = false;
        // this.sendWhatsapp(orderId);
        this.router.navigate(['/']);
        this.apiService.sendWhatsapp(orderId,"regular",false);
        sessionStorage.clear();
        })
      });
    }    
  }

  deleteProduct(product:any)
  {
    this.products = this.products.filter((p:any)=>{
      return JSON.stringify(p)!=JSON.stringify(product);
    });
    this.updateTotal();
    this.regularOrderForm.patchValue({
      'balanceAmount' : this.regularOrderForm.getRawValue().totalAmount - this.regularOrderForm.getRawValue().advanceAmount,
    });
  }

  updateBalance()
  {
    let adv = Number(this.regularOrderForm.getRawValue().advanceAmount);
    let discount = Number(this.regularOrderForm.getRawValue().discount);
    let total = this.regularOrderForm.getRawValue().totalAmount;
    this.regularOrderForm.patchValue({
      'balanceAmount' : total - adv - discount,
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
      this.apiService.sendUpdateOrderWhatsapp(orderKey , true , true);
      sessionStorage.clear();
      //send whatsapp here.
    });
  }

  // markAsPrepared()
  // {
  //   this.isLoading = true;
  //   let selectedDate = this.route.snapshot.params['date'];
  //   let orderKey = this.route.snapshot.params['key'];
  //   this.apiService.updateOrder(selectedDate,orderKey,{'status' : "P"}).subscribe(()=>{
  //     this.loadOnEditMode(selectedDate,orderKey);
  //     sessionStorage.clear();
  //   });
  // }

  getDeliveryDate(date:string)
  {
    return this.apiService.getUserFormatDate(date);
  }

  goBack()
  {
    this.utilityService.formChange.next(1);
  }
}
