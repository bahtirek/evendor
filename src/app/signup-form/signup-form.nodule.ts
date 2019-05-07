import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupFormComponent } from './signup-form.component';
import { SpinnerModule } from '../spinner/spinner.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule
  ],
  declarations: [SignupFormComponent],
  exports: [SignupFormComponent]
})
export class SignupFormModule { }