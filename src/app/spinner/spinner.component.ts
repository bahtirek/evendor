import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  inputs: ['spinner']
})
export class SpinnerComponent implements OnInit {

  constructor() { }

  spinner;

  ngOnInit() {
  }

}
