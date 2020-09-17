import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {NgForm} from '@angular/forms';
import {CustomerOrderService} from '../customer-order-management/customer-order.service';
import {CustomerOrder} from '../customer-order-management/customer-order';
import {OrderDetails} from '../customer-order-management/order-details';
import {ProductDetails} from '../customer-order-management/product-details';
import {Customer} from '../customer-management/customer';
import {ProductCategory} from '../product-management/product-category';
import {ProductOrderLine} from '../customer-order-management/product-order-line';
import{map} from 'rxjs/operators';






@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  constructor(private api: CustomerOrderService, private router: Router) { }

  customerID:number = 2;
  userID: number = 1; //Should be changed;
  subtotal:number = 0;
  total: number = 0;
  quantity: number = 0;
  vatPerc: number = 0;
  responseMessage: string = "Request Not Submitted";

  showTable: boolean = false;
  name : string;
  surname : string;
 

  customer: Customer = new Customer();

  catSelection: number;
  prodSelection : number;

  
  customerOrder: CustomerOrder = new CustomerOrder();
  orderDetails: OrderDetails = new OrderDetails();
  productDetails: ProductDetails = new ProductDetails();
  prodOrder: ProductOrderLine = new ProductOrderLine();

  prodOrderLine : ProductOrderLine[] = [];
  productsWithPrice: ProductDetails[] = [];
  prodsForCategory: ProductDetails[] = [];
  orderProducts: ProductDetails[] = [];
  categoryList: ProductCategory[] = [];
  


 ngOnInit()
  {
    this.api.customerId$.subscribe( (customerID :any) => {
        console.log(customerID);
          if(customerID == null)
          {
            alert('Customer For Order Not Selected');
          }
          else 
          {
              this.customerID = customerID;
              
            }
          
        }
      ); 
  }


  getCustomer()
  {

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
      }
 
      
    })

      this.api.initiatePlaceOrder(this.customer.CustomerID).subscribe( (res:any)=> {
              console.log(res);
              if(res.Message != null){
                this.responseMessage = res.Message;
                alert(this.responseMessage)}
                else{
                //set customer details
                this.customer = res.customer;

                //set customer order details
                this.customerOrder.CustomerID = res.customer.CustomerID;
                this.customerOrder.UserID = this.userID;
                this.customerOrder.CusOrdDate = res.orderInfo.OrderDate;
                this.customerOrder.CusOrdNumber = res.orderInfo.OrderNo;

                //get vat percentage
                this.vatPerc = res.orderInfo.VatPerc.VATPerc;

                //set list of product categories
                this.categoryList = res.productCategories;

                //set List of product with prices
                this.productsWithPrice = res.products;
           
              }
                
              });

              this.orderDetails.TotalExcVat = 0;
              this.orderDetails.TotalIncVat = 0;
  }

  loadProducts(val: ProductCategory){
    for( var prod of this.productsWithPrice){
      if (prod.ProductCategoryID == val.ProductCategoryID){
            this.prodsForCategory.push(prod);
      }
    }

  }

  addProduct(val: ProductDetails){
    this.prodPush(val);
  }

  prodPush(val: ProductDetails){
    this.productDetails = val;
    }

listProducts(){
  this.productDetails.Quantity = this.quantity;
  this.productDetails.Subtotal = (this.quantity * this.productDetails.Price)
  this.orderProducts.push(this.productDetails);

  this.prodOrder.PLQuantity = this.quantity;
  this.prodOrder.ProductID = this.productDetails.ProductID;

  this.customerOrder.Product_OrderLine.push(this.prodOrder);

  this.total = this.total + this.productDetails.Subtotal;
 
  this.orderDetails.TotalIncVat = this.total;
  this.orderDetails.Vat  = ((this.vatPerc/(this.vatPerc + 100)) * this.total);
  this.orderDetails.TotalExcVat = this.total - this.orderDetails.Vat;

this.showTable = true;

}

remove(index: any){
  this.total = this.total - this.productDetails.Subtotal;
 
  this.orderDetails.TotalIncVat = this.total;
  this.orderDetails.Vat  = ((this.vatPerc/(this.vatPerc + 100)) * this.total);
  this.orderDetails.TotalExcVat = this.total - this.orderDetails.Vat;

  this.orderProducts.splice(index);
  this.customerOrder.Product_OrderLine.splice(index);
}


  placeOrder()
  {
    this.customerOrder.Product_OrderLine = this.prodOrderLine;
    
     this.api.placeOrder(this.customerOrder).subscribe( (res:any)=> {
       console.log(res);
       if(res.manager.Message){
       this.responseMessage = res.manager.Message;}
       alert(this.responseMessage)
       this.router.navigate(["customer-order-management"])
     })

  }
}
