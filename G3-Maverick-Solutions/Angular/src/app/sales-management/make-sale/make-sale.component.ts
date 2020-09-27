import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Sale} from '../sale';
import {Payment} from '../payment';
import {PaymentType} from '../payment-type';
import {ProductSale} from '../product-sale';
import {SaleDetails} from '../sale-details';
import {SalesService} from '../sales.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';

import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-make-sale',
  templateUrl: './make-sale.component.html',
  styleUrls: ['./make-sale.component.scss']
})
export class MakeSaleComponent implements OnInit {

  constructor(private api: SalesService, private router: Router) { }

  userID: number = 1; //Should be changed;
  subtotal:number = 0;
  total: number = 0;
  quantity: number = 0;
  vatPerc: number = 15;
  amount = 0;
  change = 0;
  outstandingAmt = 0;
  responseMessage: string = "Request Not Submitted";
  dateVal: Date;

  showProd = true;
  prodNotSelected: boolean = false;
  paymentNotSelected= false;
  quantyNull: boolean = true;
  showTable: boolean = true;
  showChange: boolean = false;
  ShowOustanding: boolean = true;
 
  displayTotal  ="0";
  displaySubtotal ="0";
  displayVat = "0";

  TotalIncVat: number;
  TotalExcVat: number;
  Vat: number;

  paymentID = 0;
  saleDate: Date;

  sale: Sale = new Sale();
  saleDetails: SaleDetails = new SaleDetails()
  payment: Payment = new Payment();
  selectedProduct: ProductDetails = new ProductDetails();
  selectedPayment: PaymentType = new PaymentType();;
  productSale: ProductSale = new ProductSale();

  prodcuctsales: ProductSale[] = [];
  productsWithPrice: ProductDetails[] = [];
  saleProducts: ProductDetails[] = [];
  payments: Payment[] = [];
  paymentTypes: PaymentType[] =[];

  
  paySelection = 0;
  prodSelection = 0;


  ngOnInit(): void {
    this.api.initiateSale()
    .subscribe((value:any) =>{
      if (value != null){
        this.productsWithPrice = value.products;
        this.saleDate = value.SaleDate;
        this.paymentTypes = value.paymentTypes;

      }
    })

    
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

    addPayment(val: PaymentType){
      if(val == null){
        this.paymentNotSelected= true
      }
      this.paymentPush(val);
    }
  
    paymentPush(val: PaymentType){
      this.selectedPayment = val;
    
      }

      makePayment(){
        this.payment.PaymentTypeID = this.selectedPayment.PaymentTypeID;
        this.payment.PayAmount = this.amount;
        this.payment.PayDate = this.saleDate;
        this.sale.Payments.push(this.payment);

        if(this.total > this.amount){
          this.outstandingAmt = this.total - this.amount;
          this.total = this.outstandingAmt;

          this.ShowOustanding = true;
        }
        else if(this.total == this.amount ){
          this.total = 0;
          this.change = 0;
          this.showChange = true;
        }
        else if ( this.total < this.amount){
          this.change = this.amount - this.change
          this.total = 0;
          this.showChange = true;
          
        }
        
      }

      makeSale(){
        if ( this.total == 0){
          this.api.makeSale(this.sale).subscribe((res:any) =>{
        if (res.Message != null){
          this.responseMessage = res.Message
          alert(this.responseMessage)

      }
      })

        }
        else{
          alert("Make Payment for oustanding Amount")
        }
      }

      listProducts(){
        if(this.prodSelection == 0){
          this.prodNotSelected= true
         }
        else if(this.quantity == 0){
        
          this.quantyNull = true;
        }
        else{
          this.quantyNull = false;
      
        this.selectedProduct.Quantity = this.quantity;
        this.selectedProduct.Subtotal = (this.quantity * this.selectedProduct.Price)
        this.saleProducts.push(this.selectedProduct);
      
        this.productSale.PSQuantity = this.quantity;
        this.productSale.ProductID = this.selectedProduct.ProductID;
      
        this.sale.Product_Sale.push(this.productSale);
      
        this.total = this.total + this.selectedProduct.Subtotal;
      
        this.TotalIncVat = this.total;
        this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
        this.TotalExcVat = this.total - this.Vat;
       
      
        this.saleDetails.TotalIncVat = this.TotalIncVat;
        this.saleDetails.Vat  = this.Vat;
        this.saleDetails.TotalExcVat = this.TotalExcVat;
      
       this.displayTotal = this.TotalIncVat.toFixed(2);
       this.displayVat = this.Vat.toFixed(2);
       this.displaySubtotal = this.TotalExcVat.toFixed(2);
      
      
        
      
      this.showTable = true;}
      
      }

      remove(index: any){
        this.total = this.total - this.selectedProduct.Subtotal;
        this.TotalIncVat = this.total;
        this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
        this.TotalExcVat = this.total - this.Vat;

        this.saleDetails.TotalIncVat = this.TotalIncVat;
        this.saleDetails.Vat  = this.Vat;
        this.saleDetails.TotalExcVat = this.TotalExcVat;
      
        this.saleProducts.splice(index,1);
        this.sale.Product_Sale.splice(index,1);
      
        this.displayTotal = this.TotalIncVat.toFixed(2);
       this.displayVat = this.Vat.toFixed(2);
       this.displaySubtotal = this.TotalExcVat.toFixed(2);
      }

      onLogout() {
        localStorage.removeItem('token');
        this.router.navigate(['/user/login']);
      }
    
      onHome() {
        this.router.navigate(['/home']);
      }

      gotoSaleManagement(){
        this.router.navigate(['sales-management']);
      }

}
