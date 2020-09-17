import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { CreditorPayment} from '../creditor-payment'; 
import { CreditorPaymentService } from '../creditor-payment.service';  
import { HttpClient, HttpHeaders } from "@angular/common/http"; 
import { Router } from '@angular/router';
import { Supplier } from 'src/app/supplier-management/supplier';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
 
  constructor(private api: CreditorPaymentService, private router: Router) { }
  suppliers: Supplier[];
  creditorpayment : CreditorPayment = new CreditorPayment();
  responseMessage: string = "Request Not Submitted";
 
  ngOnInit(){
this.api.getAllCreditors().subscribe(value => {if (value != null)(this.suppliers = value);})
  }

  addCreditorPayment(){
    this.api.addCreditorPayment(this.creditorpayment).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["creditor-management"])
    })

  }

  gotoCreditorManagement(){
    this.router.navigate(['creditor-management']);
  }

}
 