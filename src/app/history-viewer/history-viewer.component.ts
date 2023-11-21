import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-history-viewer',
  templateUrl: './history-viewer.component.html',
  styleUrls: ['./history-viewer.component.scss']
})
export class HistoryViewerComponent implements OnInit {

  orderKey:string;
  isLoading:boolean = false;
  history:any;
  constructor(private apiService:ApiService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.orderKey = this.route.snapshot.params['orderKey'];
    this.isLoading = true;
    this.apiService.getHistory(this.orderKey).subscribe((historyObject:any)=>{
      this.history = Object.values(historyObject);
      console.log(this.history);
      
    });
  }

}
