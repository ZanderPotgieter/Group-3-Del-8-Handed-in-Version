import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-generate-otp',
  templateUrl: './generate-otp.component.html',
  styleUrls: ['./generate-otp.component.scss']
})
export class GenerateOTPComponent implements OnInit {

  constructor(private api: LoginService, private router: Router) { }
  user : User = new User();
  email: string
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void {
  }

  sendEmail(){
    this.api.sendEmail(this.email).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
    })
  }

}
