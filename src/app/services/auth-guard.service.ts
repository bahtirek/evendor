import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, Route, CanLoad} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(){
    if(this.authService.isLoggedIn()) return true;
    this.router.navigate(['/home']);
  }

  canActivateChild(){
    if(this.authService.isLoggedIn()) return true;
    this.router.navigate(['/home']);
  }

  canLoad(): boolean {
    if(this.authService.isLoggedIn()) return true;
    this.router.navigate(['/home']);
  }
}
