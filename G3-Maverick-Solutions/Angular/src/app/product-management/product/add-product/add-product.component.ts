import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { Price } from '../../price';
import { Product } from '../../product';
import { Container } from '../../../container-management/container';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder) { }
  pdForm: FormGroup;
  categories: ProductCategory[];
  newProduct : Product = new Product();
  price : Price = new Price();
  responseMessage: string = "Request Not Submitted";
 
  Select: number;
  selectedCatID: number;

  addToSystem: boolean = false;
  linkToContainer: boolean = false;
 
  containers: Container[] = [];
  products: Product[] = [];

  ngOnInit(){
    this.pdForm= this.fb.group({
      Select:  ['', [Validators.required]],
      ProdName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdDesciption: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      ProdReLevel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9 ]*')]], 
      CPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      UPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      PriceStartDate: ['', [Validators.required]], 
      SelectCon: ['', [Validators.required]], 
      SelectProduct: ['', [Validators.required]],
    }); 
    this.productService.getAllProductCategory()
      .subscribe(value => {
        if (value != null) {
          this.categories = value;
        }
      });

    
  }

  AddToSystem(){
    this.addToSystem = true;
    this.linkToContainer = false;
  }

  LinkToContainer(){
    this.linkToContainer = true;
    this.addToSystem = false;
  }

  loadProducts(val: ProductCategory){
    this.Select = val.ProductCategoryID;
    this.newProduct.ProductCategoryID = this.selectedCatID;
  }

  Save(){
    this.productService.addProduct(this.newProduct).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;}
        alert(this.responseMessage)
        this.router.navigate(["product-management"])
    })
    
  }


  Link(){

  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }
  

}
