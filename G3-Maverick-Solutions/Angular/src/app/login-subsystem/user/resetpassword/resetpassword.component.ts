import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  constructor(private api: LoginService, private router: Router) { }
  user : User = new User();
  confirmPassword: string;
  responseMessage: string = "Request Not Submitted";


  ngOnInit(): void {
  }

  resetPassword(){
    if(this.confirmPassword == this.user.UserPassword)
    {
      this.api.resetPassword(this.user).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message){
        this.responseMessage = res.Message;}
        alert(this.responseMessage)
      })
    }
    else 
    {
      this.responseMessage = "Password and Confirm Password do not match";
      alert(this.responseMessage);
    }
  }
    
    

}
