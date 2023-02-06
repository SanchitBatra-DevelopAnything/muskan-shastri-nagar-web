import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {



  constructor(private utilityService : UtilityService) { }

  ngOnInit(): void {

  }

  goBack()
  {
    this.utilityService.formChange.next(1);
  }

}
