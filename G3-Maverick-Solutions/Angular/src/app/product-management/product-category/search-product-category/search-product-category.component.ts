import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { ProductCategoryService } from '../../product-category.service';
import { ProductCategory } from '../../product-category';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-search-product-category',
  templateUrl: './search-product-category.component.html',
  styleUrls: ['./search-product-category.component.scss']
})
export class SearchProductCategoryComponent implements OnInit {

  constructor(private productCategoryService: ProductCategoryService, private router: Router) { }

  productCategory : ProductCategory = new ProductCategory();
  responseMessage: string = "Request Not Submitted";

  showSaves: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;


  ngOnInit(){
    
  }

  Search(){
    this.productCategoryService.searchProductCategory(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.productCategory.ProductCategoryID = res.ProductCategoryID;
          this.productCategory.PCatName = res.PCatName;
          this.productCategory.PCatDescription = res.PCatDescription;
      }
      
      this.showSearch = true;
      this.showResults = true;
      
    })
 
  }

  Cancel(){

  }

  Update(){
    this.showSaves = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }
  
  Delete(){
    this.productCategoryService.deleteProductCategoryById(this.productCategory.ProductCategoryID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["product-management"])
    })
  }
  
  Save(){
    this.productCategoryService.updateProductCategory(this.productCategory).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["product-management"])
    })
  }

  cancel(){
    this.showSaves = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }
}
