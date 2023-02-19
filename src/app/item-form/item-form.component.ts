import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  itemForm:FormGroup;
  imageUrl:string|ArrayBuffer|null;
  photoUrl:string|ArrayBuffer|null;
  isUploading:boolean = false;
  selectedImage:any;
  selectedPhotoOnCake:any;
  isLoading:boolean = false;


  constructor(private storage : AngularFireStorage,private utilityService : UtilityService,private apiService : ApiService,private router:Router) { }

  ngOnInit(): void {
    this.itemForm = new FormGroup({
      'imgUrl' : new FormControl(''),
      'photoUrl' : new FormControl('not-uploaded'),
      'weight' : new FormControl(1,[Validators.required]),
      'quantity' : new FormControl(null , [Validators.required]),
      'price' : new FormControl(null,[Validators.required]),
      'totalAmount' : new FormControl(null,[Validators.required]),
      'balanceAmount' : new FormControl(null,[Validators.required]),
      'advanceAmount' : new FormControl(null,[Validators.required]),
      'message' : new FormControl(''),
      'designCharges' : new FormControl(null),
      'particulars' : new FormControl(''),
    });

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
      'quantity' : customOrderInfo.quantity,
      'price' : customOrderInfo.price,
      'totalAmount' : customOrderInfo.totalAmount,
      'balanceAmount' : customOrderInfo.balanceAmount,
      'message' : customOrderInfo.message,
      'designCharges' : customOrderInfo.designCharges,
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
    // this.isLoading = true;
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
      return this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
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
    this.isLoading = true;
    sessionStorage.setItem("customOrderDetails" , JSON.stringify(this.itemForm.value));
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfo")+"");
    let customOrderInfo = JSON.parse(sessionStorage.getItem("customOrderDetails")+"");

    const customOrder = {
      ...customerInfo,
      ...customOrderInfo
    };

    this.apiService.addCustomOrder(customOrder).subscribe(()=>{
      sessionStorage.clear();
      this.isLoading = false;
      this.router.navigate(['/']);
    }); 
  }
  

}
