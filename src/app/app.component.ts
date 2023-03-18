import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'muskan-shastri-nagar';
  showHeader:boolean = true;

  constructor(private router:Router) {
    
}
  ngOnInit()
  {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check the current route here
        if (this.router.url.includes("/detail") || this.router.url.includes("/chef")) {
          this.showHeader = false; // Set a boolean flag to hide something
        } else {
          this.showHeader = true; // Set the flag to show something
        }
      }
    });
  }
}