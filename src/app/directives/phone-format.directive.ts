
  import { Directive, HostListener} from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneFormat]'
})
export class PhoneFormatDirective {

  constructor (private ngControl: NgControl) {
  }

  @HostListener('keypress', ['$event'])
    keyEvent(event: KeyboardEvent) {
    if (!(event.charCode > 47 && event.charCode < 58 || event.charCode == 42)) {
      return false;
    }
  }
  
  @HostListener('change')
    ngOnChanges(){
      this.formatPhoneNumber();
    }

  @HostListener('keyup')
  keyUp() {
    this.formatPhoneNumber();
  }

  formatPhoneNumber(): any {
    let inputString = this.ngControl.control.value.replace(/D/g, '');
    let phoneNumber = inputString.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    if (phoneNumber.length > 14) {
      phoneNumber = phoneNumber.slice(0, 14);
    }
    this.ngControl.control.setValue(phoneNumber)
  }
}
  