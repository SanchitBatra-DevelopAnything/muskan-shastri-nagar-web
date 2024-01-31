import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { EditorderServiceService } from '../services/editorder-service.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  itemForm:UntypedFormGroup;
  imageUrl:string|ArrayBuffer|null;
  photoUrl:string|ArrayBuffer|null;
  isUploading:boolean = false;
  selectedImage:any;
  selectedPhotoOnCake:any;
  isLoading:boolean = false;
  paymentOptions:any;


  constructor(private storage : AngularFireStorage,private utilityService : UtilityService,private apiService : ApiService,private router:Router,private route:ActivatedRoute,private editOrderService:EditorderServiceService) { }

  ngOnInit(): void {
    let action = this.route.snapshot.params['action'];
    if(action === "edit")
    {
      let order = this.editOrderService.getCustomOrder();
      console.log(order);
      this.itemForm = new UntypedFormGroup({
        'imgUrl' : new UntypedFormControl(order['imgUrl']),
        'photoUrl' : new UntypedFormControl(order['photoUrl']),
        'weight' : new UntypedFormControl(order['weight'],[Validators.required]),
        'flavour' : new UntypedFormControl(order['flavour'] , [Validators.required]),
        'totalAmount' : new UntypedFormControl(order['totalAmount'],[Validators.required]),
        'balanceAmount' : new UntypedFormControl(order['balanceAmount'],[Validators.required]),
        'advanceAmount' : new UntypedFormControl(order['advanceAmount'],[Validators.required]),
        'message' : new UntypedFormControl(order['message']),
        'particulars' : new UntypedFormControl(order['particulars']),
        'advancePaymentMode' : new UntypedFormControl(order['advancePaymentMode'] , [Validators.required]),
      });
      this.imageUrl=order['imgUrl'];
      this.photoUrl=order['photoUrl'];
    }
    else
    {
      this.itemForm = new UntypedFormGroup({
        'imgUrl' : new UntypedFormControl(''),
        'photoUrl' : new UntypedFormControl('not-uploaded'),
        'weight' : new UntypedFormControl(1,[Validators.required]),
        'flavour' : new UntypedFormControl(null , [Validators.required]),
        'totalAmount' : new UntypedFormControl(null,[Validators.required]),
        'balanceAmount' : new UntypedFormControl(null,[Validators.required]),
        'advanceAmount' : new UntypedFormControl(null,[Validators.required]),
        'message' : new UntypedFormControl(''),
        'particulars' : new UntypedFormControl(''),
        'advancePaymentMode' : new UntypedFormControl('CARD' , [Validators.required]),
      });  
    }
    
    this.paymentOptions = [{'name' : 'CARD'},{'name' : 'ONLINE'},{'name' : 'CASH'}];

    if(!this.firstTime())
    {
      let customOrderInfo = null;
    if(sessionStorage.getItem("customOrderDetails")!=null)
    {
      customOrderInfo = JSON.parse(sessionStorage.getItem("customOrderDetails")+"");
      console.log("DETAILS = ");
      console.log(customOrderInfo);
    }
    this.itemForm.patchValue({
      'weight' : customOrderInfo.weight,
      'flavour' : customOrderInfo.flavour,
      'totalAmount' : customOrderInfo.totalAmount,
      'balanceAmount' : customOrderInfo.balanceAmount,
      'message' : customOrderInfo.message,
      'particulars' : customOrderInfo.particulars
    });
    }
  }

  firstTime()
  {
    return sessionStorage.getItem("customOrderDetails")==null||undefined;
  }

  goBack()
  {
    console.log(JSON.stringify(this.itemForm.value));
    console.log(this.itemForm.value);
    sessionStorage.setItem("customOrderDetails",JSON.stringify(this.itemForm.value));
    this.utilityService.formChange.next(1);
  }

  onFileChange(event:any) {
    this.isLoading = true;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.selectedImage = event.target.files[0];
        console.log("calling upload");
        this.onUpload();
      };
    }
    
  }

  onPhotoFileChange(event:any) {
    this.isLoading = true;
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.photoUrl = reader.result;
        this.selectedPhotoOnCake = event.target.files[0];
        console.log("Calling photo upload");
        this.onPhotoUpload();
      };
    }
  }

  onUpload()
  {
    console.log("UPLOAD CALLED");
      
    
      var filePath = `customCakes/${this.selectedImage.name}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          //RETRIEVING THE UPLOADED IMAGE URL.
          fileRef.getDownloadURL().subscribe((url)=>{
            this.itemForm.patchValue({
              'imgUrl' : url
            });
            console.log(url);
            this.isLoading = false;
          });
        })
      ).subscribe();
    
  }

  onPhotoUpload():any
  { 
      var filePath = `customCakes/${this.selectedPhotoOnCake.name}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);
      return this.storage.upload(filePath,this.selectedPhotoOnCake).snapshotChanges().pipe(
        finalize(()=>{
          //RETRIEVING THE UPLOADED IMAGE URL.
          fileRef.getDownloadURL().subscribe((url)=>{
            this.itemForm.patchValue({
              'photoUrl' : url
            });
            console.log(url);
            this.isLoading = false;
          });
        })
      ).subscribe();
  }

  submitForm()
  {
    alert("Custom order will be placed and whatsapp will be sent on OK");
    this.isLoading = true;
    sessionStorage.setItem("customOrderDetails" , JSON.stringify(this.itemForm.value));
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let customOrderInfo = JSON.parse(sessionStorage.getItem("customOrderDetails")+"");

    const customOrder = {
      ...customerInfo,
      ...customOrderInfo
    };


    let action = this.route.snapshot.params['action'];
    if(action === "edit")
    {
      let order = this.editOrderService.getCustomOrder();
      //this is actually editiing the order.
      this.apiService.addCustomOrder(customOrder,true,order['orderKey']).subscribe((orderId)=>{
        //sessionStorage.clear();
        this.apiService.addHistory(customOrder , order['orderKey']).subscribe((_)=>{
          this.isLoading = false;
          let action = this.route.snapshot.params['action'];
          this.apiService.sendWhatsapp({'name' : order['orderKey']},"custom",true);
          sessionStorage.clear();
          this.router.navigate(['/']);
        });
      });
    }
    else
    {
      this.apiService.addCustomOrder(customOrder,false,"").subscribe((orderId)=>{
        //sessionStorage.clear();
        this.apiService.addHistory(customOrder , orderId['name']).subscribe((_)=>{
            this.isLoading = false;
            this.apiService.sendWhatsapp(orderId,"custom",false);
            sessionStorage.clear();
            this.router.navigate(['/']);
        });
      });
    }  
  }
}
