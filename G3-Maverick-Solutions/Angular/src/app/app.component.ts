import { Component,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {User} from './user';
import {LoginService} from './login.service';
import {Container} from './container-management/container';
import {FormBuilder, Validators} from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DatePipe],
  styleUrls: ['./app.component.scss']
})



export class AppComponent  implements OnInit {
  title = 'ORDRA';
  dateVal = new Date();

  constructor(private api : LoginService, private router: Router, private fb: FormBuilder) { }
regForm: FormGroup;
showLogin: boolean = true;
showNav: boolean = false;
showRegister: boolean = false;
showError: boolean = false;
showInvalidPassword: boolean = false;
showContainerNotSelected: boolean = false;
errorMessage: string;
ConfirmPassword: string;
password: string;
session: any;
UserName: string;
UserPassword: string;

containers: Container[] = [];
containerSelected: boolean = false;
currentContainer: Container;
user : User = new User();

email: string;
otp: string;
showGenerateOTP: boolean = false;
showEnterOTP: boolean = false;
showResetPassword: boolean = false;
containersLoaded : boolean = false;
  ngOnInit(){
    this.api.getAllContainers().subscribe((res:any) =>{
      console.log(res);
      this.containers = res; 
      if (res.Error){
        alert(res.Error);
      }
      
    })

    this.regForm= this.fb.group({  
      UserName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      UserSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],   
      UserCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
      UserEmail: ['', [Validators.required, Validators.email]],   
    }); 
  }

  

login(){
  if(this.containerSelected == true){
    this.user.UserName = this.UserName;
    this.user.UserPassword = this.UserPassword;
  this.api.loginUser(this.user).subscribe( (res:any)=> {
    console.log(res);
    if(res.Error){
      this.errorMessage = res.Error;
      
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 5000);
    }else{
      localStorage.setItem("accessToken", res.sessionID);
      this.showLogin = false;
      this.showNav = true;
      this.showRegister = false
      this.showResetPassword = false;
      this.showEnterOTP = false;
      this.showGenerateOTP = false;

        }
    })}
    else{
        this.showContainerNotSelected = true;
    }
}

selectContainer(val: Container){
  this.setContainer(val);
}

setContainer(val: Container){
  this.currentContainer = val;
  this.containerSelected = true;
  this.showContainerNotSelected = false;
}

home(){
  this.showLogin = true;
  this.showNav = false;
  this.showRegister = false;
  this.showResetPassword = false;
  this.showEnterOTP = false;
  this.showGenerateOTP = false;
}

register(){
  this.showLogin = false;
  this.showNav = false;
  this.showRegister = true;
  this.showResetPassword = false;
  this.showEnterOTP = false;
  this.showGenerateOTP = false;
}

generateOTP()
{
  this.showLogin = false;
  this.showNav = false;
  this.showRegister = false;
  this.showEnterOTP = false;
  this.showGenerateOTP = true;
}

enterOTP()
{
  this.showLogin = false;
  this.showNav = false;
  this.showRegister = false;
  this.showResetPassword = false;
  this.showEnterOTP = true;
  this.showGenerateOTP = true; 
}

showRP()
{
  this.showLogin = false;
  this.showNav = false;
  this.showRegister = false;
  this.showResetPassword = true;
  this.showEnterOTP = false;
  this.showGenerateOTP = false; 
}




saveUser(){
  
this.api.registerUser(this.user).subscribe((res : any)=>{
  console.log(res);
  if(res.Error){
    this.errorMessage = res.Error;
    alert(this.errorMessage);
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }else{
    alert(res.Message);
  this.UserPassword = "";

  this.showLogin= true;
  this.showNav = false;
  this.showRegister = false;
  this.showContainerNotSelected = false;
  this.showResetPassword = false;
  this.showEnterOTP = false;
  this.showGenerateOTP = false;}
})

}

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
  this.router.navigate(["user"]);
  this.user = new User();
    
this.showLogin= true;
this.showNav = false;
this.showRegister = false;
this.showInvalidPassword = false;
this.showResetPassword = false;
this.showEnterOTP = false;
this.showGenerateOTP = false;
}

cancel(){
  this.showLogin= true;
this.showNav = false;
this.showRegister = false;
this.user = new User();
this.showContainerNotSelected = false;
this.showResetPassword = false;
this.showEnterOTP = false;
this.showGenerateOTP = false;
}

sendEmail(){
  this.api.sendEmail(this.email).subscribe((res : any)=>{
    console.log(res);
    if(res.Error)
    {
      this.errorMessage = res.Error;
      alert(this.errorMessage);
     
    }
    else{
      alert(res.Message);
        
    this.showLogin= false;
    this.showNav = false;
    this.showRegister = false;
    this.showContainerNotSelected = false;
    this.showResetPassword = false;
    this.showEnterOTP = true;
    this.showGenerateOTP = true;}
  })
  }

  checkOTP()
  {
    this.api.checkOTP(this.otp, this.email).subscribe((res : any)=>{
      console.log(res);
      if(res.Error)
      {
        this.errorMessage = res.Error;
        alert(this.errorMessage);
       
      }
      else{
        alert(res.Message);
          
      this.showLogin= false;
      this.showNav = false;
      this.showRegister = false;
      this.showContainerNotSelected = false;
      this.showResetPassword = true;
      this.showEnterOTP = false;
      this.showGenerateOTP = false;}
    })
  }

  onHome() {
    this.router.navigate(['/user']);
  }

  resetPassword()
  {
    this.api.resetPassword(this.email, this.password).subscribe((res : any)=>{
      console.log(res);
      if(res.Error)
      {
        this.errorMessage = res.Error;
        alert(this.errorMessage);
        
      }
      else{
        alert(res.Message);
          
      this.showLogin= true;
      this.showNav = false;
      this.showRegister = false;
      this.showContainerNotSelected = false;
      this.showResetPassword = false;
      this.showEnterOTP = false;
      this.showGenerateOTP = false;}
    })
  }


  onNavigate()
  {
    window.location.href='https://u17107459.wixsite.com/mysite';
  }


}
