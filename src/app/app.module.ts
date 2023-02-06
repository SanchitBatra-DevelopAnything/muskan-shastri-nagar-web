import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

const appRoutes : Routes = [
  {path : '' , component : ContainerComponent},
]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContainerComponent,
    PageLocationComponent,
    CustomerFormComponent,
    ItemFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    BrowserAnimationsModule,

    RouterModule.forRoot(appRoutes,{useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
