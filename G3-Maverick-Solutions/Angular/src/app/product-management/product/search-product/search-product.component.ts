import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { Price } from '../../price';
import { Product } from '../../product';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {LoginService} from 'src/app/login.service';
import {Container} from 'src/app/container-management/container';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {ContainerProduct} from '../../container-product';
import {Supplier} from 'src/app/supplier-management/supplier';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styleUrls: ['./search-product.component.scss']
})
export class SearchProductComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private fb: FormBuilder, private api: LoginService) { }
  searchForm: FormGroup;
  pdForm: FormGroup;
  categories: ProductCategory[];
  containers: Container[];
  product : Product = new Product();
  minDate: Date = new Date();

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
  prodName: string;
  responseMessage: string = "Request Not Submitted";
  productBarcode : Product = new Product();
  productBarcodeWithPrice: Price = new Price();

  Product: Product = new Product();
  Price: Price = new Price();
  pricelist: Price[] =[];
  productList: Product[] = [];
  list: ProductDetails[] = [];
  category : ProductCategory = new ProductCategory();
  product_conlist: ContainerProduct[] = [];
  conProduct: ContainerProduct = new ContainerProduct();

  products: Product[] = [];
  newPrice: Price = new Price();
  found = false;

  showadd: boolean=false;
  containerID: number;
  productName: number;
  productID: number;
  CategoryName: string;
  categoryID: number;

  quantity: number;
  mydate: Date =new Date();
 
  Select: number;
  selectedCatID: number;
  showPriceList : boolean = false;

  moveToContainer: boolean = false;
  selectedContainerID: number;
  supplier: Supplier = new Supplier();
  

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
    
    this.pdForm= this.fb.group({
      SelectCon: ['', [Validators.required]], 
      SelectProduct: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
    });

    this.productService.getAllProductCategory()
    .subscribe(value => {
      if (value != null) {
        this.categories = value;
      }
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
        alert(res.Error);
      }
      
    });
  }

  showPrice(){
    this.showPriceList = true;
  }

  barcodeInput(){
    this.showBarcodeInput = true;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;

    this.showBarcodeInput = true;
      this.showBarcodeResult = false;
      this.showProductResult = false;
      this.showCategoryResults = false;
      this.showContainerResults = false;
      this.showAllProductsResults = false;
    
  }

  selectProduct(){
    this.showSelectProduct = true;
    this.showBarcodeInput = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;

    this.showBarcodeInput = false;
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  selectCategory(){
    this.showSelectCategory = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectContainer = false;
    this.showSearchBtn = false;

    
    this.showBarcodeInput = false;
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }
  
  selectContainer(){
    this.showSelectContainer = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSearchBtn = false;

    this.showBarcodeInput = false;
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  searchBtn(){
    this.showSearchBtn = true;
    this.showBarcodeInput = false;
    this.showSelectProduct = false;
    this.showSelectCategory = false;
    this.showSelectContainer = false;

    this.showBarcodeInput = false;
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;
  }

  setContainer(val: Container){
    this.containerID = val.ContainerID;
  }

  setCategory(val: ProductCategory){
      this.categoryID = val.ProductCategoryID;
  }

  setProduct(val: Product){
    this.prodName = val.ProdName;
  }

  SearchBarcode(){

   return  this.productService.getProductByBarcode(this.prodBarcode).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.Product.ProdName = res.Product.ProdName;
          this.Product.ProdDesciption = res.Product.ProdDesciption;
          this.Product.ProdBarcode = res.Product.ProdBarcode;
          this.Product.ProdReLevel = res.Product.ProdReLevel;
          this.Product.ProductCategoryID = res.Product.ProductCategoryID;
          this.Product.ProductID = res.Product.ProductID;
          this.Price.CPriceR= res.CurrentPrice.CPriceR;
          this.Price.UPriceR = res.CurrentPrice.UPriceR;
          this.Price.PriceID = res.CurrentPrice.PriceID;
          this.Price.PriceStartDate = res.CurrentPrice.PriceStartDate;
          this.Price.PriceEndDate = res.CurrentPrice.PriceEndDate;
          this.Price.ProductID = res.Product.ProductID;

          

          this.pricelist = res.PriceList;
          this.category = res.ProductCategory;
          
          this.product_conlist = res.ProductContainers;
          this.supplier = res.supplier;

      }
      this.showBarcodeInput = false;
      this.showBarcodeResult = false;
      this.showProductResult = true;
      this.showCategoryResults = false;
      this.showContainerResults = false;
      this.showAllProductsResults = false;
      
    })
  }

  SearchProduct(){
   return  this.productService.getProductByName(this.prodName).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.Product.ProdName = res.Product.ProdName;
          this.Product.ProdDesciption = res.Product.ProdDesciption;
          this.Product.ProdBarcode = res.Product.ProdBarcode;
          this.Product.ProdReLevel = res.Product.ProdReLevel;
          this.Product.ProductCategoryID = res.Product.ProductCategoryID;
          this.Product.ProductID = res.Product.ProductID;
          this.Price.CPriceR= res.CurrentPrice.CPriceR;
          this.Price.UPriceR = res.CurrentPrice.UPriceR;
          this.Price.PriceID = res.CurrentPrice.PriceID;
          this.Price.PriceStartDate = res.CurrentPrice.PriceStartDate;
          this.Price.PriceEndDate = res.CurrentPrice.PriceEndDate;
          this.Price.ProductID = res.Product.ProductID;

          this.pricelist = res.PriceList;
          this.product_conlist = res.ProductContainers;


      }
    this.showBarcodeResult = false;
    this.showProductResult = true;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = false;})
  }

  SearchCategory(){
    return this.productService.getProductByCategory(this.categoryID).subscribe((res: any)=>{
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
        this.productList = res.Products;

        
      }
      this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = true;
    })
  }

  SearchContainer(){
    return this.productService.getContainerProducts(this.containerID).subscribe((res: any)=>{
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
        this.list = res.products;

        
      }
    this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = true;
    this.showAllProductsResults = false;})
  }

  SearchAllProducts(){
    return this.productService.getAllProducts().subscribe((res: any)=>{
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
        this.productList = res.Products;

        
      }
      this.showBarcodeResult = false;
    this.showProductResult = false;
    this.showCategoryResults = false;
    this.showContainerResults = false;
    this.showAllProductsResults = true;
    })
  
  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

  View(){
    this.router.navigate(['searched-product-details']);
  }

  showAdd(){
    this.showadd = true;
  }

  saveadd(){
    this.newPrice.ProductID = this.Product.ProductID;
    
    for(let item of this.pricelist){
      if(item.PriceStartDate == this.newPrice.PriceStartDate){
        this.found = true;
        
      }
    }
    if(this.found == false){
      this.productService.addPrice(this.newPrice)
      .subscribe((res: any) => {
        console.log(res);
        if(res.Message)
        {
        alert(res.Message)
      }
      });
    }
    if(this.found == true){
      alert("Duplicate Price Start Date Found")
    }


  }

  

  update(ndx: number){
    this.prodBarcode = this.productList[ndx].ProdBarcode;
    this.SearchBarcode();
  }

  Update(){
    
    return this.productService.updateProduct(this.Product).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      this.router.navigate(["product-management"])
      })

  }

  Delete(){
    return this.productService.deleteProduct(this.Product.ProductID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      this.router.navigate(["product-management"])
      })
  }

  move(ndx: number){
    this.conProduct = this.product_conlist[ndx];
    this.showProductResult = false;
    this.moveToContainer = true;
    
  }
 


  Link(){
    return this.productService.moveProduct(this.conProduct.ContainerID, this.conProduct.ProductID, this.quantity, this.containerID).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        alert(this.responseMessage)
        this.showProductResult = true;
        this.moveToContainer = false;}
        else if (res.Error){
          alert(res.Error);
        }
       
    })


  }
  
}
