import { Recipient } from './../shared/recipient';
import { AuthService } from './../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Vendor } from '../shared/vendor'; 
import { modal } from '../shared/modal'; 
import { url } from '../shared/url';

@Component({
  selector: 'app-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.css']
})
export class RecipientComponent implements OnInit {

  public modal = modal;
  public vendors: Vendor[];
  public recipients: Recipient[];
  public recipient: Recipient;
  public edit: boolean = false;
  public add: boolean = false;
  public flag: boolean[] = [];
  public dummyVendors: Vendor[] = [];
  public agreeToRemoveData;
  private url = url;
  

  private token = this.auth.token;

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    this.http.get<any>(this.url.vendors + '?token=' + this.token)
    .subscribe(
      result=>{
        this.vendors = result;
      },
      error=>{
        ////console.log(error)
      }
    );

    this.getRecipients();
   
  }

  getRecipients(){
    this.http.get<Recipient[]>(this.url.recipients + '?token=' + this.token)
    .subscribe(
      result=>{
        this.recipients = result;
      },
      error=>{
        ////console.log(error)
      }
    );
  }


  ///////////////////////// Remove recipient

  agreeToRemove(){
    this.http.delete(this.url.recipient + '/' + this.agreeToRemoveData.id + '?token=' + this.token)
      .subscribe(
        result=>{
          //console.log(result)
          if(result === 1){
            this.recipients.splice(this.agreeToRemoveData.index, 1);
            this.agreeToRemoveData = {};
            this.modal.text2 = '';
            this.modal.agreementDisplay = "none";
          }else{
            this.modal.text = "Couldn't remove recipient";
            this.modal.errDisplay = "block";
          }
        },
        error=>{
          //console.log(error)
        }
      );

  }

  removeRecipient(id, index){
    this.agreeToRemoveData = {id: id, index: index};
    //console.log(this.agreeToRemoveData)
    this.modal.text2 = this.recipients[index]['name'];
    this.modal.agreementDisplay = "block";
   }
 
  ///////////////////////// End Of Remove recipient


  ///////////////////////// Save new recipient or Update exist

  saveRecipient(data){
    // console.log(data)
    if(data.id !== undefined || data.id > 0){//if id exist update recipient else create recipient
      this.http.put(this.url.recipient + '/' + data.id + '?token=' + this.token, data)
      .subscribe(
        result=>{
          if(result === true){
            this.getRecipients();
          }
        },
        error=>{
          //console.log(error);
        }
      );
      
    }else{
      this.http.post(this.url.recipient + '?token=' + this.token, data)
        .subscribe(
          result=>{
            if(result === true){
               this.getRecipients();
            }
          },
          error=>{
            //console.log(error);
          }
        );
       this.recipient = new Recipient("", "", "", this.dummyVendors);
    }
    this.add = false;
    this.edit = false;
  }



   ///////////////////////// End of Save new recipient or Update exist

   

   ////////////////////////// Edit recipient


   newRecipient(){// show add or edit window  ---edit button or --add new recipient button
    this.add = true;
    this.edit = false;
    this.recipient = new Recipient("", "", "", this.dummyVendors);
    for(var i = 0; i < this.vendors.length; i++){
      this.flag[i] = false;
    }
  }


  editRecipient(name, email, phone, id, index){
    window.scrollTo(0,0);
    this.recipient = {name: name, email: email, phone: phone, id: id, index: index, vendors: this.recipients[index]['vendors']};
    for(var i = 0; i < this.vendors.length; i++){
      this.flag[i] = false;
      if(this.recipient.vendors){
        for(var r = 0; r < this.recipient.vendors.length; r++){
          if(this.recipient.vendors[r]['id'] == this.vendors[i]['id']){
            this.flag[i] = true;
          }
        }
      }
    }
    this.edit = true;
    this.add = false;
  }

   ////////////////////////// End of edit recipient



  ////////////////////////// Cancel Create, Update recipient

 cancel(){
    this.recipient = new Recipient("", "", "", this.dummyVendors);
    this.add = false;
    this.edit = false;
  }

  ////////////////////////// End of Cancel Create, Update recipient

}

  


