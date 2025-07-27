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
}
