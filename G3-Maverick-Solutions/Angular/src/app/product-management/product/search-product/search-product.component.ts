import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { Price } from '../../price';
import { Product } from '../../product';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder) { }
  searchForm: FormGroup;
  categories: ProductCategory[];
  product : Product = new Product();

  showBarcodeInput: boolean = false;
  showSelectProduct: boolean = false;
  showSelectCategory: boolean = false;
  showSelectContainer: boolean = false;
  showSearchBtn: boolean = false;

  showBarcodeResult: boolean = false;
  showProductResult: boolean = false;
  showCategoryResults: boolean = false;
  showContainerResults: boolean = false;
  showAllProductsResults: boolean = false;

  ngOnInit() {

    this.searchForm= this.fb.group({ 
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
       
    }); 

    this.productService.getAllProductCategory()
    .subscribe(value => {
      if (value != null) {
        this.categories = value;
      }
    });
  }

  barcodeInput(){
    this.showBarcodeInput = true;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;
  }

  selectProduct(){
    this.showSelectProduct = true;
    this.showBarcodeInput = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;
  }

  selectCategory(){
    this.showSelectCategory = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;
  }
  
  selectContainer(){
    this.showSelectContainer = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSearchBtn = false;
  }

  searchBtn(){
    this.showSearchBtn = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;
  }

  SearchBarcode(){

    this.showBarcodeResult = true;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  SearchProduct(){
    this.showBarcodeResult = false;
    this.showProductResult = true;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  SearchCategory(){
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = true;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  SearchContainer(){
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = true;
    this.showAllProductsResults = false;
  }

  SearchAllProducts(){
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = true;
  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

  View(){
    this.router.navigate(['searched-product-details']);
  }

  
}
