import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager-management',
  templateUrl: './manager-management.component.html',
  styleUrls: ['./manager-management.component.scss']
})
export class ManagerManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoCreateManager(){
    this.router.navigate(['create-manager']);
  }

  gotoSearchManager(){
    this.router.navigate(['search-manager']);
  }


}
