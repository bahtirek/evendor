import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'show-vendor',
  templateUrl: './show-vendor.component.html',
  styleUrls: ['./show-vendor.component.css'],
  inputs: ['vendor']
})
export class ShowVendorComponent implements OnInit {

  public vendor;
  
  constructor() { }

  ngOnInit() {
  }

  public editVendor: boolean = false;
  public vendorName: string = '';
  public shopList: boolean = false;



  @Output()
  remove: EventEmitter<object> = new EventEmitter();

  removeVendor(id, name){
    this.remove.emit({id: id, name: name});
  }

  @Output()
  save: EventEmitter<object> = new EventEmitter();

  saveVendor(){
    this.vendor.name = this.vendorName
    this.save.emit({name: this.vendor.name, id: this.vendor.id, shopList: this.shopList});
    this.editVendor = false;
  }

  edit(name){
    //console.log(this.vendor)
    //console.log(this.shopList)
    this.editVendor = true;
    this.vendorName = name;
    if(this.vendor.id == this.vendor.shopList){
      this.shopList = true;
      //console.log(this.shopList)
    }else{
      this.shopList == false;
      //console.log(this.shopList)
    }
  }

  cancel(){
    this.editVendor = false;
    this.vendorName = '';
  }

  public error = true;
  isStringEmpty(){
    let stringRegex = /^(?!\s*$).+/i;
    this.error = stringRegex.test(this.vendorName);
  }
}
