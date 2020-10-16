import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import { FormGroup, FormControl} from '@angular/forms';
import { NgModule } from '@angular/core';
import {NgForm} from '@angular/forms';
import {CustomerOrderService} from '../customer-order-management/customer-order.service';
import {CustomerOrder} from '../customer-order-management/customer-order';
import {OrderDetails} from '../customer-order-management/order-details';
import {ProductDetails} from '../customer-order-management/product-details';
import {Customer} from '../customer-management/customer';
import{SearchedOrder} from '../customer-order-management/searched-order';
import {ProductOrderLine} from '../customer-order-management/product-order-line';
import{map} from 'rxjs/operators';
import { DialogService } from '../shared/dialog.service';
import { Payment } from '../sales-management/payment';
import { PaymentType } from '../sales-management/payment-type';

@Component({
  selector: 'app-search-order',
  templateUrl: './search-order.component.html',
  styleUrls: ['./search-order.component.scss']
})
export class SearchOrderComponent implements OnInit {

  constructor(private api: CustomerOrderService, private dialogService: DialogService,private router: Router, private fb: FormBuilder) { }

  orderForm: FormGroup;
  

  cell:string;
  orderNo: string;
  showName: boolean = false;
  errorMessage: string;
  customer: Customer = new Customer();
  orderDetails: CustomerOrder = new CustomerOrder();
  calculatedValues: OrderDetails = new OrderDetails();
  orderProducts: ProductDetails[] = [];
  responseMessage: string = "Request Not Submitted";
  showChange: boolean = true;
  showTable: boolean = false;
  showList: boolean = false;
  selectOrderNo: boolean = false;
  selectCell: boolean = false;
  showOrder: boolean =false;
  showFulfilled: boolean =false;
  showcriteria:boolean = true;
  showCell: boolean = false;
  showOrdNo: boolean = false;
  showOptions: boolean = false;
  customerorder : CustomerOrder = new CustomerOrder();
  hidebutton = "disabled";
  paySelection = 0;
  prodSelection = 0;
  amountpaid : number = 0;
  amount = 0;
  subtotal:number = 0;
  total: number = 0;
  quantity: number = 1;
  vatPerc: number = 15;
  change = 0;
  outstandingAmt = 0;

  selectedOrder: SearchedOrder = new SearchedOrder();
  searchedOrders: SearchedOrder[] = [];
  payments: PaymentType[] = [];
  paymentTypes: PaymentType[] =[];
  showPay: boolean = false;
  selectedPayment: PaymentType = new PaymentType();
  paymentNotSelected= false;
  ShowOustanding: boolean = false;
 

