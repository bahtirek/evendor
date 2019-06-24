import { Item } from './../../shared/item';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';


import { Order } from '../../shared/order';
import { packList } from '../../shared/packaging';
import { PrintService } from '../../../services/print.service';

@Component({
  selector: 'order-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  inputs: ['itemList', 'vendors', 'order', 'isReview', 'withOrderUpdate', 'vendorIndex', 'byIndex', 'vendorId']
})
export class TableComponent implements OnInit {

  public itemList;
  public packList = packList;
  public vendors;
  public order: Order[];
  public isReview = false;
  public withOrderUpdate;
  public vendorIndex;
  public lastOrder = 0;
  public byIndex;
  public vendorId;


  constructor(public printService: PrintService) { }

  ngOnInit() {
   //console.log(this.itemList)
  }

  @Output()
  changeVendor: EventEmitter<object> = new EventEmitter();

  @Output()
  checkCompare: EventEmitter<any> = new EventEmitter();
  
  @Output()
  checkQuantity: EventEmitter<any> = new EventEmitter();

  emitCheckCompare(){
    this.checkCompare.emit();
  }

  search(item: string){
    item = item.toLowerCase();
    this.itemList.sort(function(a){
      const index = a.name.toLowerCase().indexOf(item);
      if (index === 0 || (index !== -1 && a.name.charAt(index - 1) === ' ')) {
        return -1;
      } else {
        return 1;
      }
    })
  }


  change(vendorId, itemId, itemIndex, pack, quantity, itemName){
    if (vendorId != this.vendorId) {
      let vendorName: string;
      let vendorIndex;
      let data;
      for(let v = 0; v < this.vendors.length; v++){//getting vendorName
        if(this.vendors[v].id == vendorId){
          vendorName = this.vendors[v].name;
          vendorIndex = v;
        }
      }

      data = {vendorId: vendorId, vendorName: vendorName, itemId: itemId, itemIndex: itemIndex, vendorIndex: vendorIndex, prevVendorIndex: this.vendorIndex, byIndex: this.byIndex}
      
      if(!this.withOrderUpdate){
        this.changeVendor.emit(data);
        this.updateOrder(itemId, pack, vendorId, quantity);
      }else{
        if(quantity != 0){
          this.updateHistoryItem(itemId, pack, vendorId, quantity, itemName, vendorIndex);
          ////console.log(vendorIndex)
        }
        this.changeVendor.emit(data);
        
      }
    }
  }

 

  increase(itemInd){
    ////console.log(itemInd)
    this.itemList[itemInd]['quantity']++;
    ////console.log(this.itemList[itemInd])
    this.updateOrder(this.itemList[itemInd]['id'], this.itemList[itemInd]['pack'], this.itemList[itemInd]['vendorId'], this.itemList[itemInd]['quantity'], this.itemList[itemInd]['name'])
  }

  decrease(itemInd){
    ////console.log(itemInd)
    if(this.itemList[itemInd]['quantity'] > 0){
      this.itemList[itemInd]['quantity']--;
      this.updateOrder(this.itemList[itemInd]['id'], this.itemList[itemInd]['pack'], this.itemList[itemInd]['vendorId'], this.itemList[itemInd]['quantity'], this.itemList[itemInd]['name']);      
    }
  }



updateOrder(itemId, pack, vendorId, quantity, itemName?){ //updateOrder needed  only to keep order in storage 
  if(!this.withOrderUpdate){ //updating new order
    
    ////console.log(itemId, pack, vendorId, quantity)
    let i = 0;
    
    if(this.order.length > 0){
      for(let i = 0; i < this.order.length; i++){                   //going thru each item in order
        if(this.order[i].id == itemId){                              //if item exist then update
          if(quantity != 0){
            this.order[i]['quantity'] = quantity;
            this.order[i]['vendor'] = vendorId;
            this.order[i]['pack'] = pack;
          }else{
            this.order.splice(i, 1);
          }
          this.saveChangesInLocalStorage();                                       //set cookie after update
          break;
        }else{                                                    //if not exist and
          if(i+1 == this.order.length){                           // loop is done addinf new item into order
            let data: Order = new Order(itemId, vendorId, pack, quantity);
            this.order.push(data);
            this.saveChangesInLocalStorage();                                    //set cookie after adding new item
            break; 
          }
        }
      }
    }else{                                                      //adding first item
      let data: Order = new Order(itemId, vendorId, pack, quantity);
      this.order.push(data);
      this.saveChangesInLocalStorage();              //set cookie after adding new item
    }

    this.checkQuantity.emit();

  }else{//update old order from orders history  DOESNT KEEP IN CASH
    this.updateHistoryItem(itemId, pack, vendorId, quantity, itemName)
  }
  
}

updateHistoryItem(itemId, pack, vendorId, quantity, itemName, vendorIndex?){
  let index = this.vendors[this.vendorIndex]['changesMap'].indexOf(itemId)
  if( index == -1){
    this.vendors[this.vendorIndex]['changesMap'].push(itemId);
    this.vendors[this.vendorIndex]['changes'].push({pack: pack, vendorId: vendorId, quantity: quantity, itemId: itemId, name: itemName});
     ////console.log(this.vendors)
  }else{
    this.vendors[this.vendorIndex]['changes'][index] = {pack: pack, vendorId: vendorId, quantity: quantity, itemId: itemId, name: itemName};
  }

  if(vendorIndex >= 0){//on vendor change
    //console.log(vendorIndex)
    let index = this.vendors[vendorIndex]['changesMap'].indexOf(itemId)
    if( index == -1){
      this.vendors[vendorIndex]['changesMap'].push(itemId);
      this.vendors[vendorIndex]['changes'].push({pack: pack, vendorId: vendorId, quantity: quantity, itemId: itemId, name: itemName});
       //console.log(this.vendors)
    }else{
      this.vendors[vendorIndex]['changes'][index] = {pack: pack, vendorId: vendorId, quantity: quantity, itemId: itemId, name: itemName};
    }

    index = this.vendors[this.vendorIndex]['changesMap'].indexOf(itemId)
    let prevVendorId = this.vendors[this.vendorIndex]['id']
    if( index == -1){
      this.vendors[this.vendorIndex]['changesMap'].push(itemId);
      this.vendors[this.vendorIndex]['changes'].push({pack: pack, vendorId: prevVendorId, quantity: 0, itemId: itemId, name: itemName});
       ////console.log(this.vendors)
    }else{
      this.vendors[this.vendorIndex]['changes'][index] = {pack: pack, vendorId: prevVendorId, quantity: 0, itemId: itemId, name: itemName};
    }
  }
}


saveChangesInLocalStorage(){
  let user = localStorage.getItem('evendorUser');
  //console.log(user)
    let order = JSON.stringify(this.order);
    localStorage.setItem('order' + user, order);
  }

  onPrintInvoice() {
    this.printService.isPrinting = true;
    this.printService.itemsList = this.itemList;
    this.printService.printDocument();
  }

  trackById(index: number, item: Item) {
    return item.id
  }


}
