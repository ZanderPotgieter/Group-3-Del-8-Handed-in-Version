import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  //Product Category
  gotoAddProductCategory(){
    this.router.navigate(['add-product-category']);
  }

  gotoSearchProductCategory(){
    this.router.navigate(['search-product-category']);
  }

  //Product
  gotoAddProduct(){
    this.router.navigate(['add-product']);
  }

  gotoSearchProduct(){
    this.router.navigate(['search-product']);
  }

  gotoStockTake(){
    this.router.navigate(['stock-take']);
  }

  //VAT
  gotoAddVAT(){
    this.router.navigate(['add-vat']);
  }

  gotoUpdateVAT(){
    this.router.navigate(['update-vat']);
  }

}
