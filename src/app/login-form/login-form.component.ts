import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm : UntypedFormGroup;
  validUsers : any;
  isLoading : Boolean;
  internetProblem : Boolean;
  // @Output() isLoggedIn = new EventEmitter<Boolean>();

  constructor(private apiService : ApiService , private router: Router) {
    if(localStorage.getItem('user')!==null)
    {
      this.router.navigate(['/orderType']);
    }
  }

  ngOnInit(): void {

    this.loginForm = new UntypedFormGroup({
      'username' : new UntypedFormControl(null), 
      'password' : new UntypedFormControl(null)
    });

    this.isLoading = true;
    this.internetProblem = false;
    
    this.fetchAdmins();
  
  }
  onSubmit()
  {
    let adminIndex = this.isAdminRegistered(this.loginForm.value.username);
    let arr : {username : string , password : string}[];
    arr = Object.values(this.validUsers);
    if(adminIndex!=-1)
    {
      if(arr[adminIndex].password != this.loginForm.value.password)
      {
        alert('invalid password');
        return;
      }
      this.loginSuccessfull(adminIndex);
    }
    else
    {
      alert('Sorry , you are not registered!');
    }
  }

  isAdminRegistered(adminName:string) : number
  {
    let arr : {username : string , password : string}[];
    arr = Object.values(this.validUsers);
    for(let i=0;i<arr.length;i++)
    {
      if(arr[i].username == adminName)
      {
        return i;
      }
    }
    return -1;
  }

  loginSuccessfull(index:number) : void 
  {
    console.log(this.validUsers);
    localStorage.setItem('user' , this.loginForm.value.username);
    localStorage.setItem('loggedIn' , "true");
    localStorage.setItem('adminType' , this.validUsers[index]['type']);
    localStorage.setItem('shop',this.validUsers[index]['shop']);

    this.router.navigate(['/orderType']);
  }

  fetchAdmins()
  {
    this.validUsers =[{'username' : "muskan-admin" , 'password' : "muskan@admin@123" , "shop" : "Muskan Bakers and Sweets" , "type":"super-admin"},
      {'username' : "lovely-admin" , 'password' : "lovely@admin@123" , "shop" : "LOVELY BAKERS" , "type":"sub-admin"},
    ];
  }
}
