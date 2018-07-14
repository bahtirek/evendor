import { url } from './../shared/url';
import { AuthService } from './../../services/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Contact } from './../shared/contacts';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { states } from '../shared/states'
import { emailValidator } from '../../validators/email.validators';
import { phoneValidator } from '../../validators/phone.validator';
import { emptyStringValidator} from '../../validators/emptystring.validators';

@Component({
  selector: 'contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
  inputs: ['contacts', 'editContacts']
})
export class ContactsComponent implements OnInit {

  public mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public states = states;
  public contacts;
  public contactsForm: FormGroup;
  public url = url;
  public editContacts: boolean;
  public spinner = 'none';
  public formErrors = {
    'company': [],
    'email': [],
    'address': [],
    'city': [],
    'zipcode': [],
    'state': [],
    'phone': []
  }

  public validationMessages = {
    'company': {
      'required': 'Company name is required',
      'maxlength': 'Company name\'s length can\'t exceed is 30 characters',
      'emptyStringValidator': 'Field cannot be empty'

    },
    'email': {
      'required': 'Email is required',
      'emailValidator': 'Wrong email format',
      'emptyStringValidator': 'Field cannot be empty'
    },
    'address': {
      'required': 'address is required',
      'emptyStringValidator': 'Field cannot be empty'
    } ,
    'city': {
      'required': 'city is required',
      'maxlength': 'City\'s length can\'t exceed 30 characters',
      'emptyStringValidator': 'Field cannot be empty'
    } ,
    'zipcode': {
      'required': 'Zipcode is required',
      'maxlength': 'Zipcode\'s length can\'t exceed 5 characters',
      'minlength': 'Zipcode should be 5 digits',
      'emptyStringValidator': 'Field cannot be empty'
    } ,
    'state': {
      'required': 'State is required'
    } ,
    'phone': {
      'required': 'Phone is required',
      'phoneValidator': 'Wrong phone number'
    } 
  }

  constructor(private http: HttpClient, private auth: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    console.log('hello');
  }

  @Output()
    edited: EventEmitter<object> = new EventEmitter
    

  @Output()
  cancelEdit: EventEmitter<any> = new EventEmitter;
  
  cancel(){
    this.cancelEdit.emit();
  }
  
  buildForm(){
    this.contactsForm = this.fb.group({
      'company': [this.contacts.company, [
        Validators.required,
        Validators.maxLength(30),
        emptyStringValidator
      ]],
      'email': [this.contacts.email, [
        Validators.required,
        emailValidator,
        emptyStringValidator
      ]],
      'address': [this.contacts.address, [
        Validators.required,
        emptyStringValidator
      ]],
      'city': [this.contacts.city, [
        Validators.required,
        Validators.maxLength(30),
        emptyStringValidator
      ]],
      'state':[this.contacts.state, [
        Validators.required
      ]],
      'zipcode': [this.contacts.zipcode, [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
        emptyStringValidator
      ]],
      'phone': [this.contacts.phone, [
        Validators.required,
        phoneValidator
      ]]
    });
    this.contactsForm.valueChanges
    .subscribe(data=>this.onValueChange(data))

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.contactsForm) return;
    let form = this.contactsForm;
    
    for (let field in this.formErrors) {
        this.formErrors[field] = [];//make sure that formerrors is empty from previous error messages
        
        let control = form.get(field);//access to form fild(email, password itd)

        if (control && control.dirty && !control.valid || control.touched) {
            let message = this.validationMessages[field];
            for (let key in control.errors) {
                this.formErrors[field].push(message[key]);
            }
        }
        
     }
  }



  saveContacts(){
    let company = this.contactsForm.value.company;
    let email = this.contactsForm.value.email;
    let address = this.contactsForm.value.address;
    let city = this.contactsForm.value.city;
    let state = this.contactsForm.value.state;
    let zipcode = this.contactsForm.value.zipcode;
    let phone =  this.contactsForm.value.phone.replace(/[\(\)\s\-]/g, '');

    let data = { company: company, email: email, address: address, city: city, state: state, zipcode: zipcode, phone: phone};

      this.http.post(
        this.url.accounts + "?token=" + this.auth.token, data,
        {headers: new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'})}
      )
      .subscribe(
        result=>{
          data.phone = data.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
          this.edited.emit(data)
        },
        error=>{
          console.log(error)
        }
      ); 
    
  }

  numberOnly(event){
    let keyCode = event.keyCode;
    console.log(keyCode)
    if(keyCode > 47 && keyCode < 58){
      return true;
    }else{
      return false;
    }
  }
}

