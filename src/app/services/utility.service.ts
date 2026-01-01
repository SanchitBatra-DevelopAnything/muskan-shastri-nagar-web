import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  formChange:Subject<number>;
  loggedInSuccessfully:Subject<boolean>;

  constructor() { 
    this.formChange = new Subject<number>();
    this.loggedInSuccessfully = new Subject<boolean>();
  }

  computeLogo(){
  if(localStorage.getItem('shop') === 'LOVELY BAKERS' || localStorage.getItem('shop') === 'SONA BAKERS')
  {
    return "../../assets/lovely.jpeg"
  }
  return "../../assets/sweetShop.jpeg";
}
}
