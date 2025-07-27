import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit , OnDestroy{

  targetShop: string;
  loggedInSub:Subscription;

  constructor(private router:Router , private util:UtilityService) { }

  ngOnInit(): void {
    this.loggedInSub = this.util.loggedInSuccessfully.subscribe((isLoggedIn:boolean) => {
      if(isLoggedIn) {
        this.targetShop = localStorage.getItem('shop') || '';
      }
    }
    );
  }

  onLogout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  showLogout()
  {
    if(localStorage.getItem('user')!=null)
    {
      return true;
    }
    return false;
  }

  computeLogo()
  {
    return this.util.computeLogo();
  }

  ngOnDestroy(): void {
    this.loggedInSub.unsubscribe();
  }


}
