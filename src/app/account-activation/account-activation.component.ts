import { AuthService } from './../services/auth.service';
import { url } from './../user/shared/url';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.css']
})
export class AccountActivationComponent implements OnInit {

  url = url;
  message = '';
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient,  private auth: AuthService) { }

  ngOnInit() {
    let id = this.activatedRoute.snapshot.params["id"];
    this.http.get(this.url.accountactivation + '/' + id)
      .subscribe(
        result=>{
          //console.log(result)
          setTimeout(()=>{this.auth.logout();}, 3000);
          if(result == 1) this.message = 'Your account is activated';
          //this.router.navigate(['/home']);
        },
        error=>{
          //console.log(error)
        }
      ); 
  }

}
