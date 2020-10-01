import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Supplier} from '../supplier-management/supplier';
import { NgModule } from '@angular/core';
import {SupplierService} from '../supplier-management/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

var inputEnabled = false;

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {
  private _allSup: Observable<Supplier[]>;  
  public get allSup(): Observable<Supplier[]> {  
    return this._allSup;  
  }  
  public set allSup(value: Observable<Supplier[]>) {  
    this._allSup = value;  
  }  

  constructor(private api: SupplierService, private router: Router, private fb: FormBuilder) { }
  supForm: FormGroup;
  supplier : Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";
  dateVal = new Date();
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;

  loadDisplay(){  
    debugger;  
    this.allSup= this.api.getAllSuppliers();  
  
  } 

  ngOnInit(): void {
    this.supForm= this.fb.group({  
      SupName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      SupCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
      SupEmail: ['', [Validators.required, Validators.email]], 
      SupStreetNr: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern('[0-9 ]*')]],
      SupStreet: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      SupCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]], 
      SupSuburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],       
    }); 
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
