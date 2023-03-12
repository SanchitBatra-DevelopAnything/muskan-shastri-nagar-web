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
  selectedDate: any;
  mobileNumber:any;


  constructor(private apiService:ApiService , private router : Router) { }

  ngOnInit(): void {
    this.todaysDate = this.getTodaysDate();
    this.getActiveOrders();
    this.selectedDate = this.todaysDate;
    this.mobileNumber = "";
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

  editOrder(order : any , index : any)
  {
    let deliveryDate = order.deliveryDate;
    let key = this.activeOrderKeys[index];
    this.router.navigate(['/editOrder/'+deliveryDate+'/regular/'+key]);
  }

  editCustomOrder(order:any , index:any)
  {
    let deliveryDate = order.deliveryDate;
    let key = this.customOrderKeys[index];
    this.router.navigate(['editOrder/'+deliveryDate+'/custom/'+key]);
  }

  filterOrders()
  {
    this.isLoading = true;
    this.activeOrders = [];
    this.activeOrderKeys = [];
    this.customOrders = [];
    this.customOrderKeys = [];
    this.apiService.getActiveOrders(this.selectedDate).subscribe((orders)=>{
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
      if(this.mobileNumber != "")
      {
        this.filterRegular();
        this.filterCustom();
      }
      this.isLoading = false;
    });
  }

  filterRegular()
  {
    let filteredRegularOrders = [];
    let filteredRegularKeys: any[] = [];
    let regIndex=0;
    filteredRegularOrders = this.activeOrders.filter((order:any)=>{
      if(order.Contact.toString() == this.mobileNumber)
      {
        filteredRegularKeys.push(this.activeOrderKeys[regIndex]);
        return true;
      }
      regIndex++;
      return false;
    });
    this.activeOrders = [...filteredRegularOrders];
    this.activeOrderKeys = [...filteredRegularKeys]; 
  }

  filterCustom()
  {
    let filteredCustomOrders = [];
    let filteredCustomKeys: any[] = [];
    let customIndex=0;
    console.log(this.customOrders.length+" custom orders found in total  , starting filtering");
    filteredCustomOrders = this.customOrders.filter((order:any)=>{
      if(order.Contact.toString() == this.mobileNumber)
      {
        filteredCustomKeys.push(this.customOrderKeys[customIndex]);
        return true;
      }
      customIndex++;
      return false;
    });
    console.log(filteredCustomOrders);
    this.customOrders = [...filteredCustomOrders];
    this.customOrderKeys = [...filteredCustomKeys]; 
  }

  getStatus(shortForm:string)
  {
    if(shortForm == "D")
    {
      return "DELIVERED";
    }
    if(shortForm == "ND")
    {
      return "IN PROGRESS";
    }
    if(shortForm == "P")
    {
      return "PREPARED";
    }
    if(shortForm == "C")
    {
      return "CANCELLED";
    }
    return "";
  }
}
