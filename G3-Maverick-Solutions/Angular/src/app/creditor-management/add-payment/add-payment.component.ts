import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { CreditorPayment} from '../creditor-payment'; 
import { CreditorPaymentService } from '../creditor-payment.service';  
import { HttpClient, HttpHeaders } from "@angular/common/http"; 
import { Router } from '@angular/router';
import { Supplier } from 'src/app/supplier-management/supplier';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  constructor(private api: CreditorPaymentService, private router: Router,private bf: FormBuilder,private dialogService: DialogService) { }
  suppliers: Supplier[];
  creditorpayment : CreditorPayment = new CreditorPayment();
  responseMessage: string = "Request Not Submitted";
  selectedSupplier: Supplier;
  paymentNull: boolean = false;
  credForm: FormGroup;
  ngOnInit(){
    this.credForm= this.bf.group({    
      CredPaymentAmount: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(12), Validators.pattern('[0-9]*')]], 
      CredPaymentDate: ['', [Validators.required]],
      SupplierID: ['', [Validators.required]],      
    });

    this.api.getAllSuppliers()
    .subscribe(value => {
      if (value != null) {
        this.suppliers = value;
      }
    });
  }

  loadSupplier(val: Supplier){
   
    this.addSupplier(val);
  }
  
  addSupplier(val : Supplier){
    this.selectedSupplier = val;
  }

  addCreditorPayment(){
    if (this.creditorpayment.SupplierID == null || this.creditorpayment.CredPaymentAmount ==null || this.creditorpayment.CredPaymentDate == null)
      {
        this.paymentNull = true;
      }
      else
      {
    this.dialogService.openConfirmDialog('Are you sure you want to add the creditor payment?')
      .afterClosed().subscribe(res => {
        if(res){
    this.api.addCreditorPayment(this.creditorpayment).subscribe( (res: any)=> {
      console.log(res);
      this.router.navigate(["creditor-management"]);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);
        }
        else if (res.Error){
          alert(res.Error);
        }
      })
    }
  })
  }
  }
      
  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/AddPayment.html")
  }
  

  gotoCreditorManagement(){
    this.router.navigate(['creditor-management']);
  }

}
 