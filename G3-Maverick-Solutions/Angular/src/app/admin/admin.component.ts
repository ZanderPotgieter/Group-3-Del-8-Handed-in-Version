import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoDashboard(){
    this.router.navigate(['admin-dashboard']);
  }

  gotoUserAccess(){
    this.router.navigate(['user-access']);
  }

  gotoUserType(){
    this.router.navigate(['user-table']);
  }

  gotoStatusManagement(){}

}
