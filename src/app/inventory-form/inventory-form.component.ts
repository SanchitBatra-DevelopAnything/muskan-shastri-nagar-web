import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {

  inventoryForm:FormGroup;
  isInsertingItem:boolean = false;
  isLoading:boolean = false;
  isEditForm:boolean = false;
  itemKey:any = "new";
  itemTypeOptions:any = [{'type' : 'CAKES & PASTRIES'},{type : 'SNACKS & PATTIES'} , {type : 'PANEER & CHAAP'}];
  constructor(private apiService:ApiService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.inventoryForm = new FormGroup({
      'itemName' : new FormControl(null,[Validators.required]),
      'price' : new FormControl(null,[Validators.required]),
      'type' : new FormControl(null,[Validators.required])
    })

    this.itemKey = this.route.snapshot.params['key'];
    if(this.itemKey == "new")
    {
      this.isLoading= false;
      this.isEditForm = false;
    }
    else
    {
      this.isLoading = true;
      this.isEditForm = true;
      this.apiService.getInventoryItem(this.itemKey).subscribe((item)=>{
        this.inventoryForm.patchValue(({
          'itemName' : item['itemName'],
          'price' : item['price'],
          'type' : {'type' : item['type']}
        }));
        this.isLoading = false;
      });
    }
  }

  onSubmit()
  {
    this.isInsertingItem = true;
    this.updateFormValue();
    if(!this.isEditForm && this.itemKey=="new")
    {
      this.apiService.addItemToInventory(this.inventoryForm.value).subscribe((_)=>{
        this.isInsertingItem = false;
        this.inventoryForm.reset();
      })
    }
    else
    {
      this.apiService.editInventoryItem(this.itemKey,this.inventoryForm.value).subscribe((_)=>{
        this.isInsertingItem = false;
        this.inventoryForm.reset();
      })
    }
  }

  updateFormValue()
  {
    console.log(this.inventoryForm.value['type'].type);
    this.inventoryForm.patchValue({
      'type' : this.inventoryForm.value['type'].type,
    })
  }

}
