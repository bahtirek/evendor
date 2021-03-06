import { packList } from './../user/shared/packaging';
import { url } from './../user/shared/url';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-price-check',
  templateUrl: './price-check.component.html',
  styleUrls: ['./price-check.component.css']
})
export class PriceCheckComponent implements OnInit {

  //public mask: any[] = [ /\d/, /\d/,'.',  /\d/, /\d/, /\d/];
  url = url;
  message = '';
  itemList = [];
  packList = packList;
  id;
  expMessage;
  listonly = false;
  vendorNote = '';
  public priceRequestDate;
  


  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    if(!this.activatedRoute.snapshot.params["id"]){
      this.expMessage = "Link is expired";
      return false
    }
    this.id = this.activatedRoute.snapshot.params["id"];
    //console.log(this.id)
    let link = JSON.parse(this.id);
    this.priceRequestDate = link.date;
    this.http.get<any[]>(this.url.getprice + '/' + this.id)
      .subscribe(
        result=>{
          //console.log(result)
          if(result.length > 0){
            this.itemList = result;
          }else{
            this.expMessage = "Link is expired";
          }
        },
        error=>{
          //console.log(error)
          this.expMessage = "Link is expired";
        }
      ); 
  }

  submit(){
    //console.log(this.itemList)
    this.http.post<any[]>(this.url.sendprice, {itemlist: this.itemList, id: this.id, note: this.vendorNote})
    .subscribe(
      result=>{
        //console.log(result)
        //this.router.navigate(['/home']);
      },
      error=>{
        //console.log(error)

      }
    );
  }

  clear(){
    for(let item of this.itemList){
      if(!item.priceGiven){
        item.price = '';
        item.pack = 'Case';
      }
    }
    this.vendorNote = '';
  }

  getNumber(event){
    let key = event.keyCode;
    if(key > 47 && key < 58 || key == 46 || key == 190){
      return true
    }
    return false
  }

  setVendorNote(text){
    this.vendorNote = text;
  }

  
  

  public mask = function(rawValue) {
    let mask = [];
    for (var i = 0; i < rawValue.length; i++) {
      if(rawValue[i] != '.'){
        mask.push(/\d/);
      }
    }
    if(mask.length > 2){
      mask.splice(2, 0 , '.');
    }else{
      mask.push('.');
    }
   return mask.reverse();
 }

}
