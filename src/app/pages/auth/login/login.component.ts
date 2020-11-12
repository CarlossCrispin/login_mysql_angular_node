import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.fb.group({
    username:[''],
    password:[''],
  });

  constructor(private autSvc: AuthService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    /* const  userData = {
      username: 'crispinAdmin',
      password: '1234567',
    };

    this.autSvc.login(userData).subscribe( (res) => console.log('Login')); */
  }
  onLogin():void {
    const formValue = this.loginForm.value;
    this.autSvc.login(formValue).subscribe(res => {
      if(res){
        this.router.navigate(['']) ;
      }
     });
  }

}
