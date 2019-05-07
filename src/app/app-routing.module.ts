import { PriceCheckComponent } from './price-check/price-check.component';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { RegistrationComponent } from './registration/registration.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: '', 
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent
  },
  {
    path: "user",
    loadChildren: './user/user.module#UserModule'
  },
  {
    path: "signup",
    component: RegistrationComponent
  },
  {
    path: "accountactivation/:id",
    component: AccountActivationComponent
  },
  {
    path: "pricecheck/:id",
    component: PriceCheckComponent
  },
  {
    path: "pricecheck",
    redirectTo: "home",
    pathMatch: "full"
  },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//(routes, { useHash: true })
