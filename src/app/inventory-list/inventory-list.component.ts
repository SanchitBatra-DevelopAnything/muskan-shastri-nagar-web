import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  items : any;
  filteredItems : any;
  itemKeys : string[];
  isLoading : boolean;
  searchFor:string;

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
        this.filteredItems =[];
        this.isLoading = false;
        return;
      }
      this.items = Object.values(allItems);
      this.itemKeys = Object.keys(allItems);
      this.addItemKeys();
      this.filteredItems = [...this.items];
      this.isLoading = false;
    });
  }

  addItemKeys()
  {
    for(let i=0;i<this.items.length;i++)
    {
      this.items[i] = {...this.items[i] , "itemKey" : this.itemKeys[i]};
    }
    for(let i=0;i<this.items.length;i++)
    {
      console.log(JSON.stringify(this.items[i]));
    }
  }

  addNewItem()
  {
    this.router.navigate(['/inventory/form/new']);
  }

  deleteItem(index:number)
  {
    this.isLoading = true;
    this.apiService.deleteItemFromInventory(this.filteredItems[index].itemKey).subscribe((_)=>{
      this.getAllItems();
      this.isLoading = false;
    }); 
    this.searchFor = "";
  }

  editItem(index:number)
  {
    console.log(JSON.stringify(this.filteredItems[index]));
    let item = this.filteredItems[index].itemName;
    let sp = this.filteredItems[index].price;
    let key = this.filteredItems[index].itemKey;
    this.searchFor = "";
    this.router.navigate(['/inventory/form/'+key]);
  }

  filterInventory()
  {
    
    if(this.searchFor.toString().trim().length == 0)
    {
      this.filteredItems = [...this.items];
      return;
    }
    this.filteredItems = this.items.filter((itemObj : any)=>{
      if(itemObj.itemName.toString().trim().toLowerCase().includes(this.searchFor.toString().trim().toLowerCase()))
      {
        return true;
      }
      return false;
    });
  }

}
