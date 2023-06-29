import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, of } from 'rxjs';
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
  type : string;



  constructor(private apiService:ApiService , private router : Router , private route:ActivatedRoute) {
   }

  ngOnInit(): void {
    this.todaysDate = this.getTodaysDate();
    this.getActiveOrders();
    const obs$ = interval(180000);
    obs$.subscribe((d)=>{
      this.todaysDate = this.getTodaysDate();
      this.getActiveOrders();
    });
    this.selectedDate = this.todaysDate;
    this.mobileNumber = "";
    this.type = this.route.snapshot.params['type'];
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
      this.markRegularOrdersPrepared();
      this.isLoading = false;
    });
  }

  editOrder(order : any , index : any)
  {
    let deliveryDate = order.deliveryDate;
    let key = this.activeOrderKeys[index];
    this.router.navigate(['/editOrder/'+deliveryDate+'/regular/'+key+"/"+this.type]);
  }

  editCustomOrder(order:any , index:any)
  {
    let deliveryDate = order.deliveryDate;
    let key = this.customOrderKeys[index];
    this.router.navigate(['editOrder/'+deliveryDate+'/custom/'+key+"/"+this.type]);
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
      this.markRegularOrdersPrepared();
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
    this.markRegularOrdersPrepared();
  }

  markRegularOrdersPrepared()
  {
    
    for(let i=0;i<this.activeOrders.length;i++)
    {
      let count = 0;
      let totalItems = this.activeOrders[i].items.length;
      console.log(this.activeOrders[i].items);
      for(let j=0;j<this.activeOrders[i].items.length;j++)
      {
        if(this.activeOrders[i].items[j].prepared == "YES")
        {
          count++;
        }
      }
      if(count == totalItems)
      {
        if(this.activeOrders[i].status == "ND")
        {
          this.activeOrders[i].status = "P";
        }
      }
    }
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

  sendToChef()
  {
    this.isLoading = true;
    var cakeToken = "";
    var snacksToken = "";
    if(this.doOrdersHaveSnacks())
    {
      this.apiService.findToken("snacks").subscribe((tokenData : any)=>{
        if(tokenData == null)
        {
          snacksToken = "";
        }
        else
        {
          snacksToken = tokenData["token"];
          this.apiService.sendNotificationToParticularDevice("NEW REGULAR ORDERS AVAILABLE!" , "Please open the application.",snacksToken).subscribe((_)=>{
            this.isLoading = false;
          });
        }
      });
    }
    if(this.doOrdersHaveCakes())
    {
      console.log("Orders have cakes , getting cakes token");
      this.apiService.findToken("cakes").subscribe((tokenData:any)=>{
        if(tokenData == null)
        {
          cakeToken = "";
        }
        else
        {
          cakeToken = tokenData["token"];
          this.apiService.sendNotificationToParticularDevice("NEW REGULAR ORDERS AVAILABLE!" , "Please open the application.",cakeToken).subscribe((_)=>{
            this.isLoading = false;
          });
        }
      });
    }
     
    
  }

  sendCustomToChef()
  {
    this.isLoading = true;
      var cakeToken = "";
      console.log("Orders have cakes , getting cakes token");
      this.apiService.findToken("cakes").subscribe((tokenData:any)=>{
        if(tokenData == null)
        {
          cakeToken = "";
        }
        else
        {
          cakeToken = tokenData["token"];
          this.apiService.sendNotificationToParticularDevice("NEW CUSTOM ORDERS AVAILABLE!" , "Please open the application.",cakeToken).subscribe((_)=>{
            this.isLoading = false;
          });
        }
      });
    
  }

  doOrdersHaveSnacks()
  {
    for(let index = 0;index<this.activeOrders.length;index++)
    {
      let itemList = this.activeOrders[index]["items"];
      for(let i=0;i<itemList.length;i++)
      {
        if(!itemList[i]["itemType"].toLowerCase().includes("cake"))
        {
          return true;
        }
      }
    }
    return false;
  }

  doOrdersHaveCakes()
  {
    if(this.customOrders.length!=0)
    {
      return true;
    }

    for(let index = 0;index<this.activeOrders.length;index++)
    {
      let itemList = this.activeOrders[index]["items"];
      for(let i=0;i<itemList.length;i++)
      {
        if(itemList[i]["itemType"].toLowerCase().includes("cake"))
        {
          return true;
        }
      }
    }
    return false;
  }
}
