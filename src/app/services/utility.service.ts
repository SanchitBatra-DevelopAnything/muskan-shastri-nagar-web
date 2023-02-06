import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  formChange:Subject<number>;

  constructor() { 
    this.formChange = new Subject<number>();
  }
}
