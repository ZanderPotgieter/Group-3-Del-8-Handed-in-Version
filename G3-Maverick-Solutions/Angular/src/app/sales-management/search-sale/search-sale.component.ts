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

@Component({
  selector: 'app-search-sale',
  templateUrl: './search-sale.component.html',
  styleUrls: ['./search-sale.component.scss']
})
export class SearchSaleComponent implements OnInit {

  constructor(private api: SalesService,private router: Router) { }
  dateVal: Date;
  date:string;
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

  selectedSale: SearchedSale = new SearchedSale();
  searchedSales: Sale[] = [];
  sale: Sale = new Sale();

  ngOnInit(): void {
    this.api.initiateSale().subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
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
    
  }

  productSelected(){
    this.selectProduct = true;
    this.showcriteria = false;
    this.showProduct = true;
    this.showOptions = true;
  }

  addProduct(val: ProductDetails){
    if(val == null){
      this.prodNotSelected= true
    }
    this.prodPush(val);
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
  }

  searchByProduct(){

    this.api.searchSalesByProduct(this.selectedProduct.ProductID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
            this.searchedSales = res;
       
        }
 
      
      })
  }

  searchByDate(){
    
    this.SaleDate = new Date(this.date);
     
    this.api.searchSalesByDate(this.SaleDate).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
            this.searchedSales = res;
       
        }
 
      
      })
  }

  view(val: any){
    this.SaleID = val;
    this.getSale(val)
    
  }
  
  getSale(val: number){

    this.api.getSale(val).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
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
