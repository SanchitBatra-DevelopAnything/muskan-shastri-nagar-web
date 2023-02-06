import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit,OnDestroy {

  formChangeSub : Subscription;
  formStep:number = 1;

  constructor(private utilityService : UtilityService) { }

  ngOnInit(): void {
    this.formChangeSub = this.utilityService.formChange.subscribe((formNum : number)=>{
      this.formStep = formNum;
    });
  }

  ngOnDestroy() : void {
    this.formChangeSub.unsubscribe();
  }

}
