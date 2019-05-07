import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class PrintService {
    isPrinting = false;
    itemsList: any[];
  
    constructor(private router: Router) { }
  
    printDocument() {
      this.isPrinting = true;
      this.router.navigate(['user/print']);
    }
  
    onDataReady() {
        window.print();
        this.isPrinting = false;     
    }

}
