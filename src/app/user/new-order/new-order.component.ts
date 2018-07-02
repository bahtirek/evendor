import { modal } from './../shared/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from "@angular/router"

import { CookieService } from 'ngx-cookie-service';
import { ShowOrderComponent } from '../show-order/show-order.component';

//import { packList } from '../shared/packaging';
import { Order } from '../shared/order';
import { Vendor } from '../shared/vendor';
import { userConfig } from '../shared/userConfig';
import { url } from '../shared/url';
import { Group } from '../shared/group';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  public vendors: any;
  //public packList = packList;
  //public userConfig = userConfig;
  //public sortBy = this.userConfig.orderList;
  public itemList: any = [];
  //public itemListByVendor: any = [];
  //public itemListByGroup: any = [];
  public itemListBy: any = [];
  public by: string = 'byOrder';
  public order: Order[] = [];//order list to save in cash
  //public cookieValue = 'UNKNOWN';
  private url = url;
  private groups: Group[];
  public isReview = false;
  public spinner = 'none';
  public recentOrder: object;
  public showOrder: boolean = false;
  public modal = modal;
  public suspendedOrder;
  public showSubmitButton = false;
  public showPriceButton = false;
  //public byWhat = 'byOrder';
  private token = new HttpParams().set('token', this.auth.token);

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router, private auth: AuthService) {}

  ngOnInit() {

    this.http.get(this.url.vendors + '?token=' + this.auth.token) //getting vendors
      .subscribe( //vendors subscribe
        result => {
          this.vendors = result;
        },
        error => {},
        () => {
          this.http.get < Group[] > (this.url.groups + '?token=' + this.auth.token) //getting groups after vendors subscribe is done
            .subscribe( //group subscribe
              result => {
                this.groups = result;
                this.groups.push({name: 'Ungrouped', id: 0});
              },
              error => {},
              () => { //getting itemList after vendors, groups subscribe is done
                this.http.get(this.url.orderlist + '?token=' + this.auth.token)
                  .subscribe(
                    result => { // itemList subscribe
                      this.itemList = result;
                      //console.log(this.itemList)
                    },
                    error => {
                      //console.log(error)
                    },
                    () => { //get exist unfinished order from cookie
                      this.getSuspendedOrder();
                    }
                  ); //itemList subscribe
              }
            ); //group subscribe
          let v = 0
          for(let vendor of this.vendors){// adding vendorNote property to vendors object
            this.vendors[v]['vendorNote'] = '';
            v++
          }
        }
      );//vendor subscribe

    
  } ///end of ngOnInit


  arrange(byWhat) {
    this.itemListBy = [];
    let items = [];
    //this.byWhat = byWhat;
    if (byWhat == 'byVendor') {
      for (let by of this.vendors) {
        for (let item of this.itemList) {
          if (item.vendorId == by.id) {
            items.push(item);
          }
        }
        this.itemListBy.push({
          name: by.name,
          id: by.id,
          vendorNote: by.vendorNote,
          items: items
        });
        
        this.by = byWhat;
        items = [];
      }
    } else {
      if (this.groups.length > 0) {
        for (let by of this.groups) {
          for (let item of this.itemList) {
            if (item.groupId == by.id) {
              items.push(item);
            }
          }
          this.itemListBy.push({
            name: by.name,
            id: by.id,
            items: items
          });
          this.by = byWhat;
          items = [];
        }

      }
    }
  }

  clear() {  //reset order to 0 reloading from db
    //modal
    let reset = true
    if (reset) {
      this.http.get(this.url.orderlist + '?token=' + this.auth.token)
        .subscribe(
          result => {
            this.itemList = result;
            this.arrange(this.by);
            //console.log(result)
          },
          error => {},
          ()=>{
            //this.cookieService.delete('order');
            localStorage.removeItem('order');
            //localStorage.setItem('order', JSON.stringify(this.order));
            this.deleteSuspenedOrder();
          }
        );
    }
  }

  changeVendor(data) {
    let vendorId = data.vendorId;
    let vendorName = data.vendorName;
    let itemIndex = data.itemIndex;
    let itemId = data.itemId;
    if (this.by !== 'byOrder') {
      let i = 0;
      for (let item of this.itemList) {
        if (item.id == itemId) {
          itemIndex = i;
          break;
        }
        i++;
      }
    }
    this.itemList[itemIndex]['vendorId'] = vendorId;
    this.itemList[itemIndex]['vendorName'] = vendorName;
    if (this.by !== 'byOrder') {
      this.arrange(this.by);
    }
  }


  review() {
    this.isReview = !this.isReview;
    if(this.isReview == false){
      this.showSubmitButton = false;
      this.showPriceButton = false;
    }else{
      this.compareCheck();
      this.quantityCheck();
    }
  }

  submit() {
    this.spinner = 'block';
    let newOrder = [];
    let note = [];
    //console.log(this.vendors)
    for(let vendor of this.vendors){
      if(vendor.vendorNote){
        note.push({note: vendor.vendorNote, vendorId: vendor.id});
      }
      //console.log(note)
    }
    let i = 0;
    //console.log(this.itemList)
    for (let item of this.itemList) {
      if (item.quantity > 0) {
        newOrder.push({
          quantity: item.quantity,
          id: item.id,
          pack: item.pack,
          vendor: item.vendorId
        })
      }
      i++;
      if (i == this.itemList.length) { //if it last loop of parent forloop(for (let item of this.itemList)) submit order
        //newOrder.push(this.vendors);
        console.log(newOrder)
        this.http.post(this.url.order + '?token=' + this.auth.token, {order: newOrder, note: note})
          .subscribe(
            result => {
              console.log(result)
              this.recentOrder = result;
              this.showOrder = true;
              localStorage.removeItem('order');
              this.deleteSuspenedOrder()
              this.spinner = "none";
            },
            error => {
              console.log(error)
              this.spinner = "none";
            },
            () => {
              
            }
          );
        ////console.log(newOrder)
      }
    }

  }


  suspend() {
    this.spinner = 'block';
    let newOrder = [];
    let i = 0;
    for (let item of this.itemList) {
      if (item.quantity > 0) {
        newOrder.push({
          quantity: item.quantity,
          id: item.id,
          pack: item.pack,
          vendor: item.vendorId
        })
      }
      i++;
      if (i == this.itemList.length) {
        //console.log(newOrder)
        this.http.post(this.url.suspend + '?token=' + this.auth.token, {order: newOrder})
          .subscribe(
            result => {
              //console.log(result)
              this.spinner = "none";
              localStorage.removeItem('order');
            },
            error => {
              //console.log(error)
              this.spinner = "none";
            }
          );
        //console.log(newOrder)
      }
    }

  }

  getSuspendedOrder(){
    this.http.get<any>(this.url.suspend + '?token=' + this.auth.token)
      .subscribe(
        result=>{
          //console.log(result)
          if(result.length == 0){
            let orderfromCash = JSON.parse(localStorage.getItem('order'));
            if(orderfromCash && orderfromCash.token == this.auth.token){
              //console.log('orderfromCash')
              this.suspendedOrder = orderfromCash.order;
              this.loadSuspendedOrder();
            }
            
          }else{
            this.modal.date = result[0]['date'];
            this.modal.suspendDisplay = 'block';
            this.suspendedOrder = result;
          }
          //console.log(result)
        },
        error=>{
          //console.log(error)
        }
      );
  }

  loadSuspendedOrder(){
    
          if(this.suspendedOrder != null) this.order = this.suspendedOrder;
          if(this.order){
            for (let item of this.order) { //going thru object from cookie
              for(let i = 0; i < this.vendors.length; i++){//for loop to assign vendor name
                if(item.v == this.vendors[i]['id']){
                  item.n = this.vendors[i]['name'];
                }
                if(i == this.vendors.length - 1 || item.v == this.vendors[i]['id']){// if for loop(vendor name) is done or name found
                  for (let i = 0; i < this.itemList.length; i++) {// going trhu itemList
                    if (this.itemList[i]['id'] == item.i) {// if item id match assigning data from cookie object to itemList
                      this.itemList[i]['vendorId'] = item.v;
                      this.itemList[i]['vendorName'] = item.n;
                      this.itemList[i]['pack'] = item.p;
                      this.itemList[i]['quantity'] = item.q;
                      break;//stop itemList for after assingment
                    }
                  }
                }
              }
            }
          }
          this.modal.suspendDisplay = 'none';     
  }

  deleteSuspenedOrder(){
    this.http.delete(this.url.suspend, {params: this.token})
      .subscribe(
        result=>{
          //console.log(result)
          this.modal.suspendDisplay = 'none';    
        },
        error=>{
          //console.log(error)
        }
      );
  }

