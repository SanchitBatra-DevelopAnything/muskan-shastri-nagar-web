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

  constructor(private activeRoute:ActivatedRoute,private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.formChangeSub = this.utilityService.formChange.subscribe((formNum:number)=>{
      this.formNumber = formNum;
    });
    let orderType = this.activeRoute.snapshot.params['orderType'];
    if(orderType == "REGULAR" || orderType == "COUNTER")
    {
      this.isCustomOrderSelected = false;
      if(orderType == "COUNTER")
      {
        this.isCounterOrder = true;
      }
    }
    else
    {
      this.isCustomOrderSelected = true;
      this.isCounterOrder = false;
    }
  }

  ngOnDestroy():void {
    this.formChangeSub.unsubscribe();
  }

}
