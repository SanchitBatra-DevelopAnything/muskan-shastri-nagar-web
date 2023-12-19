import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit,OnDestroy {

  formChangeSub:Subscription;
  formNumber:number = 1;
  isCustomOrderSelected:boolean = false;
  isCounterOrder:boolean;
  isGiftOrder:boolean;
  action:any;

  constructor(private activeRoute:ActivatedRoute,private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.formChangeSub = this.utilityService.formChange.subscribe((formNum:number)=>{
      this.formNumber = formNum;
    });
    let orderType = this.activeRoute.snapshot.params['orderType'];
    this.action = this.activeRoute.snapshot.params['action'];
    if(orderType == "REGULAR" || orderType == "COUNTER" || orderType == "GIFT")
    {
      this.isCustomOrderSelected = false;
      if(orderType == "COUNTER")
      {
        this.isCounterOrder = true;
        this.isGiftOrder = false;
      }
      if(orderType == "GIFT")
      {
        this.isGiftOrder = true;
        this.isCounterOrder = false;
      }
    }
    else
    {
      this.isCustomOrderSelected = true;
      this.isCounterOrder = false;
      this.isGiftOrder = false;
    }
  }

  ngOnDestroy():void {
    this.formChangeSub.unsubscribe();
  }

}
