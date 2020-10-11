import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Sale} from '../sale';
import {Payment} from '../payment';
import {PaymentType} from '../payment-type';
import {ProductSale} from '../product-sale';
import {SaleDetails} from '../sale-details';
import {SalesService} from '../sales.service';
import {SearchedSale} from '../searched-sale'
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs';

import { DialogService } from '../../shared/dialog.service';

@Component({
  selector: 'app-search-sale',
  templateUrl: './search-sale.component.html',
  styleUrls: ['./search-sale.component.scss']
})
export class SearchSaleComponent implements OnInit {

  constructor(private api: SalesService,private router: Router, private fb: FormBuilder,private dialogService: DialogService) { }
  searchSaleForm: FormGroup;
  dateVal: Date;
  date: Date;
  SaleDate: Date;
  SaleID: number;
  selectedProduct: ProductDetails = new ProductDetails();
  prodNotSelected = false;
  productsWithPrice : ProductDetails[] = [];

  saleDate: string;
 
  saleDetails: SaleDetails = new SaleDetails();
  saleProducts: ProductDetails[] = [];
  responseMessage: string = "Request Not Submitted";

  showTable: boolean = false;
  showList: boolean = false;
  selectDate: boolean = false;
  selectProduct: boolean = false;
  showSale: boolean =false;
  showcriteria:boolean = true;
  showProduct: boolean = false;
  showDate: boolean = false;
  showOptions: boolean = false;
  showBarcode: boolean = false;

  showListSearchByproduct: boolean = false;
  showListSearchByBarcode: boolean = false;
  showListAllSales: boolean = false;

  selectedSale: SearchedSale = new SearchedSale();
  searchedSales: Sale[] = [];
  sale: Sale = new Sale();
  saleList: Sale[] = [];
  session: any;
  
  viewSaleList: Sale[] = [];
  error: boolean = false;
  ngOnInit(): void {

    this.searchSaleForm= this.fb.group({ 
      ProdBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
      date: ['', [Validators.required]],
      prodSelection: ['', [Validators.required]],
    }); 

    this.session = {"token" : localStorage.getItem("accessToken")}
      this.api.initiateSale(this.session).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      this.dialogService.openAlertDialog(this.responseMessage)}
      else{
        this.productsWithPrice = res.products;
       
        }
 
      
      })
  }

  

  selectedDate(){
    this.selectDate = true;
    this.showcriteria = false;
    this.showDate = true;
    this.showOptions = true;
    this.showSale = false;
    this.showListAllSales = false;
    
  }

  productSelected(){
    this.selectProduct = true;
    this.showcriteria = false;
    this.showProduct = true;
    this.showOptions = true;
  }

  productBarcode(){
    this.showBarcode = true;
    this.showcriteria = false;
    this.showOptions = true;
  }

  searchAllSales(){

   return this.api.getAllSales().subscribe((res: any)=>{
     console.log(res);
     if(res.Message != null){
       this.responseMessage = res.Message;
       this.dialogService.openAlertDialog(this.responseMessage)}
       else{
         this.saleList = res.Sales;
       }
       this.showListAllSales = true;
   })
   
  }

  //viewSale(i: number)
  //{
    //this.SaleID = i;
  //  this. getViewSale();
  //}

  getViewSale(i: number){
    this.SaleID = i;
    return this.api.getSale(this.SaleID).subscribe((res: any)=>{
      console.log(res);
      if(res.Message != null){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)}
        else{
          this.viewSaleList = res.Sales;
          this.saleDate = res.saleDate;
            this.saleDetails = res.calculatedValues;
        }
      
    })
  }
 
  addProduct(val: ProductDetails){
    if(val == null){
      this.prodNotSelected= true
    }
    else{
      this.prodPush(val);
      this.prodNotSelected = false;
    }
   
  }

  prodPush(val: ProductDetails){
    this.selectedProduct = val;
    }

  search(){
    if (this.selectProduct == true){
      this.selectProduct;
      this.searchByProduct();
    }
    

    if(this.selectDate == true){
      this.selectDate;
      this.searchByDate();
      
    }
    this.showListSearchByproduct = true;
  }

  searchByProduct(){

    this.api.searchSalesByProduct(this.selectedProduct.ProductID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      this.dialogService.openAlertDialog(this.responseMessage)}
      else{
            this.searchedSales = res;
       
        }
        this.showListSearchByproduct = true
      
      })
  }

  searchByDate(){
    
    //this.SaleDate = new Date(this.date);
     if( this.date == undefined)
     {
          this.error = true;
     }
     else{
      this.error = false;
     
    this.api.searchSalesByDate(this.date).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      this.dialogService.openAlertDialog(this.responseMessage)}
      else{
            this.searchedSales = res;
       
        }
 
      this.showList = true;
      })
    }
  }

  searchByBarcode(){
     this.showListSearchByBarcode = true;
  }

  view(val: any){
    this.SaleID = val;
    this.getSale();
    
  }
  
  getSale(){

    this.api.getSale(this.SaleID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      this.dialogService.openAlertDialog(this.responseMessage)}
      else{
            this.saleProducts = res.saleProducts;
            this.saleDate = res.saleDate;
            this.saleDetails = res.calculatedValues;
       
        }
 
        
      })

      this.showSale = true;
      this.showList = false;
  }


  gotoSalesManagement()
  {
    this.router.navigate(["sales-management"])
  }

  showSearchedOrdersList(){
    this.showSale = false;
    this.showList = true;
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

  onHome() {
    this.router.navigate(['/home']);
  }

}
