
import { TextMaskModule } from 'angular2-text-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UserRoutingModule } from './user-routing.module';
import { VendorComponent, ItemListComponent,  NewOrderComponent,  LocationsComponent, AccountComponent, OrderHistoryComponent, RecipientComponent } from './index';
import { AddVendorComponent, ShowVendorComponent } from './vendor/index';
import { AddRecipientComponent} from './recipient/index';
import { MainListComponent } from './item-list/main-list/main-list.component';
import { NewListComponent } from './item-list/new-list/new-list.component';
import { CustomItemComponent } from './item-list/custom-item/custom-item.component';
import { ModalComponent } from '../modal/modal.component';
import { GroupComponent } from './group/group.component';
import { TableComponent } from './new-order/table/table.component';
import { ShowOrderComponent } from './show-order/show-order.component';
import { ContactsComponent } from './contacts/contacts.component';
import { RegistrationComponent } from './registration/registration.component';
import { MainComponent } from './main/main.component';
import { PriceComponent } from './price/price.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { SignupFormModule } from 'app/signup-form/signup-form.nodule';
import { UserComponent } from './user.component';
import { PrintLayoutComponent } from './print-layout/print-layout.component';



@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    SpinnerModule,
    SignupFormModule
  ],
  exports: [
    
  ],
  providers: [
  ],
  declarations: [VendorComponent, UserComponent, ItemListComponent, NewOrderComponent, LocationsComponent, AccountComponent, OrderHistoryComponent, AddVendorComponent, ShowVendorComponent, RecipientComponent, AddRecipientComponent, MainListComponent, NewListComponent, CustomItemComponent, ModalComponent, GroupComponent, TableComponent, ShowOrderComponent, ContactsComponent, RegistrationComponent, MainComponent, PriceComponent, PrintLayoutComponent]
})
export class UserModule { }
