import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {

  inventoryForm:FormGroup;
  isInsertingItem:boolean = false;
  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.inventoryForm = new FormGroup({
      'itemName' : new FormControl(null,[Validators.required]),
      'price' : new FormControl(null,[Validators.required])
    })
  }

  onSubmit()
  {
    this.isInsertingItem = true;
    this.apiService.addItemToInventory(this.inventoryForm.value).subscribe((_)=>{
      this.isInsertingItem = false;
    })
  }

}
