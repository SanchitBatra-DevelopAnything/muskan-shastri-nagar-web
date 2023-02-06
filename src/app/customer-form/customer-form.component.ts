import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  customerForm:FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      'customerName' : new FormControl('',[Validators.required]),
      'Address' : new FormControl('',[Validators.required]),
      'Contact' : new FormControl('',[Validators.required]),
      'bookingDate' : new FormControl('',[Validators.required]),
      'deliveryDate' : new FormControl('' , [Validators.required]),
      'deliveryTime' : new FormControl('',[Validators.required]),
      'deliveryType' : new FormControl('0',[Validators.required])
   });
  }

}
