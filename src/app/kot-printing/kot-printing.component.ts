import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-kot-printing',
  templateUrl: './kot-printing.component.html',
  styleUrls: ['./kot-printing.component.scss']
})
export class KotPrintingComponent implements OnInit {


  order:any;
  date:any;
  orderKey:any;
  isLoading:boolean = false;

  constructor(private route:ActivatedRoute , private apiService : ApiService) { }
  ngOnInit(): void {

    this.date = this.route.snapshot.params['date'];
    this.orderKey = this.route.snapshot.params['key'];

    this.fetchOrderDetails();

  }

  fetchOrderDetails()
  {
    this.isLoading = true;
    this.apiService.getOrder(this.date,this.orderKey).subscribe((order)=>{
      if(order ==  null || order == undefined)
      {
        this.order = {};
        this.isLoading = false;
        return;
      }
      this.order = order;
      this.isLoading = false;
    })
  }

}
