import { Component, OnInit } from '@angular/core'; 
import { Router } from '@angular/router';
import { ProductCategoryService } from '../../product-category.service';
import { ProductCategory } from '../../product-category';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from '../../../shared/dialog.service';

@Component({
  selector: 'app-search-product-category',
  templateUrl: './search-product-category.component.html',
  styleUrls: ['./search-product-category.component.scss']
})
export class SearchProductCategoryComponent implements OnInit {

  constructor(private productCategoryService: ProductCategoryService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }
  pcatForm: FormGroup;
  productCategory : ProductCategory = new ProductCategory();
  responseMessage: string = "Request Not Submitted";

  showOptions: boolean = true;
  showAll: boolean = false;
  showSaves: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  name : string;
  allCategories: Observable<ProductCategory[]>;
  categoryNull: boolean = false;
  ngOnInit(){
    this.pcatForm= this.fb.group({  
      PCatName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      PCatDescription: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
       
    }); 
  }
  All(){
    this.allCategories = this.productCategoryService.getAllProductCategory();
    this.showAll = true;
    this.showSearch = false;
    this.showOptions = true;
  }

  Input(){
    this.showSearch = true;
    this.showAll = false;
    this.showOptions = false;
  }
  Search(){
    if(this.name == null)
    {
      this.categoryNull = true;
      this.showSearch = true;
      this.showResults = false;
    }
    else{
   
    this.productCategoryService.searchProductCategory(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      }
      else{
          this.productCategory.ProductCategoryID = res.ProductCategoryID;
          this.productCategory.PCatName = res.PCatName;
          this.productCategory.PCatDescription = res.PCatDescription;
      }
      
      this.showSearch = true;
      this.showResults = true;
      this.categoryNull = false;
      
    })
  }
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/SearchProductCategory.html")
  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

  Update(){
    this.showSaves = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }
  
  Delete(){
    this.dialogService.openConfirmDialog('Are you sure you want to delete this product category?')
    .afterClosed().subscribe( res => {
      if(res){
    this.productCategoryService.deleteProductCategoryById(this.productCategory.ProductCategoryID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);
        this.responseMessage = res.Message;}
      this.router.navigate(["product-management"])
    })
    }
    })
  }
  
  Save(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this product category?')
    .afterClosed().subscribe(res => {
      if(res){
    this.productCategoryService.updateProductCategory(this.productCategory).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
      this.router.navigate(["product-management"])
    })
    }
    })
  }

  cancel(){
    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed();
    this.showSaves = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }
}
