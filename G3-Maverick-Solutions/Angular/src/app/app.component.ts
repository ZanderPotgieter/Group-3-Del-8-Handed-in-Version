import { Component,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {User} from './user';
import {LoginService} from './login.service';
import {Container} from './container-management/container';
import {Validators} from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DatePipe],
  styleUrls: ['./app.component.scss']
})



export class AppComponent  implements OnInit {
  title = 'ORDRA';
  dateVal = new Date();

  constructor(private api : LoginService, private router: Router) { }
  
showLogin: boolean = true;
showNav: boolean = false;
showRegister: boolean = false;
showError: boolean = false;
showInvalidPassword: boolean = false;
errorMessage: string;
ConfirmPassword: string;
session: any;

containers: Container[] = [];
currentContainer: Container;
user : User = new User();

  ngOnInit(){
    this.api.getAllContainers().subscribe((res:any) =>{
      console.log(res);
      this.containers = res;
      
    })

  }

  

login(){
  this.api.loginUser(this.user).subscribe( (res:any)=> {
    console.log(res);
    if(res.Error){
      this.errorMessage = res.Error;
      this.showError = true;
    }else{
      localStorage.setItem("accessToken", res.sessionID);
      this.showLogin = false;
      this.showNav = true;
      this.showRegister = false

        }
    })

 
}

selectContainer(val: Container){
  this.setContainer(val);
}

setContainer(val: Container){
  this.currentContainer = val;
}

home(){
  this.showLogin = true;
  this.showNav = false;
  this.showRegister = false;
}

register(){
  this.showLogin = false;
  this.showNav = false;
  this.showRegister = true;
}

saveUser(){
this.api.registerUser(this.user).subscribe((res : any)=>{
  console.log(res);
  if(res.Error){
    this.errorMessage = res.Error;
    this.showError = true;
  }else{
  localStorage.setItem("accessToken", res.SessionID);
  this.router.navigate(["user"])}
})}

Validate() {
        if (this.user.UserPassword != this.ConfirmPassword) {
           this.showInvalidPassword = true;

        }else{
          this.showInvalidPassword = false;
        }

}

logout()
{
  localStorage.removeItem("accessToken");
  this.router.navigate([""]);
}
}
