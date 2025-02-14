import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Customer} from '../customer-management/customer';
import { NgModule } from '@angular/core';
import {CustomerService} from '../customer-management/customer.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {

  constructor(private api: CustomerService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }
  cusForm: FormGroup;
   customer : Customer = new Customer();
   responseMessage: string = "Request Not Submitted";
   customerNull: boolean = false;
  
  
  ngOnInit(): void {

    this.cusForm= this.fb.group({  
      CusName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      CusSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],   
      CusCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
      CusEmail: ['', [Validators.required, Validators.email]], 
      CusStreetNr: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern('[0-9 ]*')]],
      CusStreet: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      CusCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]], 
      CusSuburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],       
    }); 
  }

  addCustomer(){
    if (this.customer.CusName == null || this.customer.CusSurname ==null || this.customer.CusEmail == null || this.customer.CusCell==null || this.customer.CusStreet==null || this.customer.CusStreetNr==null|| this.customer.CusCode==null || this.customer.CusSuburb==null)
    {
      this.customerNull = true;
    }
    else
    {
    this.dialogService.openConfirmDialog('Are you sure you want to add the customer?')
    .afterClosed().subscribe(res => {
      if(res){
      this.api.addCustomer(this.customer).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message){
      this.dialogService.openAlertDialog(res.Message);}
        this.router.navigate(["customer-management"])
      })
    }
    });
  }
  }
  

  gotoCustomerManagment(){
    this.router.navigate(['customer-management']);
  }

    }
