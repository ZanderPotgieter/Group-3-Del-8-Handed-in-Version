import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { Price } from '../../price';
import { Product } from '../../product';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-searched-product-details',
  templateUrl: './searched-product-details.component.html',
  styleUrls: ['./searched-product-details.component.scss']
})
export class SearchedProductDetailsComponent implements OnInit {
  
  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder) { }
  searchedForm: FormGroup;
  priceForm: FormGroup;
  categories: ProductCategory[];
  product : Product = new Product();
  price : Price = new Price();

  showBtns: boolean = true;
  showBtnsWhenUpdateClicked: boolean = false;
  showListOfPrices: boolean = false;
  showAddPrice: boolean = false;
  inputEnabled:boolean = true;

  ngOnInit(){
    this.searchedForm= this.fb.group({
      
      ProdName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdDesciption: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      ProdReLevel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9 ]*')]], 
      CPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      UPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      PriceStartDate: ['', [Validators.required]],
      PriceEndDate: [''],
    }); 

    this.productService.getAllProductCategory()
      .subscribe(value => {
        if (value != null) {
          this.categories = value;
        }
      });

      
  }

  Update(){
   this.showBtnsWhenUpdateClicked = true;
   this.showBtns = false;
   this.showListOfPrices = false;
   this.showAddPrice = false;
   this.inputEnabled = false;
  }

  Remove(){

  }

  Save(){

  }

  ListAllPrices(){
    this.showListOfPrices = true;
    this.showAddPrice = false;
  }

  AddPrice(){
    this.showAddPrice = true;
    this.showListOfPrices = false;
  }

  AddNewPrice(){

  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }
  

}
