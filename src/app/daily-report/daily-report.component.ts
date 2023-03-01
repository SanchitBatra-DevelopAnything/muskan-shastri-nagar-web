import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-daily-report',
  templateUrl: './daily-report.component.html',
  styleUrls: ['./daily-report.component.scss']
})
export class DailyReportComponent implements OnInit {

  activeOrders : any = [];
  activeOrderKeys : any = [];
  customOrders  : any= [];
  customOrderKeys : any = [];
  isLoading : boolean;
  todaysDate : string;


  constructor(private apiService:ApiService , private router : Router) { }

  ngOnInit(): void {
    this.todaysDate = this.getTodaysDate();
    this.getActiveOrders();

  }

  getTodaysDate()
  {
    let fullDate = new Date();
    let date = fullDate.getDate();
    let modifiedDate = date.toString();
    if(date < 10)
    {
      modifiedDate = "0"+date;
    }
    let month = fullDate.getMonth() + 1;
    let modifiedMonth = month.toString();
    if(month < 10)
    {
      modifiedMonth = "0"+month;
    }
    let year = fullDate.getFullYear().toString();
    let formedDate = year+"-"+modifiedMonth+"-"+modifiedDate;
    return formedDate;
  }

  getActiveOrders()
  {
    this.isLoading = true;
    this.activeOrders = [];
    this.activeOrderKeys = [];
    this.customOrderKeys = [];
    this.customOrderKeys = [];
    this.apiService.getActiveOrders(this.todaysDate).subscribe((orders)=>{
      if(orders == null)
      {
        console.log(null);
        this.isLoading = false;
        this.activeOrderKeys = [];
        this.activeOrders = [];
        this.customOrderKeys = [];
        this.customOrders = [];
        return;
      }
      let temp_activeOrders : any = Object.values(orders);
      let temp_activeOrderKeys : any = Object.keys(orders);
      for(let i=0;i<temp_activeOrders.length;i++)
      {
        if(temp_activeOrders[i].orderType!=null  && temp_activeOrders[i].orderType.toLowerCase() === "custom")
        {
          this.customOrders.push(temp_activeOrders[i]);
          this.customOrderKeys.push(temp_activeOrderKeys[i]);
        }
        else
        {
          this.activeOrders.push(temp_activeOrders[i]);
          this.activeOrderKeys.push(temp_activeOrderKeys[i]);
        }
      }
      this.isLoading = false;
    });
  }

}
