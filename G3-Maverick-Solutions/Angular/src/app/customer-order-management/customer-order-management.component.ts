import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-order-management',
  templateUrl: './customer-order-management.component.html',
  styleUrls: ['./customer-order-management.component.scss']
})
export class CustomerOrderManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoPlaceOrder(){
    this.router.navigate(['place-order']);
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/CustomerOrderManagementScreen.html")
  }

  gotoSearchOrder(){
    this.router.navigate(['search-order']);
  }

  gotoSendNotification(){
    this.router.navigate(['send-notification']);
  }

}
