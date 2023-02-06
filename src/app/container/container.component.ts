import { Component, OnDestroy, OnInit } from '@angular/core';
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

  constructor(private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.formChangeSub = this.utilityService.formChange.subscribe((formNum:number)=>{
      this.formNumber = formNum;
    });
  }

  ngOnDestroy():void {
    this.formChangeSub.unsubscribe();
  }

}
