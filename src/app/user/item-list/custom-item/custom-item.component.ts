import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'custom-item',
  templateUrl: './custom-item.component.html',
  styleUrls: ['./custom-item.component.css'],
  inputs: ['vendors']
})
export class CustomItemComponent implements OnInit {

  public customItemName = "";
  public vendorVal = "";
  public error = true;
  
  constructor() { }

  ngOnInit() {
  }

  @Output()
  addCustomItem: EventEmitter<object> = new EventEmitter();
  add(vendorId){
    console.log(vendorId, this.customItemName);
    
    this.addCustomItem.emit({vendorId:vendorId, vendorInd: this.vendorVal, customItemName: this.customItemName});
    this.customItemName = "";
    this.vendorVal = "";
  }

  isStringEmpty(){
    let stringRegex = /^(?!\s*$).+/i;
    this.error = stringRegex.test(this.customItemName);
  }
}
