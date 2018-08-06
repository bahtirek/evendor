import { Router } from '@angular/router';
import { packList } from './../shared/packaging';
import { Vendor } from './../shared/vendor';
import { AuthService } from './../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { url } from '../shared/url';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.css']
})
export class PriceComponent implements OnInit {
  priceRequestMessage: string = '';

  public url = url;
  public vendors: Vendor[];
  public itemsList;
  public packList = packList;
  public spinner = 'none';
  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {

    this.http.get<Vendor[]>(this.url.vendors + '?token=' + this.auth.token) //getting vendors
    .subscribe( //vendors subscribe
      result => {
        this.vendors = result;
      },
      error => {},
      () => {}
    );

    this.http.get<any>(this.url.reviewprice + '?token=' + this.auth.token)
    .subscribe(
      result=>{
        console.log(result)
        if(result.error == 'norequest'){
          this.priceRequestMessage = "You don't have any price requests";
        }else{
          this.itemsList = result;
        }
        
      },
      error=>{
        console.log(error)
        if(error.status == 0){
          console.log('no internet connection')
        }else{
          console.log("Something went wrong")
        }
        
      }
    );
  }


  increase(itemInd){
    console.log(itemInd)
    this.itemsList[itemInd]['quantity']++;
    console.log(this.itemsList[itemInd])
  }

  decrease(itemInd){
    console.log(itemInd)
    if(this.itemsList[itemInd]['quantity'] > 0){
      this.itemsList[itemInd]['quantity']--;
    }
  }

  changeVendor(newVendor, itemIndex){
    this.vendors.forEach(vendor => {
      if(vendor.id == newVendor){
        this.itemsList[itemIndex]['vendorId'] = vendor.id;
        this.itemsList[itemIndex]['vendorName'] = vendor.name;
      }
    });
    console.log(this.itemsList)
  }

  suspend() {
    let suspendedList = [];
    for (var i = 0; i < this.itemsList.length; i++) {
      var element = this.itemsList[i];
      suspendedList.push({id: element.id, pack: element.pack, quantity: element.quantity, vendor: element.vendorId});
      if(i == this.itemsList.length - 1){
        this.http.put(this.url.updatesuspend + '?token=' + this.auth.token , {order: suspendedList})
        .subscribe(
          result=>{
            console.log(result)
            this.spinner = 'none';
            this.router.navigate(["user/neworder"]);
            },
          error=>{
            console.log(error)
          }
        );
      }
    }
    
  }

}
