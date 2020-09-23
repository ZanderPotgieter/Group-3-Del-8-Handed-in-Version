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

  prodBarcode: string;
  responseMessage: string = "Request Not Submitted";
  productBarcode : Product = new Product();
  productBarcodeWithPrice: Price = new Price();
  ngOnInit() {

    this.searchForm= this.fb.group({ 
      prodBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      SelectProd: ['', [Validators.required]],
      SelectProdC: ['', [Validators.required]],
      SelectCon: ['', [Validators.required]],
      ProdName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdDesciption: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdReLevel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9 ]*')]], 
      CPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      UPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      PriceStartDate: ['', [Validators.required]],
      PriceEndDate: [''],
      ProductCategoryID: [''],
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

    this.productService.getProductByBarcode(this.prodBarcode).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.productBarcode.ProdName = res.ProdName;
          this.productBarcode.ProdDesciption = res.ProdDesciption;
          this.productBarcode.ProdBarcode = res.ProdBarcode;
          this.productBarcode.ProdReLevel = res.ProdReLevel;
          this.productBarcode.ProductCategoryID = res.ProductCategoryID;
          this.productBarcode.ProductID = res.ProductID;
          this.productBarcodeWithPrice.CPriceR= res.CPriceR;
          this.productBarcodeWithPrice.UPriceR = res.UPriceR;
          this.productBarcodeWithPrice.PriceID = res.PriceID;
          this.productBarcodeWithPrice.PriceStartDate = res.PriceStartDate;
          this.productBarcodeWithPrice.PriceEndDate = res.PriceEndDate;
          this.productBarcodeWithPrice.ProductID = res.ProductID;
      }
      this.showBarcodeResult = true;
      this.showProductResult = false;
      this.showCategoryResults = false;
      this.showContainerResults = false;
      this.showAllProductsResults = false;
      
    })
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
