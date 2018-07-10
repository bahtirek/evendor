import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.css'],
  inputs: ['vendorName']
})
export class AddVendorComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  
  public vendorName: string;
  public shopList: boolean;

  @Output()
  add: EventEmitter<object> = new EventEmitter();
  
  addVendor(){
    this.add.emit({vendorName: this.vendorName, shopList: this.shopList});
    this.shopList = false;
    this.vendorName = "";
  }
  
}
