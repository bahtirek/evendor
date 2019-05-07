import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PrintService } from '../../services/print.service';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.component.html',
  styleUrls: ['./print-layout.component.css']
})
export class PrintLayoutComponent implements OnInit, AfterViewInit {

  constructor(public printService: PrintService) { }

  itemsList = [];

  ngOnInit() {
    this.itemsList = this.printService.itemsList;
  }

  ngAfterViewInit(): void {
    this.printService.onDataReady();
  }

}
