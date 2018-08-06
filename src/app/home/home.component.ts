import { Login } from './../user/shared/login';
import { emailValidator } from './../validators/email.validators';
import { AuthService } from './../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { url } from '../user/shared/url'

@Component({
  moduleId: module.id,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public url = url;
  public loginForm: FormGroup;
  public formErrors = {
    'email': '',
    'password': '',
    'login': ''
  };

  
  public validationMessages = {
    'email': {
      'required' : 'Email required',
      'emailValidator': 'Wrong email format'
    },
    'password': {
      'required': 'Password required'
    },
    'login': {
      'unauth':'Wrong email or password'
    }
  };

  public login: Login = new Login;

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    if(this.authService.isLoggedIn()) this.router.navigate(['/user']);
    this.buildForm();
  }


  buildForm(){
    this.loginForm = this.fb.group({
      "email": [this.login.email,[
          Validators.required,
          emailValidator
      ]],
      "password": [this.login.password,[
        Validators.required
      ]]
    });

    this.loginForm.valueChanges
      .subscribe(data=>this.onValueChange(data));

    this.onValueChange();
  }

  onValueChange(data?: any) {
    if (!this.loginForm) return;
    let form = this.loginForm;

    for (let field in this.formErrors) {
        this.formErrors[field] = "";//make sure that formerrors is empty from previous error messages
        
        let control = form.get(field);//access to form fild(email. password)

        if (control && control.dirty && !control.valid && control.touched) {
            let message = this.validationMessages[field];
            for (let key in control.errors) {
                this.formErrors[field] += message[key] + " ";
            }
        }
    }
}
  
 

  onLogin(form){
    let email = form.value.email;
    let password = form.value.password;
    this.http.post<any>(
      this.url.signin, 
      {email: email, password: password}, 
      {headers: new HttpHeaders({'X-Requested-With': 'XMLHttpRequest'})}
    )
    .subscribe(
      result=>{
       // console.log(result)
        if(result.token){
          if(this.authService.setToken(result.token, email)){
            if(result.account == true){
              this.router.navigate(["user"])
            }else{
              this.router.navigate(["user/account"])
            }
            
          }
        }
        console.log(result)
      },
      error=>{
        console.log(error)
        console.log(error.error)
        console.log(error.status)
        this.formErrors.login = '';
        if(error.status == 401){
          this.formErrors.login = this.validationMessages.login.unauth;
        }
      }
    );
    
  }
}
