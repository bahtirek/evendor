import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';



@Injectable()
export class AuthService {

  public token;

  constructor( private router: Router) { }


  setToken(token, user){
    localStorage.setItem('evendorToken', token);
    localStorage.setItem('evendorUser', user);
    this.token = token;
    return true
  }

  logout(){
    localStorage.removeItem('evendorToken');
    localStorage.removeItem('evendorUser');
    //this.currentUser = null;
    this.token = null;
    this.router.navigate(['/home']);
  }

  isLoggedIn(){
    this.token = localStorage.getItem('evendorToken');
  
    return tokenNotExpired();
  }

  userEmail(){
    return localStorage.getItem('evendorUser');
    
  }
}
