import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {

  inventoryForm:FormGroup;
  isInsertingItem:boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.inventoryForm = new FormGroup({
      'itemName' : new FormControl(null,[Validators.required]),
      'price' : new FormControl(null,[Validators.required])
    })
  }

  onSubmit()
  {
    console.log(this.inventoryForm.value);
  }

}