  ngOnInit(): void {
    this.orderForm= this.fb.group({  
      ordNo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]],  
      cell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
        
    }); 

    this.api.getAllPaymentTypes()
    .subscribe(value => {
      if (value != null) {
        this.paymentTypes = value;
      }
    });
  }

  showPayment(){
    this.showPay = true;
  }

  loadPayment(val: PaymentType){
   
    this.addPayment(val);
  }

  addPayment(val : PaymentType){
    this.selectedPayment = val;
  }

  paymentPush(val: PaymentType){
    this.selectedPayment = val;
  
    }


  selectedOrderNo(){
    this.selectOrderNo = true;
    this.showcriteria = false;
    this.showOrdNo = true;
    this.showOptions = true;
    
  }

  selectedCell(){
    this.selectCell = true;
    this.showcriteria = false;
    this.showCell = true;
    this.showOptions = true;
  }

  search(){
    if (this.selectCell == true){
      this.selectCell;
      this.searchByCell();
    }
    

    if(this.selectOrderNo == true){
      this.selectOrderNo;
      this.searchByOrderNo();
      
    }
  }

  view(val: any){
    this.orderNo = val;
    this.searchByOrderNo();
  }

  makePayment(){
        

        this.showName = false;
        if( this.amountpaid >= this.calculatedValues.TotalIncVat){
          this.dialogService.openAlertDialog("Payment Resticted: R"+ this.amountpaid+ " already paid")
        }
        else{
        this.amountpaid = this.amountpaid + this.amount;

    if(this.calculatedValues.TotalIncVat > this.amountpaid){
      this.outstandingAmt = this.calculatedValues.TotalIncVat - this.amountpaid;
      this.total = this.outstandingAmt;
      this.change = 0;
      this.ShowOustanding = true;
    }
    else if(this.calculatedValues.TotalIncVat == this.amountpaid){
      this.total = 0;
      this.change = 0;
      this.outstandingAmt = 0;
      this.ShowOustanding = false;
    }
    else if ( this.calculatedValues.TotalIncVat < this.amountpaid){
      this.change = this.amountpaid - this.calculatedValues.TotalIncVat
      this.total = 0;
      this.outstandingAmt = 0;
      this.ShowOustanding = false;
      
    }


    this.api.makeOrderPayment(this.orderDetails.CustomerOrderID, this.amount,this.selectedPayment.PaymentTypeID).subscribe((res:any) => {
      console.log(res);
      this.dialogService.openAlertDialog("Payment Successful.");
      if(res.Error)(
        this.dialogService.openAlertDialog(res.Error)
      )
    })
  }}
   

  searchByOrderNo(){
    this.api.searchByOrderNo(this.orderNo).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      }
      else{
        this.customer = res.customerDetails;
        this.calculatedValues = res.calculatedValues;
        this.orderProducts = res.orderProducts;
        this.orderDetails.CusOrdDate = res.orderDetails.OrderDate;
        this.orderDetails.CusOrdNumber =res.orderDetails.OrderNo;
        this.orderDetails.CustomerOrderID = res.orderDetails.CustomerOrderID;
        }
      })

      
      this.showOrder = true;
      this.showList = false;
    }

    searchByCell(){
      this.api.searchByCell(this.cell).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message != null){
          this.dialogService.openAlertDialog(res.Message);
        }
        else
        {
          this.searchedOrders = res;
        }
        })
        this.showList = true;
      }

    searchAll(){
      this.api.searchAll().subscribe( (res:any)=> {
        console.log(res);
        if(res.Message != null){
          this.dialogService.openAlertDialog(res.Message);
        }
        else
        {
          this.searchedOrders = res;
        }
        })
        this.showList = true;
    }  

    searchAllFulfilled(){
      this.api.searchAllFulfilled().subscribe( (res:any)=> {
        console.log(res);
        if(res.Message != null){
          this.dialogService.openAlertDialog(res.Message);
        alert(this.responseMessage)}
        else
        {
          this.searchedOrders = res;
        }
        })
        this.showList = true;
    }  


    selectOrder(val : SearchedOrder){
        this.selectedOrder = val;
        this.orderNo = this.selectedOrder.CusOrdNumber;
    }
    
    cancelOrder(){
      this.dialogService.openConfirmDialog('Are you sure you want to cancel this order?')
      .afterClosed().subscribe(res => {
        if(res){
          this.api.cancelCusOrder(this.orderDetails).subscribe( (res:any)=> {
            console.log(res);
            if(res.Message)
            {
              this.dialogService.openAlertDialog(res.Message);
            }
            this.router.navigate(["customer-order-management"])
          })
        }
      })
  
    }

    collectOrder(){
      this.dialogService.openConfirmDialog('Confirm collection of order?')
      .afterClosed().subscribe(res => {
        if(res){
          this.api.collectCusOrder(this.orderDetails).subscribe( (res:any)=> {
            console.log(res);
            if(res.Message)
            {
              this.dialogService.openAlertDialog(res.Message);
            }
            //this.router.navigate(["customer-order-management"])
          })
        }
      })
  
    }


    sendNotification(){
      this.dialogService.openConfirmDialog('Send email to ' + this.customer.CusName + ' ' +this.customer.CusSurname + '?')
    .afterClosed().subscribe(res => {
      if(res){
      this.api.sendNotification(this.customer.CusEmail, this.orderDetails.CusOrdNumber).subscribe((res : any)=>{
        console.log(res);
        if(res.Error)
        {
          this.errorMessage = res.Error;
          this.dialogService.openAlertDialog(this.errorMessage);
        }
        else{
          this.dialogService.openAlertDialog(res.Message);
         }
      })
      }
    });
  }
    
  gotoCustomerOrderManagement()
  {
    this.router.navigate(["customer-order-management"])
  }

}
