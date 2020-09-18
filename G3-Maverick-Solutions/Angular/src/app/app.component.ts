import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DatePipe],
  styleUrls: ['./app.component.scss']
})



export class AppComponent {
  title = 'ORDRA';
  dateVal = new Date();

  constructor(private router: Router) { }

showLogin: boolean = true;
showNav: boolean = false;
showRegister: boolean = false;

login(){
  this.showLogin = false;
  this.showNav = true;
  this.showRegister = false;
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

Validate() {
        var password = document.getElementById("txtPassword")
        var confirmPassword = document.getElementById("txtConfirmPassword");
        if (password != confirmPassword) {
            alert("Passwords do not match.");
            return false;
        }
        return true;
    }


}
