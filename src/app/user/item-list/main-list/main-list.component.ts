import { url } from './../../shared/url';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'main-list',
  templateUrl: './main-list.component.html',
  styleUrls: ['./main-list.component.css'],
  inputs: ['allItems', 'vendors', 'token']
})


export class MainListComponent implements OnInit {

  public allItems = this.allItems;
  private url = url;
  private token = this.token;
  
  constructor(private http: HttpClient) { }
  ngOnInit() {

  }

  getItems(familyId, index){

    this.http.get(this.url.items + '/' + familyId + '?token=' + this.token)
      .subscribe(
        result=>{
          //console.log(result)
          this.allItems[index]['items'] = result;
          //console.log(this.allItems)
        },
        error=>{
          //console.log(error)
        }
      );


  }


  @Output()
  addToList: EventEmitter<object> = new EventEmitter();
  add(familyInd, itemInd, vendorInd, vendorId, itemId){
    //console.log(vendorId)
    let data = {familyInd: familyInd, itemInd: itemInd, vendorInd: vendorInd, vendorId: vendorId, itemId: itemId};
    this.addToList.emit(data);
  }
}
