import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { PrintService } from '../services/print.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private auth: AuthService, public printService: PrintService) { }

  ngOnInit() {
  }

  logout(){
    this.auth.logout();
  }
}
