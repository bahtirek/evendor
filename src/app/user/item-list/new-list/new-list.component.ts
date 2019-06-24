import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { packList } from '../../shared/packaging';
import { url } from '../../shared/url';
import { Group } from '../../shared/group';
import { allItems } from '../../shared/allitems';

@Component({
  selector: 'new-list',
  templateUrl: './new-list.component.html',
  styleUrls: ['./new-list.component.css'],
  inputs: ['modal', 'family', 'token']
})
export class NewListComponent implements OnInit {

  public userItemsList = [];
  public allItems = allItems;
  private family;
  public modal;
  public packList = packList;
  private groups: Group[];
  private url = url;
  private token = this.token;
  public emailToCopy = ''
  public emailToCopyMessage = '';
  constructor(private http: HttpClient) { }

  ngOnInit() {
    //console.log(this.family)

    this.http.get<any>(this.url.useritems + '?token=' + this.token)
      .subscribe(
        result=>{
          //console.log(result)
          this.userItemsList = result;
          this.getUserList();//call func witch will transmit list to item-list.component 
          ////console.log(this.userItemsList)
        },
        error=>{
          //console.log(error)
        }
      );
   
    this.http.get<Group[]>(this.url.groups + '?token=' + this.token)
      .subscribe(
        result=>{
          this.groups = result;
          this.groups.push(new Group('Ungrouped', 0))
          //console.log(this.groups)
        },
        error=>{
          //console.log(error)
        }
      )

  }


//Remove item from user items list
  removeFromList(vendorInd, vendorId, itemInd, itemId, familyId){
    this.http.delete(this.url.useritem + '/' + itemId + '?token=' + this.token)
      .subscribe(
        result=>{
          if(result === 1){
            this.userItemsList[vendorInd]['items'].splice(itemInd, 1);
            for(var i = 0; i < this.family.length; i++){
              if(familyId == this.family[i]['id']){
                if(this.allItems[i]['items'].length > 0){
                  for(let item of this.allItems[i]['items']){
                    if(item.id == itemId){
                      item['vendorId'] = null;
                      item['vendorName'] = null;
                    }
                  }
                }
              }
            }
          }
        },
        error=>{
          this.modal.text = "Couldn't remove from list";
          this.modal.errDisplay = "block";
        }
      )
    
  }


  @Output()
  userList: EventEmitter<object> = new EventEmitter;
  
  getUserList(){//func witch will transmit list to item-list.component 
    this.userList.emit() //event to transmit userlist
  }


  @Output()
  note: EventEmitter<object> = new EventEmitter();

  addNote(itemInd, vendorInd){
    let data = {itemInd: itemInd, vendorInd: vendorInd};
    this.note.emit(data);
  }


  changeVendor(newIndex, prevIndex, itemIndex, newId, prevId, itemId, familyId, newName){
    if(newIndex != "" && prevIndex != newIndex){  //vendor index
      let data = {value: newId, update: 'vendor'};

      this.http.put<any>(this.url.useritem + '/' + itemId + '?token=' + this.token, data)
        .subscribe(
          result=>{
            if(result === 1){
              this.userItemsList[newIndex]['items'].push(this.userItemsList[prevIndex]['items'][itemIndex]);
              this.userItemsList[prevIndex]['items'].splice(itemIndex, 1);
              for(var i = 0; i < this.family.length; i++){
                if(familyId == this.family[i]['id']){
                  if(this.allItems[i]['items'].length > 0){
                    for(let item of this.allItems[i]['items']){
                      if(item.id == itemId){
                        item['vendorId'] = newId;
                        item['vendorName'] = newName;
                       break;
                      }
                    }
                  }
                }
              }
            }
          },
          error=>{
            this.modal.text = "Couldn't move to other vendor";
            this.modal.errDisplay = "block";
          }
        );
    
    }
  }


  //Change package

  changePack(itemId, itemInd, vendorId, vendorInd, pack){
    //console.log(itemId, itemInd, vendorId, vendorInd, pack)
    let data = {value: pack, update: 'pack'};
    this.http.put<any>(this.url.useritem + '/' + itemId + '?token=' + this.token, data)
    .subscribe(
      result=>{
        if(result != 1){
          this.userItemsList[vendorInd]['items'][itemInd]['pack'] = 'Case';
          this.modal.text = "Couldn't change packaging";
          this.modal.errDisplay = "block";
        }
      },
      error=>{
        this.userItemsList[vendorInd]['items'][itemInd]['pack'] = 'Case';
        this.modal.text = "Couldn't change packaging";
        this.modal.errDisplay = "block";
      }
    );
  }//changePack


  //Change group

  changeGroup(itemId, groupId, itemInd, vendorInd){
    //console.log(itemId, groupId, itemInd, vendorInd)

    let data = {value: groupId, update: 'group'};
    this.http.put<any>(this.url.useritem + '/' + itemId + '?token=' + this.token, data)
    .subscribe(
      result=>{
        if(result != 1){
          this.userItemsList[vendorInd]['items'][itemInd]['group'] = 0;
          this.modal.text = "Couldn't change packaging";
          this.modal.errDisplay = "block";
        }
      },
      error=>{
        this.userItemsList[vendorInd]['items'][itemInd]['group'] = 0;
        this.modal.text = "Couldn't change packaging";
        this.modal.errDisplay = "block";
      }
    );
  }

  copyList(){

    this.http.post<any>(this.url.copylist + '?token=' + this.token, {email: this.emailToCopy})
      .subscribe(
        result=>{
          if(result.error == 'emptyaccount'){
            this.modal.account = "block";
          }else if(result.email == this.emailToCopy){
            this.modal.alertDisplay = 'block';
            this.modal.text2 = 'We have sent an email with instructions. Please let account holder that you want to copy items list from to follow the instructions attached the email.';
          }
        },
        error=>{
          //console.log(error)
        },
        ()=>{}
      )
  }


}
