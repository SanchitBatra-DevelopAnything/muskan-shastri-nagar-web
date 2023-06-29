import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit,DeactivationGuarded {

  type:string = "";

  constructor(private router:Router,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.type = this.route.snapshot.params['type'];
  }

  canDeactivate(): boolean | Observable<boolean> | Promise<boolean> {
    return false;
  }
}

export interface DeactivationGuarded {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean;
}
