import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  showProd: boolean = false;
  showProdCat: boolean = false;
  showvat: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/ProductManagementScreen1.html")
  }

  showProduct(){
    this.showProd = true;
    this.showProdCat = false;
    this.showvat = false;
  }

  showProductCategory(){
    this.showProdCat = true;
    this.showvat = false;
    this.showProd = false;
  }

  showVat(){
    this.showvat = true;
    this.showProdCat = false;
    this.showProd = false;
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
