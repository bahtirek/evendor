
import { RegistrationComponent } from './registration/registration.component';
import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard} from './services/auth-guard.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { TextMaskModule } from 'angular2-text-mask';
import { AccountActivationComponent } from './account-activation/account-activation.component';
import { PriceCheckComponent } from './price-check/price-check.component';
import { SpinnerModule } from './spinner/spinner.module';
import { SignupFormModule } from './signup-form/signup-form.nodule';
import { PrintService } from './services/print.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { PhoneFormatDirectivesModule } from './directives/phoneFormatDirectives.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegistrationComponent,
    AccountActivationComponent,
    PriceCheckComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TextMaskModule,
    SpinnerModule,
    SignupFormModule,
    PhoneFormatDirectivesModule
  ],
  providers: [AuthGuard, AuthService, PrintService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
