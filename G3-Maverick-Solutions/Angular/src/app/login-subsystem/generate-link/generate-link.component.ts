import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { User } from 'src/app/user';

@Component({
  selector: 'app-generate-link',
  templateUrl: './generate-link.component.html',
  styleUrls: ['./generate-link.component.scss']
})
export class GenerateLinkComponent implements OnInit {

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
