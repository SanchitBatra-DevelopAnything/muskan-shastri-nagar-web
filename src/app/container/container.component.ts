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

  constructor(private activeRoute:ActivatedRoute,private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.formChangeSub = this.utilityService.formChange.subscribe((formNum:number)=>{
      this.formNumber = formNum;
    });
    let orderType = this.activeRoute.snapshot.params['orderType'];
    if(orderType == "REGULAR")
    {
      this.isCustomOrderSelected = false;
    }
    else
    {
      this.isCustomOrderSelected = true;
    }
  }

  ngOnDestroy():void {
    this.formChangeSub.unsubscribe();
  }

}
