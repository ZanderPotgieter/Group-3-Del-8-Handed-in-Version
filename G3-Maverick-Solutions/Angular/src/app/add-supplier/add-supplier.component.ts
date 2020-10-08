import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supplier} from '../supplier-management/supplier';
import { NgModule } from '@angular/core';
import {SupplierService} from '../supplier-management/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ProductService} from 'src/app/product-management/product.service';
import {Product} from 'src/app/product-management/product';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {

  constructor(private api: SupplierService, private router: Router, private fb: FormBuilder, private productService: ProductService, private dialogService: DialogService) { }
  supForm: FormGroup;
  supplier : Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";
  products: Product[] = [];

  ngOnInit(): void {

    this.supForm= this.fb.group({  
      SupName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      SupCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
      SupEmail: ['', [Validators.required, Validators.email]], 
      SupStreetNr: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8), Validators.pattern('[0-9 ]*')]],
      SupStreet: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      SupCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]], 
      SupSuburb: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],       
    }); 

    this.productService.getAllProducts()
    .subscribe((value:any)=> {
      console.log(value);
      if (value != null) {
        this.products = value.Products;
      }
    });


  }

  addSupplier(){
    this.dialogService.openConfirmDialog('Are you sure you want to add the supplier?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.addSupplier(this.supplier).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}

      //alert(this.responseMessage)
      this.router.navigate(["supplier-management"])
    })
    }
  })

  }

  setProduct(val: Product){
  }

  gotoSupplierManagement(){
    this.router.navigate(['supplier-management']);
  }

}
