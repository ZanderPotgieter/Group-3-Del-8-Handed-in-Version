import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductCategoryService } from '../../product-category.service';
import { ProductCategory } from '../../product-category';


@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.scss']
})
export class AddProductCategoryComponent implements OnInit {

  constructor(private productCategoryService: ProductCategoryService, private router: Router) { }

  productCategory : ProductCategory = new ProductCategory();
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void{
  }

  Save() {
    this.productCategoryService.addProductCategory(this.productCategory).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;}
        alert(this.responseMessage)
        this.router.navigate(["product-management"])
    })
  }

  Cancel(){
    
  }
  
}
