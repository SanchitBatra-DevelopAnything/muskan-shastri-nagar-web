import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  customerForm:FormGroup;

  constructor(private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.customerForm = new FormGroup({
      'customerName' : new FormControl('',[Validators.required]),
      'Address' : new FormControl('',[Validators.required]),
      'Contact' : new FormControl('',[Validators.required]),
      'bookingDate' : new FormControl('',[Validators.required]),
      'deliveryDate' : new FormControl('' , [Validators.required]),
      'deliveryTime' : new FormControl('',[Validators.required]),
      'deliveryType' : new FormControl('',[Validators.required])
   });
  }

  print() : void
  {
    console.log(this.customerForm.value);
    this.utilityService.formChange.next(2);
  }

}
