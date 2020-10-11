import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {FormBuilder, NgForm, Validators} from '@angular/forms';
import {CustomerOrderService} from '../customer-order-management/customer-order.service';
import {CustomerOrder} from '../customer-order-management/customer-order';
import {OrderDetails} from '../customer-order-management/order-details';
import {ProductDetails} from '../customer-order-management/product-details';
import {Customer} from '../customer-management/customer';
import {ProductOrderLine} from '../customer-order-management/product-order-line';
import {CustomerService} from '../customer-management/customer.service';
import{map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { User } from '../user';






@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {
  private _allCus: Observable<Customer[]>;  
  public get allCus(): Observable<Customer[]> {  
    return this._allCus;  
  }  
  public set allCus(value: Observable<Customer[]>) {  
    this._allCus = value;  
  }  

  constructor(private api: CustomerOrderService, private router: Router, private bf: FormBuilder) { }
  cusorderForm: FormGroup;

  loadDisplay(){  
    debugger;  
    this.allCus= this.api.getAllCustomers();  
  
  } 

  //customerID:number = 2;
  //userID: number = 1; //Should be changed;
  subtotal:number = 0;
  productID = 0;
  prodFound: boolean = false;
  total: number = 0;
  quantity: number = 0;
  vatPerc: number = 0;
  prodcuctorders: ProductOrderLine[] = [];
  responseMessage: string = "Request Not Submitted";
  showButton = false;
  showProd = false;
  showDetails = false;
  removeQuantity = 0;
  showCus = true;
  showInitiate = true;
  showQuantity:boolean = false;
  showTable: boolean = false;
  name : string;
  surname : string;
  showResults: boolean = false;

  displayTotal:string ="0";
  displaySubtotal:string="0";
  displayVat: string= "0";

  TotalIncVat: number;
  TotalExcVat: number;
  Vat: number;
 
  dateVal = new Date();
  customer: Customer = new Customer();
  email: string;

  catSelection: number;
  prodSelection : number = 0;

  prodNotSelected: boolean = false;
  quantyNull: boolean = false;
  customerNull: boolean = false;

  errorMessage: string;
  customerOrder: CustomerOrder = new CustomerOrder();
  orderDetails: OrderDetails = new OrderDetails();
  productDetails: ProductDetails = new ProductDetails();
  prodOrder: ProductOrderLine = new ProductOrderLine();

  prodOrderLine : ProductOrderLine[] = [];
  productsWithPrice: ProductDetails[] = [];
  prodsForCategory: ProductDetails[] = [];
  orderProducts: ProductDetails[] = [];
  user : User = new User();
  selectedProduct: ProductDetails = new ProductDetails();


  session : any;
  

CustomerID: number;

ngOnInit(): void {

  if(!localStorage.getItem("accessToken")){
    this.router.navigate([""]);
  }
  else {
    this.session = {"token" : localStorage.getItem("accessToken")}

    this.api.getUserDetails(this.session).subscribe( (res:any) =>{
      console.log(res);
      this.user = res;
     
    });
      
    }


  this.loadDisplay();   
  this.cusorderForm= this.bf.group({  
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]], 
    surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],     
  });    

}

  searchCustomer(){
    this.api.searchCustomer(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.customer.CustomerID = res.CustomerID;
          this.customer.CusName = res.CusName;
          this.customer.CusSurname = res.CusSurname;
          this.customer.CusCell = res.CusCell;
          this.customer.CusEmail = res.CusEmail;
          this.customer.CusStreetNr = res.CusStreetNr;
          this.customer.CusStreet = res.CusStreet;
          this.customer.CusCode = res.CusCode;
          this.customer.CusSuburb = res.CusSuburb;
      }
      
      this.showInitiate = false;
      this.showResults = true;
      
    })

  }

  sendOrderEmail(){
    this.api.sendOrderEmail(this.email).subscribe((res : any)=>{
      console.log(res);
      if(res.Error)
      {
        this.errorMessage = res.Error;
        alert(this.errorMessage);
       
      }
      else{
        alert(res.Message);
          }
    })
    }

  getCustomer()
  {
    if( this.name == null || this.surname==null){
      this.customerNull = true;
      this.showInitiate = true;
      this.showResults = false;
      this.showDetails = false;
    }
    else{
    this.api.searchCustomer(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.customer.CustomerID = res.CustomerID;
          this.customer.CusName = res.CusName;
          this.customer.CusSurname = res.CusSurname;
          this.customer.CusCell = res.CusCell;
          this.customer.CusEmail = res.CusEmail;
          

          this.CustomerID = res.CustomerID;
          this.showDetails = true;
          this.showInitiate = false;
          this.customerNull = false;
         this.initiatePlaceOrder(res.CustomerID)
      }
          

      
    })}

   

  }

  initiatePlaceOrder(ID: any){
   // this.CustomerID = parseInt(this.api.currentCustomerID.toString());

     this.api.initiatePlaceOrder(ID, this.session).subscribe( (res:any)=> {
              console.log(res);
              if(res.Message != null){
                this.responseMessage = res.Message;
                alert(this.responseMessage)}
                else{
                //set customer details
                this.customer = res.customer;

                //set customer order details
                this.customerOrder.CustomerOrderID = res.orderInfo.CustomerOrderID;
                this.customerOrder.CustomerID = res.customer.CustomerID;
                this.customerOrder.UserID = this.user.UserID;
                this.customerOrder.ContainerID = this.user.ContainerID;
                this.customerOrder.CusOrdDate = res.orderInfo.OrderDate;
                this.customerOrder.CusOrdNumber = res.orderInfo.OrderNo;

                //get vat percentage
                this.vatPerc = res.orderInfo.VatPerc.VATPerc;

                //set List of product with prices
                this.productsWithPrice = res.products.sort((a,b) => b-a);

           
              }
                
              });

              this.orderDetails.TotalExcVat = 0;
              this.orderDetails.TotalIncVat = 0;

              this.showProd = true;
              this.showCus = false;
  }


  addProduct(val: ProductDetails){
    if(val == null){
      this.prodNotSelected= true
    }
    this.prodNotSelected= false
    this.prodPush(val);
  }

  getProduct(){

    for(let prod of this.productsWithPrice ){
        this.selectedProduct = prod;
        this.quantity = this.selectedProduct.Quantity + 1;
        this.updateList();
      
      
    }
    }

    updateList(){
      for(let prod of this.orderProducts){
        

          this.total = this.total-prod.Subtotal;
          
          prod.Quantity = this.quantity;
          prod.Subtotal = (this.quantity * prod.Price);
          
          this.total = this.total + prod.Subtotal;
        
          this.TotalIncVat = this.total;
          this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
          this.TotalExcVat = this.total - this.Vat;
         
        
          this.orderDetails.TotalIncVat = this.TotalIncVat;
          this.orderDetails.Vat  = this.Vat;
          this.orderDetails.TotalExcVat = this.TotalExcVat;
        
         this.displayTotal = this.TotalIncVat.toFixed(2);
         this.displayVat = this.Vat.toFixed(2);
         this.displaySubtotal = this.TotalExcVat.toFixed(2);

        this.api.addCustomerOrderProduct(this.selectedProduct.ProductID, this.customerOrder.CustomerOrderID, 1).subscribe((res: any) =>{
          console.log(res);
          if (res.Error){
            alert(res.Error);
          }
          
        })
       
         
        
        this.showTable = true;
        this.showQuantity = false;
        this.prodFound = true;
    }

    if(this.prodFound == false){
      this.listProducts();
    }

    this.prodFound = false
  }

  prodPush(val: ProductDetails){
    this.selectedProduct = val;
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
       this.orderProducts.push(this.selectedProduct);
     
     
       this.total = this.total + this.selectedProduct.Subtotal;
     
       this.TotalIncVat = this.total;
       this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
       this.TotalExcVat = this.total - this.Vat;
      
     
       this.orderDetails.TotalIncVat = this.TotalIncVat;
       this.orderDetails.Vat  = this.Vat;
       this.orderDetails.TotalExcVat = this.TotalExcVat;
     
      this.displayTotal = this.TotalIncVat.toFixed(2);
      this.displayVat = this.Vat.toFixed(2);
      this.displaySubtotal = this.TotalExcVat.toFixed(2);
    
     
     this.showTable = true;
     this.showQuantity = false;

     this.api.addCustomerOrderProduct(this.selectedProduct.ProductID, this.customerOrder.CustomerOrderID, this.quantity).subscribe((res: any) =>{
       console.log(res);
       if (res.Error){
         alert(res.Error);
       }
       
     })
     
         }
     }
     
     }

     remove(index: any){
        
      this.productID = this.orderProducts[index].ProductID;
      this.removeQuantity = this.orderProducts[index].Quantity;


      if(this.orderProducts.length != 1){
      this.total = this.total - this.orderProducts[index].Subtotal;
      this.TotalIncVat = this.total;
      this.Vat = ((this.vatPerc/(this.vatPerc + 100)) * this.TotalIncVat);
      this.TotalExcVat = this.total - this.Vat;

      this.orderDetails.TotalIncVat = this.TotalIncVat;
      this.orderDetails.Vat  = this.Vat;
      this.orderDetails.TotalExcVat = this.TotalExcVat;
    
      this.orderProducts.splice(index,1);
      
    
      this.displayTotal = this.TotalIncVat.toFixed(2);
     this.displayVat = this.Vat.toFixed(2);
     this.displaySubtotal = this.TotalExcVat.toFixed(2);

     this.prodcuctorders.splice(index,1);

     this.api.removeCustomerOrderProduct(this.productID, this.customerOrder.CustomerOrderID, this.removeQuantity).subscribe((res: any) =>{
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


      this.orderProducts.splice(index,1);
      
    
      this.displayTotal = this.TotalIncVat.toFixed(2);
     this.displayVat = this.Vat.toFixed(2);
     this.displaySubtotal = this.TotalExcVat.toFixed(2);

     
     this.api.removeCustomerOrderProduct(this.productID, this.customerOrder.CustomerOrderID, this.removeQuantity).subscribe((res: any) =>{
      console.log(res);
      if (res.Error){
        alert(res.Error);
      }
      
    })

     this.prodcuctorders.splice(index,1);
     this.prodcuctorders = [];
     this.orderProducts = [];
     this.selectedProduct = new ProductDetails();
     this.showTable = false;


     for(let item of this.productsWithPrice){
      item.Quantity = 0;
   }

  

    }

    }


  placeOrder()
  {
    //this.customerOrder.Product_Order_Line = this.prodOrderLine;
    
     this.api.placeOrder(this.customerOrder).subscribe( (res:any)=> {
       console.log(res);
       if(res.Message){
       this.responseMessage = res.Message;}
       alert(this.responseMessage)
       this.router.navigate(["customer-order-management"])
     })

  }

  gotoCustomerOrderManagement()
  {
    this.api.cancelCustomerOrder(this.customerOrder.CustomerOrderID).subscribe((res: any)=> {
      console.log(res);
      if(res.Message){
        alert(res.Message);
    this.router.navigate(["customer-order-management"])
  }
} )
}


  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

  onHome() {
    this.router.navigate(['/home']);
  }
}