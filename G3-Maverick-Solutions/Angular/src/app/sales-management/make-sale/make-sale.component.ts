import { Component, OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import {Sale} from '../sale';
import {Payment} from '../payment';
import {PaymentType} from '../payment-type';
import {ProductSale} from '../product-sale';
import {SaleDetails} from '../sale-details';
import {SalesService} from '../sales.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {User} from 'src/app/user';
import { ProductService } from '../../product-management/product.service';
import  {Container} from  'src/app/container-management/container';

import { from } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
@Component({
  selector: 'app-make-sale',
  templateUrl: './make-sale.component.html',
  styleUrls: ['./make-sale.component.scss']
})
export class MakeSaleComponent implements OnInit {

  @Input() ConName: string;
  @Input() ContainerID: number;

  constructor(private api: SalesService, private router: Router, private fb: FormBuilder, private productService: ProductService) { }
  searchForm: FormGroup;

 currentContainer: Container = new Container();

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
  showPay: boolean = false;

  prodcuctsales: ProductSale[] = [];
  productsWithPrice: ProductDetails[] = [];
  saleProducts: ProductDetails[] = [];
  payments: Payment[] = [];
  paymentTypes: PaymentType[] =[];
  user : User = new User();

  session : any;
  paySelection = 0;
  prodSelection = 0;
  prodBarcode: string;
  showQuantity:boolean = false;
  showSearch:boolean = true;
  showBarcode: boolean = false;
  showName: boolean = false;
  barcodeFound: boolean = false;
  ngOnInit(): void {


    if(!localStorage.getItem("accessToken")){
      this.router.navigate([""]);
    }
    else {
      this.session = {"token" : localStorage.getItem("accessToken")}

      this.api.getUserDetails(this.session).subscribe( (res:any) =>{
        this.user = res;
      })

    this.api.initiateSale(this.session)
    .subscribe((value:any) =>{
    console.log(value);
  
      this.productsWithPrice = value.products;
      this.saleDate = value.SaleDate;
      this.paymentTypes = value.paymentTypes;
      this.vatPerc = value.VAT.VATPerc;
    
    
  });
   
  }

  this.searchForm= this.fb.group({ 
    prodBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
  
  }); 

  }

  useBardode(){

    this.showBarcode = true;
    this.showName = false;
  }
  useName(){

    this.showBarcode = false;
    this.showName = true;
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

    showPayment(){
      this.showPay = true;
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

      getProduct(){
        for(let prod of this.productsWithPrice ){
          if (prod.ProdBarcode == this.prodBarcode){
            this.selectedProduct = prod;
            this.showQuantity = true;
            this.barcodeFound = true;
          }
          
        }
        if(this.barcodeFound == false){
          alert("Product Not In Stock");
        }

        this.barcodeFound = false;

      }

      makePayment(){
        
        this.showBarcode = false;
        this.showName = false;

        if(this.total > this.amount){
          this.outstandingAmt = this.total - this.amount;
          this.total = this.outstandingAmt;
          this.change = 0;

          this.ShowOustanding = true;
        }
        else if(this.total == this.amount ){
          this.total = 0;
          this.change = 0;
          this.outstandingAmt = 0;
          this.showChange = true;
        }
        else if ( this.total < this.amount){
          this.change = this.amount - this.change
          this.total = 0;
          this.outstandingAmt = 0;
          this.showChange = true;
          
        }

        this.payment.PaymentTypeID = this.selectedPayment.PaymentTypeID;
        this.payment.PayAmount = this.amount;
        this.payment.PayDate = this.saleDate;
        this.payments.push(this.payment);
        //this.sale.Payments.push(this.payment);
        
      }
      

      makeSale(){
       this.sale.ContainerID = this.user.ContainerID;
        this.sale.Payments.push(...this.payments);
        this.sale.Product_Sale.push(...this.prodcuctsales);
        
       /* this.prodcuctsales.forEach(item => {
          this.sale.Product_Sale.push(item);
          
        });


        this.payments.forEach(item => {
          this.sale.Payments.push(item);
          
        });*/


        //this.sale.Product_Sale = this.prodcuctsales;
        //this.sale.Payments = this.payments;

        if ( this.total == 0){
          this.sale.UserID = this.user.UserID;
          this.api.makeSale(this.sale).subscribe((res:any) =>{
            if(res.Error){
              alert(res.Error);
            }
        if (res.Message != null){
          this.responseMessage = res.Message
          alert(this.responseMessage);
          this.router.navigate(['sales-management']);

      }
      })

        }
        else{
          alert("Make Payment for oustanding Amount")
        }
      }

      listProducts(){
       if(this.quantity == 0 || this.prodSelection == null){
        this.prodNotSelected = true;
          this.quantyNull = true;
        }
        else{
          this.prodNotSelected = false;
          this.quantyNull = false;
      
        this.selectedProduct.Quantity = this.quantity;
        this.selectedProduct.Subtotal = (this.quantity * this.selectedProduct.Price)
        this.saleProducts.push(this.selectedProduct);
      
      
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
     
      
      this.productSale.PSQuantity = this.quantity;
      this.productSale.ProductID = this.selectedProduct.ProductID;

      this.prodcuctsales.push(this.productSale);
      //this.sale.Product_Sale.push(this.productSale);
       
      
      this.showTable = true;
      this.showQuantity = false;
      

    }
      
      }

      remove(index: any){
        this.total = this.total - this.saleProducts[index].Subtotal;
        this.TotalIncVat = this.total;
        this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
        this.TotalExcVat = this.total - this.Vat;

        this.saleDetails.TotalIncVat = this.TotalIncVat;
        this.saleDetails.Vat  = this.Vat;
        this.saleDetails.TotalExcVat = this.TotalExcVat;
      
        this.saleProducts.splice(index,1);
        
      
        this.displayTotal = this.TotalIncVat.toFixed(2);
       this.displayVat = this.Vat.toFixed(2);
       this.displaySubtotal = this.TotalExcVat.toFixed(2);

       this.prodcuctsales.splice(index,1);
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
