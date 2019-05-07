import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';

import { url } from '../shared/url';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  private url = url;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
  }

  onSignup(form: NgForm){
    //console.log(form.value)
    let userName = form.value.username;
    let email = form.value.email;
    let password = form.value.password;
    //console.log(email)
    this.http.post(
      this.url.signup, 
      {name: userName, email: email, password: password}, 
      {headers: new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'})}
    )
    .subscribe(
      result=>{
        //console.log(result)
        this.router.navigate(['/home']);
      },
      error=>{
        //console.log(error)
      }
    );
    
  }

  cancel(){
    this.router.navigate(['/home']);
  }

}
