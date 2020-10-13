import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Supplier} from '../supplier-management/supplier';
import { NgModule } from '@angular/core';
import {Product} from 'src/app/product-management/product';
import {SupplierService} from '../supplier-management/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DialogService } from '../shared/dialog.service';

var inputEnabled = false;

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.scss']
})
export class ViewSupplierComponent implements OnInit {
 

  constructor(private api: SupplierService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }
  supForm: FormGroup;
  supplier : Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";
  dateVal = new Date();
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  showTable: boolean = true;
  name : string;
  suppliers: Supplier[] = [];
  products: Product[] = [];

  

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

    this.api.getAllSuppliers().subscribe((res: any) =>{
      console.log(res);
      if(res.Message != null){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)}
        else{
      this.suppliers = res;
      
    }
    })
  }

  gotoSupplierManagement(){
    this.router.navigate(['supplier-management']);
  }

  view(ndx: number){
    this.search(this.suppliers[ndx].SupName)

  }
  search(name : string){
   this.api.searchSupplier(name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      //alert(this.responseMessage)
    }
      else{
        this.supplier = res.supplier;
        this.products = res.products;

          
      this.showSearch = false;
      this.showResults = true;
      this.showTable = false;
      }
      
      
    })

  }

  searchSupplier(){
    this.api.searchSupplier(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      //alert(this.responseMessage)
    }
      else{
        this.supplier = res.supplier;
        this.products = res.products;

          
      this.showSearch = false;
      this.showResults = true;
      this.showTable = false;
      }
      
      
    })

  }

  updateSupplier(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this supplier?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.updateSupplier(this.supplier).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
      //alert(this.responseMessage)
      this.router.navigate(["supplier-management"])
    })
  }
})

  }

  deleteSupplier(){
    this.api.deleteSupplier(this.supplier.SupplierID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      this.dialogService.openAlertDialog(this.responseMessage)
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
