import { AuthService } from './../../services/auth.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { NewListComponent } from './new-list/new-list.component' //Needed for @viewChild



import { Item } from '../shared/item';
import { Vendor } from '../shared/vendor';
import { family } from '../shared/family';
import { modal } from '../shared/modal';
import { url } from '../shared/url';
import { packList } from '../shared/packaging';
import { allItems } from '../shared/allitems';



@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})

export class ItemListComponent implements OnInit {
  
  public family = family;
  public allItems = allItems;
  public vendors: Vendor[];
  public userItemsList = [];
  public modal = modal;
  public userId = 1;
  public note = {name: '', note:'', vendorInd: null, itemInd: null}
  private url = url;
  public packList = packList;
  public token = this.auth.token;

  
  constructor(private http: HttpClient, private auth: AuthService) { }
  ngOnInit() {
    this.http.get<any>(this.url.vendors + '?token=' + this.token)
    .subscribe(
      result=>{
        //console.log(result)
        this.vendors = result;
      },
      error=>{
        //console.log(error)
      }
    );
  //console.log(this.family)
  }// END of NgOnInit
    

  
  @ViewChild(NewListComponent, {static: true}) // Access to child component
  list: NewListComponent;

  userList(){// geting userList
    this.userItemsList = this.list.userItemsList;
  }


//////////////////////////////////////////////   ADD ITEM TO USER LIST 

  addToList(data){// adding items to new items list
     
    this.http.post(this.url.useritem + '?token=' + this.token, {itemId: data.itemId, vendorId: data.vendorId})
      .subscribe(
        result=>{
          //console.log(result)
          if(result === true){
            this.allItems[data.familyInd]['items'][data.itemInd]['pack'] = 'Case';
            this.allItems[data.familyInd]['items'][data.itemInd]['groupId'] = 0 ;
            this.userItemsList[data.vendorInd]['items'].push(this.allItems[data.familyInd]['items'][data.itemInd]);// add item to userItemsList
            //console.log(data) 
            //console.log(this.userItemsList) 
            //console.log(this.allItems) 
            this.allItems[data.familyInd]['items'][data.itemInd]['vendorId'] = this.vendors[data.vendorInd]['id']; //add vendor id to allitems list
            this.allItems[data.familyInd]['items'][data.itemInd]['vendorName'] = this.vendors[data.vendorInd]['name']; //add vendor name to allitems list
          }
        },
        error=>{
          //console.log(error)
          this.modal.text = "Couldn't add to list";
          this.modal.errDisplay = "block";
        }
      );    
  }

//////////////////////////////////////////////   END OF ADD ITEM TO USER LIST  


//////////////////////////////////////////////   CUSTOM ITEM 

  addCustomItem(data){
    //console.log(data)
    this.http.post<number>(this.url.customitem + '?token=' + this.auth.token, {name: data.customItemName, vendorId: data.vendorId})
      .subscribe(
        result=>{
          //console.log(result)
          this.userItemsList[data.vendorInd]['items'].push(new Item(data.customItemName, 'cus', result, 'Case', 0));// add item to userItemsList
          //console.log(this.userItemsList[data.vendorInd]['items'])
        },
        error=>{
          //console.log(error)
          this.modal.text = "Couldn't add new item";
          this.modal.errDisplay = "block";
        }
      );
  }

//////////////////////////////////////////////   END OF CUSTOM ITEM 


//////////////////////////////////////////////    ITEM'S NOTE 

// open note modal
noteModal(data){
  //console.log(this.userItemsList)
  //console.log(data)
  this.modal.noteDisplay = 'block';
  this.note.name = this.userItemsList[data.vendorInd]['items'][data.itemInd]['name'];
  this.note.note = this.userItemsList[data.vendorInd]['items'][data.itemInd]['note'];
  this.note.vendorInd = data.vendorInd;
  this.note.itemInd = data.itemInd;
}




// save item note

  saveNote(){
    let itemId = this.userItemsList[this.note.vendorInd]['items'][this.note.itemInd]['id'];
      if(this.note.note){
        if(this.userItemsList[this.note.vendorInd]['items'][this.note.itemInd]['note']){
          this.http.put(this.url.itemsnote + '/' + itemId +'?token=' + this.auth.token, {note: this.note.note})
            .subscribe(
              result=>{
                //console.log(result)
                this.userItemsList[this.note.vendorInd]['items'][this.note.itemInd]['note'] = this.note.note;
              },
              error=>{
                //console.log(error)
                this.modal.text = "Couldn't update item note";
                this.modal.errDisplay = "block";
              }
            );
          
        }else{
          this.http.post(this.url.itemsnote + '/' + itemId +'?token=' + this.auth.token, {note: this.note.note})
          .subscribe(
            result=>{
              //console.log(result)
              this.userItemsList[this.note.vendorInd]['items'][this.note.itemInd]['note'] = this.note.note;
            },
            error=>{
              //console.log(error)
              this.modal.text = "Couldn't add new note for item";
              this.modal.errDisplay = "block";
            }
          );
        }
      }else{
        this.http.delete(this.url.itemsnote + '/' + itemId +'?token=' + this.auth.token)
        .subscribe(
          result=>{
            //console.log(result)
            this.userItemsList[this.note.vendorInd]['items'][this.note.itemInd]['note'] = this.note.note;
          },
          error=>{
            //console.log(error)
            this.modal.text = "Couldn't remove note";
            this.modal.errDisplay = "block";
          }
        );
      }
  }
/////////////////////////////////////   END OF ITEM'S NOTE 

}


