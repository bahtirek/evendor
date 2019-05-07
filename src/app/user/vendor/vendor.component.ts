import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';

import { Vendor } from '../shared/vendor';
import { modal } from '../shared/modal';
import { url } from '../shared/url';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {
  
  public vendors: Vendor[];
  public modal = modal;
  private url = url;
    
    constructor( private http: HttpClient, private auth: AuthService) { }
    ngOnInit() {
     //if(!this.auth.isLoggedIn())  this.router.navigate(['/home']);
      this.getVendors();
  }

  getVendors(){
    this.http.get<any>(this.url.vendors + '?token=' + this.auth.token)
    .subscribe(
      result=>{
        //console.log(result)
        this.vendors = result;
      },
      error=>{
        //console.log(error)
        if(error.status == 0){
          //console.log('no internet connection')
        }else{
          //console.log("Something went wrong")
        }
        
      }
    )
 
  };
  //
  addVendor(newVendor){
    let vendorName = newVendor.vendorName;
    let shopList = newVendor.shopList;
    //console.log(vendorName)
    this.http.post<any>(this.url.vendor + '?token=' + this.auth.token, {name: vendorName, shopList: shopList})
      .subscribe(
        result=>{
          ////console.log(result)
          this.getVendors();
        },
        error=>{
          ////console.log(error)
          this.modal.text = "Couldn't add vendor";
          this.modal.errDisplay = "block";
        }
      );
  }

  removeVendor(data){
    this.http.delete<any>(this.url.vendor + '/' + data.id + '?token=' + this.auth.token)
      .subscribe(
        result=>{
          //console.log(result);
          if(result){
            this.getVendors();
           //this.vendors.splice(index, 1);
          }
        },
        error=>{
          //console.log(error)
          if(error.error.count > 0){
            this.modal.text = "One or more items assigned to " + data.name;
            this.modal.errDisplay = "block";
          }else{
            this.modal.text = "Couldn't remove vendor";
            this.modal.errDisplay = "block";
          }
          
        }
      );
   }

  updateVendor(data){
    this.http.put(this.url.vendor + '/' + data.id + '?token=' + this.auth.token, {name: data.name, shopList: data.shopList})
      .subscribe(
        result=>{
          //console.log(result)
        }
      );
    
   }
}
