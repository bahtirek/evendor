import { Group } from './../shared/group';
import { Vendor } from './../shared/vendor';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

import { url } from '../shared/url';
import { month } from '../shared/month';
import { modal } from '../shared/modal';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  public url = url;
  public history: any;
  public showOrder = false;
  public order: any[];
  public years = [];
  public date = {month: '01', year: '2016'};
  public modal = modal;
  private months = month;
  public updatableOrder;
  public showUpdateButton = false;
  public showUpdateTable = false;
  public show = {order: false, updateTable: false, review: false};
  public vendors = [];
  public groups: Group[];
  public itemList: any = [];
  public orderToUpdate = [];
  public updates;
  public spinner = 'none';
  
  private token = new HttpParams().set('token', this.auth.token)
  
  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit() {
    
    this.http.get(this.url.lastorders, {params: this.token})
      .subscribe(
        result=>{
          //console.log(result);
          this.history = result;
          if(this.history[0]){
            this.updatableOrder = this.history[0]['id'];
            //console.log(this.updatableOrder)
          }
          
        },
        error=>{
          console.log(error)
        },
        ()=>{}
      );

    let currentYear = new Date().getFullYear();
     
    for(let i = 2016;  i <= currentYear; i++){
      this.years.push(i);
    }  
  }// ngOnInit

  getOrder(id){
    if(id == this.updatableOrder){
      this.showUpdateButton = true;
    }else{
      this.showUpdateButton = false;
    }
    this.toggleView('');
    this.http.get<any>(this.url.order + '/' + id, {params: this.token})
      .subscribe(
        result=>{
          //console.log(result)
          this.order = result;
          for(let vendor of this.order){
            for(let item of vendor.items){
                item.updates = [];
            }
          }
          for(let vendor of this.order){
            if(Object.keys(vendor.items).length == 0){//if items undefined
              //vendor.items = vendor.updates;
              for(let vendorUpdate of vendor.updates){
                vendor.items.push({id: vendorUpdate.id, name: vendorUpdate.name, quantity: 0, pack: vendorUpdate.pack, note: vendorUpdate.note})
              }
            }
            
            for(let update of vendor.updates){//moving updates from vendor to items update each item gets own update
              let itemIndex = vendor.items.map(function(e) { return e.id; }).indexOf(update.id);//getting index of updated item in items(original order)
              if(itemIndex == -1) vendor.items.push({id: update.id, name: update.name, pack: update.pack, vendorId: update.vendorId, quantity: 0})/// adding item to items(original order) when item is not in all orders but in updates 
              for(let item of vendor.items){
                if(!('updates' in item)) item.updates = [];
                if(update.id == item.id){
                  item.updates.push(update);
                }
              }
            }
            //console.log(vendor)
          }


          if(this.updatableOrder){
            this.orderToUpdate = this.order;
          }else{
            this.orderToUpdate = [];
          }
          this.toggleView('order');
          //this.showOrder = true;
        },
        error=>{
          console.log(error)
        }
      );
  }



  submit(){
    this.toggleView('');
    //this.showOrder = false;
    let date = this.date.year + '-' + this.date.month;
    console.log(date)
    let params = new HttpParams().set('date', date).set('token', this.auth.token);
    this.http.get<any[]>(this.url.orders, {params: params, responseType: 'json'})
      .subscribe(
        result=>{
          console.log(result)
          if(result == null){
            this.modal.alertDisplay = 'block';
            this.modal.text2 = 'No orders placed on this period of time';
          }else{
            this.history = result;
          }
          
        },
        error=>{
          console.log(error)
        }
      );
  }

  updateOrder(){
    this.toggleView('updateTable');

    this.http.get<any[]>(this.url.orderlistforupdate + '?token=' + this.auth.token)
      .subscribe(
        result=>{
          console.log(result)
          this.vendors = [];
          for(let vendor of result){
            this.vendors.push({name: vendor.name, id: vendor.id, changes: [], changesMap: [], items: [], note: []});
          }
          this.itemList = result;
          },
        error=>{
          console.log(error)
        },
        ()=>{
          if(this.orderToUpdate){
            for (let orderVendor of this.orderToUpdate){
              for(let listVendor of this.itemList){
                if(orderVendor.id == listVendor.id){
                  for(let orderItem of orderVendor.items){
                    let itemIndex = listVendor.items.map(function(e) { return e.id; }).indexOf(orderItem.id);
                    if(itemIndex > -1){//elsi est v ordere item togda updatem quantity v litemslist
                      if(orderItem.updates.length > 0){// if item was updated
                        let upItem = orderItem.updates[orderItem.updates.length - 1];
                       //console.log(upItem)
                        listVendor.items[itemIndex].quantity = upItem.quantity;
                        listVendor.items[itemIndex].pack = upItem.pack;
                      }else{
                        listVendor.items[itemIndex].quantity = orderItem.quantity;//adding items when item not in main list
                        listVendor.items[itemIndex].pack = orderItem.pack;
                      }
                    }else{//elsi net v ordere item togda pushaem item
                      if(orderItem.updates.length > 0){// if item was updated
                        let upItem = orderItem.updates[orderItem.updates.length - 1];
                        //console.log(upItem)
                        orderItem.quantity = upItem.quantity;
                        orderItem.pack = upItem.pack;
                      }
                      orderItem.vendorId = orderVendor.id;
                      orderItem.vendorName = orderVendor.name;
                      listVendor.items.push(orderItem);
                      for(let listVendor of this.itemList){
                        if(listVendor.id != orderVendor.id){
                          let itemIndex = listVendor.items.map(function(e) { return e.id; }).indexOf(orderItem.id);
                          listVendor.items.splice(itemIndex, 1);//udalyaem item iz main itemslist
                        }
                      }
                    }
                   
                  }
                }
              }

            }
          }
        }
      );

  }

  reviewUpdate(){
    for(let vendorOut of this.vendors){
      for(let vendorIn of this.vendors){
        for(let change of vendorOut.changes){
          if(vendorIn.id == change.vendorId){
            vendorIn.items.push(change)//make sure no double items
          }
        }
      }
      if(vendorOut.vendorNote){
        vendorOut.note.push({note: vendorOut.vendorNote})
      }
      
     // console.log(this.vendors)
    }
    this.order = this.vendors;
    this.toggleView('order', 'review') 
    this.showUpdateButton = false;
    //console.log(this.itemList)
    //console.log(this.vendors)
    //console.log(this.orderToUpdate)
  }

  editUpdate(){
    for(let vendorOut of this.vendors){
      vendorOut.items = [];
    }
    this.toggleView('updateTable');
    //console.log(this.itemList)
  }

  cancelUpdate(){
    this.toggleView('');
   }
  
  changeVendor(data) {
    //console.log(data)
    let vendorId = data.vendorId;
    let vendorName = data.vendorName;
    let itemIndex = data.itemIndex;
    let itemId = data.itemId;
    let vendorIndex = data.vendorIndex;
    let prevVendorIndex = data.prevVendorIndex;
    this.itemList[prevVendorIndex].items[itemIndex].vendorName = vendorName;
    this.itemList[prevVendorIndex].items[itemIndex].vendorId = vendorId;
    this.itemList[vendorIndex].items.push(this.itemList[prevVendorIndex].items[itemIndex]);
    this.itemList[prevVendorIndex].items.splice(itemIndex, 1);
    
  }

  submitUpdate(){
    this.spinner = 'block';
    let newOrder = [];
    let note = [];
    let i = 0;
    for(let vendor of this.vendors){
      for(let item of vendor.items){
        newOrder.push({
          quantity: item.quantity,
          id: item.itemId,
          pack: item.pack,
          vendor: item.vendorId,
          name: item.name,
          note: ''
        });
      }
      console.log(vendor)
      if(vendor.note && vendor.vendorNote){
        note.push({orderId: this.updatableOrder, note: vendor.vendorNote, vendorId: vendor.id});
      }
      
      i++;

      if(i == this.vendors.length){
        console.log(newOrder)
        this.http.put(this.url.orderupdate + '?token=' + this.auth.token , {order: newOrder, orderId: this.updatableOrder, note: note})
          .subscribe(
            result=>{
              console.log(result)
              this.spinner = 'none';
              this.toggleView('order');
              },
            error=>{
              console.log(error)
            }
          );
      }
    }
    
    
  }

  setVendorNote(text, index){
    this.vendors[index]['vendorNote'] = text;
    this.itemList[index]['vendorNote'] = text;//view on review
  }

  toggleView(view, view2?){
    this.show = {order: false, updateTable: false, review: false};
    this.show[view] = true;
    this.show[view2] = true;
  }

}
