import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Supplier} from '../supplier-management/supplier';
import { NgModule } from '@angular/core';
import {SupplierService} from '../supplier-management/supplier.service';

var inputEnabled = false;

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {
  

  constructor(private api: SupplierService, private router: Router) { }
  supplier : Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";
  dateVal = new Date();
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;

  ngOnInit(): void {
  }

  gotoSupplierManagement(){
    this.router.navigate(['supplier-management']);
  }

  searchSupplier(){
    this.api.searchSupplier(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.supplier.SupplierID = res.SupplierID;
          this.supplier.SupName = res.SupName;
          this.supplier.SupCell = res.SupCell;
          this.supplier.SupEmail = res.SupEmail;
          this.supplier.SupStreetNr = res.SupStreetNr;
          this.supplier.SupStreet = res.SupStreet;
          this.supplier.SupCode = res.SupCode;
          this.supplier.SupSuburb = res.SupSuburb;
      }
      
      this.showSearch = false;
      this.showResults = true;
      
    })

  }

  updateSupplier(){
    this.api.updateSupplier(this.supplier).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["supplier-management"])
    })

  }

  deleteSupplier(){
    this.api.deleteSupplier(this.supplier.SupplierID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["supplier-management"])
    })

  }



  enableInputs(){
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;

  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

}
