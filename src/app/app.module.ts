import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireModule} from '@angular/fire/compat';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ContainerComponent } from './container/container.component';
import { PageLocationComponent } from './page-location/page-location.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OrderTypeSelectionComponent } from './order-type-selection/order-type-selection.component';
import { RegularOrderFormComponent } from './regular-order-form/regular-order-form.component';

const appRoutes : Routes = [
  {path : '' , component : OrderTypeSelectionComponent},
  {path : 'order/:orderType',component:ContainerComponent},
]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContainerComponent,
    PageLocationComponent,
    CustomerFormComponent,
    ItemFormComponent,
    OrderTypeSelectionComponent,
    RegularOrderFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,

    RouterModule.forRoot(appRoutes,{useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
