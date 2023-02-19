import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  items : {itemName : string , price : number}[];
  itemKeys : string[];
  isLoading : boolean;

  constructor(private apiService:ApiService,private router:Router) { }

  ngOnInit(): void {
    this.getAllItems();
  }

  getAllItems()
  {
    this.isLoading = true;
    this.apiService.getInventoryItems().subscribe((allItems)=>{
      if(allItems == null)
      {
        this.itemKeys = [];
        this.items = [];
        this.isLoading = false;
        return;
      }
      this.items = Object.values(allItems);
      this.itemKeys = Object.keys(allItems);
      this.isLoading = false;
    });
  }

  addNewItem()
  {
    this.router.navigate(['/inventory/form/new']);
  }

  deleteItem(index:number)
  {
    this.isLoading = true;
    this.apiService.deleteItemFromInventory(this.itemKeys[index]).subscribe((_)=>{
      this.getAllItems();
      this.isLoading = false;
    }); 
  }

  editItem(index:number)
  {
    let item = this.items[index].itemName;
    let sp = this.items[index].price;
    let key = this.itemKeys[index];
    this.router.navigate(['/inventory/form/'+key]);
  }

}
