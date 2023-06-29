import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'muskan-shastri-nagar';
  showHeader:boolean = true;
  dueMessage = "";
  off = true;

  constructor(private apiService:ApiService,private router:Router) {
    
}
  ngOnInit()
  {
    this.apiService.getMaintenanceDetails().subscribe((details)=>{
      if(details == null)
      {
        return;
      }
      let mainDetails  : any= Object.values(details);
      console.log(mainDetails);
      if(mainDetails[0]['showMessage'] == true)
      {
        this.off = mainDetails[0]['off'];
        console.log(this.off);
        if(this.off)
        {
          //redirect band karo application
          sessionStorage.setItem("disconnected" , "YES");
          this.goToPayment(true);
        }
        else
        {
          this.dueMessage = "Maintenance Payment due in "+mainDetails[0]['due']+" Please pay to avoid disconnection.";
        }
      }
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check the current route here
        if (this.router.url.includes("/detail") || this.router.url.includes("/chef") || this.router.url.includes('/payment')) {
          this.showHeader = false; // Set a boolean flag to hide something
        } else {
          this.showHeader = true; // Set the flag to show something
        }
      }
    });
  }

  goToPayment(disconnected : boolean = false)
  {
    if(disconnected == true)
    {
      this.router.navigate(['payment/disconnected']);
    }
    else
    {
      this.router.navigate(['payment/connected']);
    }
  }
}