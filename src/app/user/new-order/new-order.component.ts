import { modal } from './../shared/modal';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


import { Order } from '../shared/order';
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
  public itemList: any = [];
  public itemListBy: any = [];
  public by: string = 'byVendor';
  public order: Order[] = [];//order list to save in cash
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
  public showSubmitModal = 'none';
  public vendorsForSubmitModal = [];
  public orderFromCash: any;
  private token = new HttpParams().set('token', this.auth.token);

  constructor(private http: HttpClient, private auth: AuthService) {}

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
                      console.log(this.itemList)
                      this.arrange(this.by);
                    },
                    error => {
                      //console.log(error)
                    },
                    () => { //get exist unfinished order from cookie
                      this.orderFromCash = JSON.parse(localStorage.getItem('order' + this.auth.userEmail()));
                      this.getSuspendedOrder();
                    }
                  ); //itemList subscribe
              }
            ); //group subscribe
          for(let vendor of this.vendors){// adding vendorNote property to vendors object
           vendor.vendorNote = '';
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
            localStorage.removeItem('order' + this.auth.userEmail());
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
    //console.log(this.itemList);
    this.isReview = !this.isReview;
    if(this.isReview == false){
      this.showSubmitButton = false;
      this.showPriceButton = false;
    }else{
      this.compareCheck();
      this.quantityCheck();
    }
  }

  




  getSuspendedOrder(){
    
    this.http.get<any>(this.url.suspend + '?token=' + this.auth.token)
      .subscribe(
        result=>{
          if(result.length == 0){//if there is not suspended order then load from cash
            if(this.orderFromCash){
              this.suspendedOrder = this.orderFromCash;
              this.loadSuspendedOrder();
            }
          }else{
            this.suspendedOrder = result;
            if(this.orderFromCash){
              this.modal.cashed = 'block';
            }else{
              this.loadSuspendedOrder();
            }
            
          }
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
                if(item.vendor == this.vendors[i]['id']){
                  item.vendorName = this.vendors[i]['name'];
                }
                if(i == this.vendors.length - 1 || item.vendor == this.vendors[i]['id']){// if for loop(vendor name) is done or name found
                  for (let i = 0; i < this.itemList.length; i++) {// going trhu itemList
                    if (this.itemList[i]['id'] == item.id) {// if item id match assigning data from cookie object to itemList
                      this.itemList[i]['vendorId'] = item.vendor;
                      this.itemList[i]['vendorName'] = item.vendorName;
                      this.itemList[i]['pack'] = item.pack;
                      this.itemList[i]['quantity'] = item.quantity;
                      break;//stop itemList for after assingment
                    }
                  }
                }
              }
            }
          }
          this.modal.cashed = 'none';
          //localStorage.removeItem('order' + this.auth.userEmail());     
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
  this.spinner = "block";
  let i = 0;
  let compare = [];
  //console.log(this.itemList)
  for (let item of this.itemList) {
    if (item.compare) {
      compare.push({
        id: item.id,
        name: item.name
      })
    }
    i++;
    if (i == this.itemList.length) { //if it last loop of parent forloop(for (let item of this.itemList)) submit order
      this.http.post<any>(this.url.compare + '?token=' + this.auth.token, {compare: compare})
        .subscribe(
          result => {
            //console.log(result)
            if(result.error == 'emptyaccount'){
              this.modal.account = "block";
            }else if(result.request == 'ok'){
              this.modal.alertDisplay = 'block';
              this.modal.text2 = 'We have sent an email with price request to salesperson.';
            }
            this.spinner = "none";
          },
          error => {
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


getVendorsForSubmitModal(){
  this.vendorsForSubmitModal = [];
  let i = 0;
  for(let vendor of this.vendors){
    for (let item of this.itemList) {
      if (item.quantity > 0 && item.vendorId == vendor.id) {
        this.vendorsForSubmitModal.push(vendor);
        break;
      }
      i++;
      if (i == this.vendors.length) { //if it last loop of parent forloop(for (let item of this.itemList)) submit order
       this.spinner = 'none';
      }
    }
    //console.log(this.vendorsForSubmitModal)
  }

  this.modal.showSubmitModal = 'block';
}



submitOrder(vendors){
  this.modal.showSubmitModal = 'none';
  this.spinner = 'block';
  let newOrder = [];
  let suspendedOrder = [];
  let note = [];

  let v = 0;
  for(let vendor of vendors){
    
      if(vendor.vendorNote){
        note.push({note: vendor.vendorNote, vendorId: vendor.id});
      }
      let i = 0;
      for (let item of this.itemList) {
        if (item.quantity > 0 && item.vendorId == vendor.id) {
          if(vendor.submit == true){
            newOrder.push({
              quantity: item.quantity,
              id: item.id,
              pack: item.pack,
              vendor: item.vendorId
            })
          }else{
            suspendedOrder.push({
              quantity: item.quantity,
              id: item.id,
              pack: item.pack,
              vendor: item.vendorId
            })
          }
          
        }
        i++;
      }
      v++; 
      if (v == vendors.length && i == this.itemList.length) { //if it last loop of parent forloop(for (let item of this.itemList)) submit order
        this.http.post(this.url.order + '?token=' + this.auth.token, {order: newOrder, note: note})
        .subscribe(
          result => {
            //console.log(result)
            this.recentOrder = result;
          },
          error => {
            //console.log(error)
            this.spinner = "none";
          },
          () => {
            this.submitSuspendedOrder(suspendedOrder);
            this.showOrder = true;
            this.spinner = "none";
          }
        ); 
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
      this.submitSuspendedOrder(newOrder);
      //console.log(newOrder)
    }
  }

}

submitSuspendedOrder(suspendedOrder) {
  //console.log(suspendedOrder)
  this.http.post(this.url.suspend + '?token=' + this.auth.token, {order: suspendedOrder})
  .subscribe(
    result => {
      //console.log(result)
      this.spinner = "none";
      localStorage.removeItem('order' + this.auth.userEmail());
    },
    error => {
      //console.log(error)
      this.spinner = "none";
    },
    ()=>{
      localStorage.removeItem('order' + this.auth.userEmail());
    }
  );
}

sortBy(sort){
  //console.log(this.by)
  //console.log(this.itemList)
  if(sort == 'az'){
    this.itemList.sort(function(a,b){
      return a.name.localeCompare(b.name);
    })
  }else if(sort == 'least'){
    this.itemList.sort(function(a, b) { 
      return a.ordercount - b.ordercount
    });
  }else if(sort == 'recent'){
    this.itemList.sort(function(a, b) { 
      var d1 = new Date(b.date).getTime();
      var d2 = new Date(a.date).getTime();
      return  d1 - d2;
    });
  }else if(sort == 'notrecent'){
    this.itemList.sort(function(a, b) { 
      var d1 = new Date(b.date).getTime();
      var d2 = new Date(a.date).getTime();
      return  d2 - d1;
    });
  }else if(sort === 'most'){
    this.itemList.sort(function(a, b) { 
      return b.ordercount - a.ordercount
    });
  } else {
    this.itemList.sort(function(a, b) { 
      return a.id - b.id
    });
  }
  if(this.by != 'byOrder'){
    this.arrange(this.by)
  }
}

combineCashedOrder(){
  //console.log(this.suspendedOrder)
  //console.log(this.orderFromCash)
  this.suspendedOrder = this.orderFromCash;
  this.loadSuspendedOrder();
  this.modal.cashed = 'none';
}

deleteCashedOrder(){
  localStorage.removeItem('order' + this.auth.userEmail());
  this.loadSuspendedOrder();
}

}
