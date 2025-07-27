import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
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

}
