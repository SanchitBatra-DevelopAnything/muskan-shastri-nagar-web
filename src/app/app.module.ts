import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFireModule} from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {TableModule} from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';

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
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryItemComponent } from './inventory-item/inventory-item.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { EditCustomOrderComponent } from './edit-custom-order/edit-custom-order.component';
import { KotPrintingComponent } from './kot-printing/kot-printing.component';
import { MonthlySalesComponent } from './monthly-sales/monthly-sales.component';
import { DeactivationGuarded, PaymentComponent } from './payment/payment.component';
import { HistoryViewerComponent } from './history-viewer/history-viewer.component';
import { JsonParsePipe } from './pipes/json-parse.pipe';
import { CustomGiftboxFormComponent } from './custom-giftbox-form/custom-giftbox-form.component';
import { EditGiftOrderComponent } from './edit-gift-order/edit-gift-order.component';

const appRoutes : Routes = [
  {path : '' , component : OrderTypeSelectionComponent,pathMatch:"full"},
  {path : 'order/:orderType/:action',component:ContainerComponent },
  {path : 'inventory' , component : InventoryListComponent },
  {path : 'inventory/form/:key' , component : InventoryFormComponent},
  {path : 'viewOrders/:type' , component : DailyReportComponent},
  {path : 'editOrder/:date/regular/:key/:type' , component : KotPrintingComponent},
  {path : 'editOrder/:date/custom/:key/:type' , component : EditCustomOrderComponent},
  {path : 'editOrder/:date/gift/:key/:type' , component : EditGiftOrderComponent},
  {path : 'detail/:date/:orderKey' , component : OrderDetailComponent},
  {path : 'monthlySales' , component : MonthlySalesComponent},
  {path : 'history/:orderKey' , component : HistoryViewerComponent},
  {path : 'payment/:type' , component : PaymentComponent , canDeactivate: [(comp: DeactivationGuarded) => comp.canDeactivate()],},
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
    RegularOrderFormComponent,
    InventoryFormComponent,
    InventoryListComponent,
    InventoryItemComponent,
    DailyReportComponent,
    OrderDetailComponent,
    EditCustomOrderComponent,
    KotPrintingComponent,
    MonthlySalesComponent,
    PaymentComponent,
    HistoryViewerComponent,
    JsonParsePipe,
    CustomGiftboxFormComponent,
    EditGiftOrderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    MultiSelectModule,
    DropdownModule,
    TableModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,

    RouterModule.forRoot(appRoutes,{useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
