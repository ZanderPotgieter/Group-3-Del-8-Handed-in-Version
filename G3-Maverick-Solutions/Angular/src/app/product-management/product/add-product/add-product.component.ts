import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { Price } from '../../price';
import { Product } from '../../product';
import { Container } from '../../../container-management/container';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { variable } from '@angular/compiler/src/output/output_ast';
import {LoginService} from 'src/app/login.service';
import {Supplier} from 'src/app/supplier-management/supplier';
import { DialogService } from '../../../shared/dialog.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder,private api: LoginService, private dialogService: DialogService) { }
  pdForm: FormGroup;
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  selectedSupplier: Supplier;
  selectedProductID : number;
  newProduct : Product = new Product();
  price : Price = new Price();
  responseMessage: string = "Request Not Submitted";
  quantity: number;
 
  Select: number;
  SelectSup: number;
  suppliers: Supplier[] = [];
  selectedCatID: number;

  addToSystem: boolean = false;
  linkToContainer: boolean = false;
  
  showmain= true;
  selectedContainerID: number;
 
  containers: Container[] = [];
  products: Product[] = [];

  ngOnInit(){
    this.pdForm= this.fb.group({
      Select:  ['', [Validators.required]],
      SelectSup:  ['', [Validators.required]],
      ProdName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdDesciption: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      ProdReLevel: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9 ]*')]], 
      CPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      UPriceR: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern('[0-9]+[.,]?[0-9]*')]],
      PriceStartDate: ['', [Validators.required]], 
      SelectCon: ['', [Validators.required]], 
      SelectProduct: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    }); 
    this.productService.getAllProducts()
    .subscribe((value:any)=> {
      console.log(value);
      if (value != null) {
        this.products = value.Products;
      }
    });

    this.api.getAllContainers().subscribe((res:any) =>{
      console.log(res);
      this.containers = res; 
      if (res.Error){
        this.dialogService.openAlertDialog(res.Error);
      }
      
    });

    this.productService.getAllSuppliers() .subscribe((value:any)=> {
      console.log(value);
      if (value != null) {
        this.suppliers = value;
      }
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
    this.showmain= false;
  }

  LinkToContainer(){
    this.linkToContainer = true;
    this.addToSystem = false;
    this.showmain= false;
  }

  loadProducts(val: ProductCategory){
   
    this.addCategory(val);
  }

  addCategory(val : ProductCategory){
    this.selectedCategory = val;
  }

  loadSupplier(val: Supplier){
   
    this.addSupplier(val);
  }

  addSupplier(val : Supplier){
    this.selectedSupplier = val;
  }

  setProducts(val : Product){
    this.setProduct(val);
    
  }
  setProduct(val: Product){
    this.selectedProductID = val.ProductID
}
  setContainer(val : Container){
    this.setCon(val)
    
  }

  setCon(val: Container){
    this.selectedContainerID = val.ContainerID;
  }

  Save(){
    this.dialogService.openConfirmDialog('Are you sure you want to add the product?')
          .afterClosed().subscribe(res => {
            if(res){
    this.newProduct.SupplierID = this.selectedSupplier.SupplierID;
    this.newProduct.ProductCategoryID = this.selectedCategory.ProductCategoryID;
    this.price.Product = this.newProduct;
    this.productService.addProduct(this.price).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);
        this.router.navigate(["product-management"]);}
        else if (res.Error){
          this.dialogService.openAlertDialog(res.Error);
        }
       
    })
    }
    })
    
  }


  Link(){
    return this.productService.linkContainer( this.selectedContainerID, this.selectedProductID, this.quantity).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)
        this.router.navigate(["product-management"]);}
        else if (res.Error){
          this.dialogService.openAlertDialog(res.Error);
        }
       
    })


  }

  RemoveLink(){
    return this.productService.removeContainer( this.selectedContainerID,this.selectedProductID,).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)
        this.router.navigate(["product-management"]);}
        else if (res.Error){
          this.dialogService.openAlertDialog(res.Error);
        }
       
    })


  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }
  

}
