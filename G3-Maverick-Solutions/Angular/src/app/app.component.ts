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

  logout()
  {
    localStorage.removeItem("accessToken");
    this.router.navigate(["login"]);
  }

}
