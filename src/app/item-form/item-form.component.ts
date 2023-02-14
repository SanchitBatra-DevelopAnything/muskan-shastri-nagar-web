import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {

  itemForm:FormGroup;
  imageUrl:string|ArrayBuffer|null;
  isUploading:boolean = false;
  selectedImage:any;


  constructor(private storage : AngularFireStorage,private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.itemForm = new FormGroup({
      'imgUrl' : new FormControl(''),
      'weight' : new FormControl(1,[Validators.required]),
      'quantity' : new FormControl(null , [Validators.required]),
      'price' : new FormControl(null,[Validators.required]),
      'totalAmount' : new FormControl(null,[Validators.required]),
      'balanceAmount' : new FormControl(null,[Validators.required]),
      'advanceAmount' : new FormControl(null,[Validators.required]),
      'message' : new FormControl(''),
      'designCharged' : new FormControl(null),
      'particulars' : new FormControl(''),
    });
  }

  goBack()
  {
    this.utilityService.formChange.next(1);
  }

  onFileChange(event:any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.selectedImage = event.target.files[0];
      };
    }
  }

  onUpload()
  {
    this.isUploading = true;
    if(this.itemForm.valid)
    {
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
            this.isUploading = false;
          });
        })
      ).subscribe();
    }
  }
  

}
