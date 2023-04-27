import { Component, OnInit } from '@angular/core';
import { throws } from 'assert';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.scss']
})
export class MonthlySalesComponent implements OnInit {

  dateObjectFromUI:any;
  //date:any;
  isLoading:boolean = false;
  loadedOrders:any = [];
  selectedOrderTypeForSales:any = [];
  items:any;
  selectedItem:any;
  enteredPounds:number;
  isSalesCalculated:boolean;
  isCalculatingSales:boolean = false;

  calculatedSales : any = {};

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.isSalesCalculated = false;
    this.loadInventory();
  }

  processDate()
  {
    var datex = new Date(this.dateObjectFromUI.toString().replace('IST', ''));
    let day = datex.getDate();
    let month = datex.getMonth()+1;
    let year = datex.getFullYear();

    let modifiedMonth = month+"";
    if(month < 10)
    {
      modifiedMonth = "0"+modifiedMonth;
    }
    this.loadMonthlyOrders(modifiedMonth,year);
    
  }

  loadMonthlyOrders(modifiedMonth : string,year : number)
  {
    this.isLoading = true;
    this.apiService.loadMonthlyOrders(modifiedMonth , year.toString()).subscribe((allOrders)=>{
      if(allOrders == null)
      {
        this.loadedOrders = {};
        this.isLoading = false;
        return;
      }
      for(let i=0;i<Object.values(allOrders).length;i++)
      {
        let perDateObject : any = Object.values(allOrders)[i];
        for(const key in perDateObject)
        {
          this.loadedOrders.push(perDateObject[key]);
        }
      }
      this.isLoading = false;
    });
  }


  getRequiredSales()
  {
    this.isCalculatingSales = true;
    let orderType = "regular";
    if(this.selectedOrderTypeForSales.length == 1)
    {
      orderType = "custom";
    }

    let pounds = this.enteredPounds;
    if(orderType == "custom")
    {
      this.getCustomOrderSales(pounds);
    }
    else
    {
      this.getRegularOrderSales(pounds);
    }
    this.isCalculatingSales = false;
    this.isSalesCalculated = true;
  }

  flavourChanged()
  {
    //nothing of any sort.
  }

  loadInventory()
  {
    this.isLoading = true;
    this.apiService.getInventoryItems().subscribe((allItems)=>{
      if(allItems == null)
      {
        this.isLoading = false;
        this.items = [];
        return;
      }
      this.isLoading = false;
      this.items = Object.values(allItems);
    });
  }

  orderTypeChanged()
  {
    this.isCalculatingSales = false;
    this.isSalesCalculated = false;
  }

  getCustomOrderSales(pounds:number)
  {
    let customOrders = this.loadedOrders.filter((order:any)=>{
      return order.orderType == "custom";
    });
    if(customOrders == null || customOrders == undefined)
    {
      this.calculatedSales = {"totalAmount" : 0 , "totalQuantity" : 0};
      return;
    }
    let filteredCustomOrders = customOrders.filter((order:any)=>{
      return order.weight == pounds;
    });

    if(filteredCustomOrders == null || filteredCustomOrders == undefined)
    {
      this.calculatedSales = {"totalAmount" : 0 , "totalQuantity" : 0};
      return;
    }

    this.calculatedSales['totalAmount'] = this.getTotalOf(filteredCustomOrders);
    this.calculatedSales['totalQuantity'] = filteredCustomOrders.length;
  }

  getRegularOrderSales(pounds:number)
  {

  }

  getTotalOf(orders:any)
  {
    let total = 0;
    for(let i=0;i<orders.length;i++)
    {
      total+=orders[i].totalAmount;
    }
    return total;
  }



}
