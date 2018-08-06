import { PriceComponent } from './price/price.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './../services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from "./user.component";
import { VendorComponent, ItemListComponent,  NewOrderComponent,  LocationsComponent, AccountComponent, OrderHistoryComponent, RecipientComponent, GroupComponent, RegistrationComponent} from './index';


const routes: Routes = [
  
  {
    path: "",
    redirectTo: "/user",
    pathMatch: "full"
  },
  {
    path: "user",
    component: UserComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: '',
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: "",
            redirectTo: "/user/main",
            pathMatch: "full"
          },
          {
            path: "main",
            component: MainComponent
          },
          {
            path: "vendor",
            component: VendorComponent
          },
          {
            path: "recipient",
            component: RecipientComponent
          },
          {
            path: "itemlist",
            component: ItemListComponent
          },
          {
            path: "neworder",
            component: NewOrderComponent
          },
          {
            path: "history",
            component: OrderHistoryComponent
          },
          {
            path: "account",
            component: AccountComponent
          },
          {
            path: "groups",
            component: GroupComponent
          },
          {
            path: "price",
            component: PriceComponent
          }
        ]
      }
      
    ]
  },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
