import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductCategoryService } from '../../product-category.service';
import { ProductCategory } from '../../product-category';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from '../../../shared/dialog.service';

@Component({
  selector: 'app-add-product-category',
  templateUrl: './add-product-category.component.html',
  styleUrls: ['./add-product-category.component.scss']
})
export class AddProductCategoryComponent implements OnInit {

  constructor(private productCategoryService: ProductCategoryService, private router: Router,  private fb: FormBuilder, private dialogService: DialogService) { }
  pcatForm: FormGroup;
  productCategory : ProductCategory = new ProductCategory();
  responseMessage: string = "Request Not Submitted";
  categoryNull: boolean = false;
  ngOnInit(){
    this.pcatForm= this.fb.group({  
      PCatName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      PCatDescription: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      
       
    });  
  }

  Save() {
    if(this.productCategory.PCatName == null || this.productCategory.PCatDescription == null)
    {
      this.categoryNull = true;
    }
    else{
      this.dialogService.openConfirmDialog('Are you sure you want to add the product category?')
          .afterClosed().subscribe(res => {
            if(res){
    this.productCategoryService.addProductCategory(this.productCategory).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
        this.router.navigate(["product-management"])
    })
  }
  })
  }
  }

  Cancel(){
    this.router.navigate(["product-management"])
  }
  
}
