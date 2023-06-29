import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  type:string = "";

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.params['type'];
  }

}
