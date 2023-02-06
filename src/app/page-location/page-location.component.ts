import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-location',
  templateUrl: './page-location.component.html',
  styleUrls: ['./page-location.component.scss']
})
export class PageLocationComponent implements OnInit {

  formStep:string = "1";

  constructor() { }

  ngOnInit(): void {
    this.formStep = "1";
  }

}