setVendorNote(text, index){
  this.vendors[index]['vendorNote'] = text;
  this.itemListBy[index]['vendorNote'] = text;
}

compare(){
  
  let i = 0;
  let compare = [];
  console.log(this.itemList)
  for (let item of this.itemList) {
    if (item.compare) {
      compare.push({
        id: item.id,
        name: item.name
      })
    }
    i++;
    if (i == this.itemList.length) { //if it last loop of parent forloop(for (let item of this.itemList)) submit order
      console.log(compare)
      this.http.post(this.url.compare + '?token=' + this.auth.token, {compare: compare})
        .subscribe(
          result => {
            console.log(result)
            
            this.spinner = "none";
          },
          error => {
            console.log(error)
            this.spinner = "none";
          },
        );
    }
  }
}

quantityCheck(){
  for(let i in this.itemList){
    if(this.itemList[i]['quantity'] > 0){ 
      this.showSubmitButton = true; //clickable button when at least one item is ordered
      break;
    }
  }
}

compareCheck(){
  for(let i in this.itemList){
    if(this.itemList[i]['compare'] && this.itemList[i]['compare'] == true){ //if compare attr is exist and compare is true then ShowPriceButton = true
      this.showPriceButton = true; //clickable button when one of the compare chekboxes is checked
      break;
    }
  }
}

checkCompareEmitFromTable(){
  if(this.isReview){
    this.showPriceButton = false;
    this.compareCheck();
  }
}

checkQuantityEmitFromTable(){
  if(this.isReview){
    this.showSubmitButton = false;
    this.quantityCheck();
  }
}


}
