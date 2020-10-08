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
import { DialogService } from '../../shared/dialog.service';

@Component({
  selector: 'app-make-sale',
  templateUrl: './make-sale.component.html',
  styleUrls: ['./make-sale.component.scss']
})
export class MakeSaleComponent implements OnInit {

  @Input() ConName: string;
  @Input() ContainerID: number;

  constructor(private api: SalesService, private router: Router, private fb: FormBuilder, private productService: ProductService, private dialogService: DialogService) { }
  searchForm: FormGroup;

 currentContainer: Container = new Container();

  userID: number = 1; //Should be changed;
  subtotal:number = 0;
  total: number = 0;
  quantity: number = 1;
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
  showChange: boolean = true;
  ShowOustanding: boolean = false;
 
  displayTotal  ="0";
  displaySubtotal ="0";
  displayVat = "0";

  TotalIncVat: number;
  TotalExcVat: number;
  Vat: number;
  amountpaid : number = 0;

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
  prodFound: boolean = false;
  lowStock: boolean = false;

  productID = 0;
  removeQuantity = 0;

  ngOnInit() {


    if(!localStorage.getItem("accessToken")){
      this.router.navigate([""]);
    }
    else {
      this.session = {"token" : localStorage.getItem("accessToken")}

      this.api.getUserDetails(this.session).subscribe( (res:any) =>{
        console.log(res);
        this.user = res;

        this.api.initiateSale(this.session)
        .subscribe((value:any) =>{
        console.log(value);
      
          this.productsWithPrice = value.products;
          this.sale = value.Sale;
          this.saleDate = value.Sale.SaleDate;
          this.paymentTypes = value.paymentTypes;
          this.vatPerc = value.VAT.VATPerc;
        
        
      });
        
      })

   
  }

  this.searchForm= this.fb.group({ 
    prodBarcode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('[0-9 ]*')]], 
  
  });
  
  


  }
  
  
  

  useBardode(){
    
    this.selectedProduct = new ProductDetails();
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
    this.prodBarcode = val.ProdBarcode;
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
            this.barcodeFound = true;
            if (this.selectedProduct.Quantity >= this.selectedProduct.CPQuantity){
              alert("Only " + this.selectedProduct.CPQuantity + " of " + this.selectedProduct.Prodname +" in stock");
            }
            else{
            this.quantity = this.selectedProduct.Quantity + 1;
            this.updateList();
          }
          }
          
        }

        if(this.barcodeFound == false){
          alert("Product Not In Stock");
        }

        this.barcodeFound = false;
        this.quantity = 1;
        

      }

      makePayment(){
        
        this.showBarcode = false;
        this.showName = false;
        if( this.amountpaid >= this.TotalIncVat){
          alert("Payment Resticted: R"+ this.amountpaid+ " already paid")
        }
        else{
        this.amountpaid = this.amountpaid + this.amount;

        if(this.TotalIncVat > this.amountpaid){
          this.outstandingAmt = this.total - this.amountpaid;
          this.total = this.outstandingAmt;
          this.change = 0;
          this.ShowOustanding = true;
        }
        else if(this.TotalIncVat == this.amountpaid){
          this.total = 0;
          this.change = 0;
          this.outstandingAmt = 0;
          this.ShowOustanding = false;
        }
        else if ( this.TotalIncVat < this.amountpaid){
          this.change = this.amountpaid - this.TotalIncVat
          this.total = 0;
          this.outstandingAmt = 0;
          this.ShowOustanding = false;
          
        }


        this.api.makeSalePayment(this.sale.SaleID, this.amount,this.selectedPayment.PaymentTypeID).subscribe((res:any) => {
          console.log(res);
          if(res.Error)(
            alert(res.Error)
          )
        })
      }
       
        
      }


    updateList(){
      for(let prod of this.saleProducts){
        if(prod.ProdBarcode == this.selectedProduct.ProdBarcode ){

          this.total = this.total-prod.Subtotal;
          
          prod.Quantity = this.quantity;
          prod.Subtotal = (this.quantity * prod.Price);
          
          this.total = this.total + prod.Subtotal;
        
          this.TotalIncVat = this.total;
          this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
          this.TotalExcVat = this.total - this.Vat;
         
        
          this.saleDetails.TotalIncVat = this.TotalIncVat;
          this.saleDetails.Vat  = this.Vat;
          this.saleDetails.TotalExcVat = this.TotalExcVat;
        
         this.displayTotal = this.TotalIncVat.toFixed(2);
         this.displayVat = this.Vat.toFixed(2);
         this.displaySubtotal = this.TotalExcVat.toFixed(2);

        this.api.addSaleProduct(this.selectedProduct.ProductID, this.sale.SaleID, 1).subscribe((res: any) =>{
          console.log(res);
          if (res.Error){
            alert(res.Error);
          }
          
        })
       
         
        
        this.showTable = true;
        this.showQuantity = false;
        this.prodFound = true;


      }
     
    }

    if(this.prodFound == false){
      this.listProducts();
    }

    this.prodFound = false
  }

      listProducts(){
       if(this.quantity == 0 || this.prodSelection == null){
        this.prodNotSelected = true;
          this.quantyNull = true;
        }
        else{
          this.prodNotSelected = false;
          this.quantyNull = false;
          if(this.quantity <= this.selectedProduct.CPQuantity)
          {
           
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
     
      
      this.showTable = true;
      this.showQuantity = false;

      this.api.addSaleProduct(this.selectedProduct.ProductID, this.sale.SaleID, this.quantity).subscribe((res: any) =>{
        console.log(res);
        if (res.Error){
          alert(res.Error);
        }
        
      })
      
          }else{
            alert("Only " + this.selectedProduct.CPQuantity + " of " + this.selectedProduct.Prodname +" in stock")
          }
      }
      
      }

      remove(index: any){
        
        this.productID = this.saleProducts[index].ProductID;
        this.removeQuantity = this.saleProducts[index].Quantity;


        if(this.saleProducts.length != 1){
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

       this.api.removeSaleProduct(this.productID, this.sale.SaleID, this.removeQuantity).subscribe((res: any) =>{
        console.log(res);
        if (res.Error){
          alert(res.Error);
        }
        
      })
      }
  else{
        this.total = 0;
        this.TotalExcVat = 0;
        this.TotalIncVat = 0;
        this.Vat = 0;


        this.saleProducts.splice(index,1);
        
      
        this.displayTotal = this.TotalIncVat.toFixed(2);
       this.displayVat = this.Vat.toFixed(2);
       this.displaySubtotal = this.TotalExcVat.toFixed(2);

       
       this.api.removeSaleProduct(this.productID, this.sale.SaleID, this.removeQuantity).subscribe((res: any) =>{
        console.log(res);
        if (res.Error){
          alert(res.Error);
        }
        
      })

       this.prodcuctsales.splice(index,1);
       this.prodcuctsales = [];
       this.saleProducts = [];
       this.selectedProduct = new ProductDetails();
       this.showTable = false;


       for(let item of this.productsWithPrice){
        item.Quantity = 0;
     }

    

      }

      }

      completeSale()
        {
          if ( this.outstandingAmt == 0){
            this.api.checkStock(this.sale.ContainerID).subscribe((res: any)=>{
              console.log(res);
              this.lowStock = res;
              if(res == true){
                this.dialogService.openAlertDialog("Sale Completed Successfully");
                this.dialogService.openAlertDialog("Some Products are now low in stock. Click OK to view");
                //alert("Sale Completed Successfully");
                //alert("Some Products are now low in stock. Click OK to view");
                this.router.navigate(['lowstock'])
              }
              if(res == false){
                this.dialogService.openAlertDialog("Sale Completed Successfully");
              //alert("Sale Completed Successfully");
              this.router.navigate(['sales-management']);
              }

            })
  
          }
          else{
            this.dialogService.openAlertDialog("Sale Incomplete R" + this.outstandingAmt+" Oustanding")
            //alert("Sale Incomplete R" + this.outstandingAmt+" Oustanding")
          }

        }


      onLogout() {
        localStorage.removeItem('token');
        this.router.navigate(['/user/login']);
      }
    
      onHome() {
        this.router.navigate(['/home']);
      }

      gotoSaleManagement(){
        this.api.cancelSale(this.sale.SaleID).subscribe((res: any)=> {
          console.log(res);
          if(res.Message){
            this.dialogService.openAlertDialog(res.Message);
            //alert(res.Message);
            this.router.navigate(['sales-management']);
            
          }
        } )
      }

     

}
