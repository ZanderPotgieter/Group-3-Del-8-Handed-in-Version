import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Customer} from '../customer-management/customer';
import { NgModule } from '@angular/core';
import {CustomerService} from '../customer-management/customer.service';
import {CustomerOrderService} from '../customer-order-management/customer-order.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DialogService } from '../shared/dialog.service';




@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.scss']
})



export class ViewCustomerComponent implements OnInit {
  private _allCus: Observable<Customer[]>;  
  public get allCus(): Observable<Customer[]> {  
    return this._allCus;  
  }  
  public set allCus(value: Observable<Customer[]>) {  
    this._allCus = value;  
  }  

  constructor(private api: CustomerService, private dialogService: DialogService, private interaction: CustomerOrderService, private router: Router, private bf: FormBuilder) { }
  cusForm: FormGroup;
  customer : Customer = new Customer();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  customerNull: boolean = false;

  name : string;
  surname : string;

  loadDisplay(){  
    debugger;  
    this.allCus= this.api.getAllCustomers();  
  
  } 

  gotoPlaceOrder(){
    this.router.navigate(['place-order']);
  }

  ngOnInit(): void {
    this.loadDisplay();  
    this.cusForm= this.bf.group({  
      CusName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      CusSurname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],   
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      CusCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
      CusEmail: ['', [Validators.required, Validators.email]], 
      CusStreetNr: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern('[0-9 ]*')]],
      CusStreet: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      CusCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]], 
      CusSuburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],       
    }); 
    
  }

  searchCustomer(){
    this.api.searchCustomer(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      }
      else{
          this.customer.CustomerID = res.CustomerID;
          this.customer.CusName = res.CusName;
          this.customer.CusSurname = res.CusSurname;
          this.customer.CusCell = res.CusCell;
          this.customer.CusEmail = res.CusEmail;
          this.customer.CusStreetNr = res.CusStreetNr;
          this.customer.CusStreet = res.CusStreet;
          this.customer.CusCode = res.CusCode;
          this.customer.CusSuburb = res.CusSuburb;
          this.showSearch = false;
      this.showResults = true;
      }
    })

  }

  updateCustomer(){
    if (this.customer.CusName == null || this.customer.CusSurname ==null || this.customer.CusEmail == null || this.customer.CusCell==null || this.customer.CusStreet==null || this.customer.CusStreetNr==null|| this.customer.CusCode==null || this.customer.CusSuburb==null)
    {
      this.customerNull = true;
    }
    else
    {
    this.dialogService.openConfirmDialog('Are you sure you want to update this customer?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.updateCustomer(this.customer).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
      this.router.navigate(["customer-management"])
    })
  }
  });
  }
}

  deleteCustomer(){
    this.dialogService.openConfirmDialog('Are you sure you want to delete this customer?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.deleteCustomer(this.customer.CustomerID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);
      this.responseMessage = res.Message;}
      this.router.navigate(["customer-management"])
    })
  }
});

  }

  enableInputs(){
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;

  }

  cancel(){
    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed();
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }
  gotoCustomerManagment(){
    this.router.navigate(['customer-management']);
  }

}
