import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-monthly-sales',
  templateUrl: './monthly-sales.component.html',
  styleUrls: ['./monthly-sales.component.scss']
})
export class MonthlySalesComponent implements OnInit {

  dateObjectFromUI:any;
  date:any;
  isLoading:boolean = false;
  loadedOrders:any = [];
  selectedOrderTypeForSales:any = [];

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
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
    console.log(this.selectedOrderTypeForSales);
  }

}
