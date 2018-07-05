
import { RegistrationComponent } from './registration/registration.component';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';

import { CookieService } from 'ngx-cookie-service';

import { CRUD } from './user/shared/crud';
import { AuthGuard} from './services/auth-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { UserModule } from './user/user.module';


//import { SpinnerComponent } from './spinner/spinner.component';
//import { ModalComponent } from './modal/modal.component';
import { TextMaskModule } from 'angular2-text-mask';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { PriceCheckComponent } from './price-check/price-check.component';
//import { SubmitModalComponent } from './new-order/submit-modal/submit-modal.component';
//import { SignupFormComponent } from './signup-form/signup-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserComponent,
    RegistrationComponent,
    AccountActivationComponent,
    PriceCheckComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    UserModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers: [CRUD, CookieService, AuthGuard, AuthService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
