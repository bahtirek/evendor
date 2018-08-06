import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms'

import { Recipient } from '../../shared/recipient';
import { Vendor } from '../../shared/vendor';

@Component({
  selector: 'add-recipient',
  templateUrl: './add-recipient.component.html',
  styleUrls: ['./add-recipient.component.css'],
  inputs: ['vendors', 'recipient', 'flag']
})
export class AddRecipientComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
  
  public recipient: Recipient;
  public vendors: Vendor[];
  public flag;
  public mask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public displayVendor = false;
  public displayRecipient = false;
  public vendorRepresentIndex;


  
  @Output()
  save: EventEmitter<object> = new EventEmitter();
  saveRecipient(){
    if(this.displayRecipient == true){
      let vendors = [];
      for (var i = 0; i < this.vendors.length; i++) {
        if(this.flag[i]==true){
          vendors.push(new Vendor(this.vendors[i]['name'], this.vendors[i]['id']));
        }
      }
      this.recipient.vendors = vendors;
    }else{
      let vendors = [];
      if(this.vendorRepresentIndex != undefined){
         vendors.push(new Vendor(this.vendors[this.vendorRepresentIndex ]['name'], this.vendors[this.vendorRepresentIndex ]['id']));
         this.recipient.salesPerson = true;
         this.recipient.vendors = vendors;
        }
    }
    
    this.save.emit(this.recipient);
    this.recipient = new Recipient("","","",[]);
  }
  

  @Output()
  cancel: EventEmitter<null> = new EventEmitter();
  cancelEdit(){
    this.vendorRepresentIndex = undefined;
    this.cancel.emit();
  }

  public error = true;
  isStringEmpty(){
     let stringRegex = /^(?!\s*$).+/i;
     this.error = stringRegex.test(this.recipient.name);
   }
  
isVendor(e){
  if(e == false){//represents recipient
    this.displayVendor = false;
    this.displayRecipient = true;
    this.vendorRepresentIndex = undefined;
  }else{//represents vendor
    this.displayVendor = true;
    this.displayRecipient = false;

  }
}
   
  vendorRepresent(vendorIndex){
    this.vendorRepresentIndex = vendorIndex;
  }
    
  }


