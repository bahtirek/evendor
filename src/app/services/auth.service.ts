import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';



@Injectable()
export class AuthService {

  helper = new JwtHelperService();
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
    if (!this.helper.isTokenExpired(this.token)) return true;
  }

  userEmail(){
    return localStorage.getItem('evendorUser');
    
  }
}
