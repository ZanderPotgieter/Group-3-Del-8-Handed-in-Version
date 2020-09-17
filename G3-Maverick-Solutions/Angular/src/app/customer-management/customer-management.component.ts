import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-management',
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.scss']
})
export class CustomerManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoAddCustomer(){
    this.router.navigate(['add-customer']);
  }

  gotoViewCustomer(){
    this.router.navigate(['view-customer']);

  }


}
