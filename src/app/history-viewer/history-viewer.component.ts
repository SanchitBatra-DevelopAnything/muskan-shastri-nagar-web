import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'app-history-viewer',
  templateUrl: './history-viewer.component.html',
  styleUrls: ['./history-viewer.component.scss']
})
export class HistoryViewerComponent implements OnInit {
  // private onCompare(_left: KeyValue<any, any>, _right: KeyValue<any, any>): number {
  //   return -1;
  // }

  orderKey:string;
  isLoading:boolean = false;
  history:any;
  itemsArrays:any = [];
  constructor(private apiService:ApiService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.orderKey = this.route.snapshot.params['orderKey'];
    this.isLoading = true;
    this.apiService.getHistory(this.orderKey).subscribe((historyObject:any)=>{
      this.history = Object.values(historyObject);
      this.itemsArrays =[];
      for(let i=0;i<this.history.length;i++)
      {
        if(this.history[i]['items']!=null && this.history[i]['items']!=undefined)
        {
          this.itemsArrays.push(this.history[i].items);
        }
      }
      console.log(this.history);
    });
  }

}
