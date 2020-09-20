import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Customer} from '../customer-management/customer';
import { NgModule } from '@angular/core';
import {CustomerService} from '../customer-management/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  constructor(private api: CustomerService, private router: Router) { }
   
  
  customer : Customer = new Customer();
  responseMessage: string = "Request Not Submitted";
  
  ngOnInit(): void {
    
  }

  addCustomer(){
    this.api.addCustomer(this.customer).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["customer-management"])
    })

  }

  gotoCustomerManagment(){
    this.router.navigate(['customer-management']);
  }

}
