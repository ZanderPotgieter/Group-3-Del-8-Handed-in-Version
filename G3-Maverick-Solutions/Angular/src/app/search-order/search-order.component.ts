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

  customer: Customer = new Customer();
  orderDetails: CustomerOrder = new CustomerOrder();
  calculatedValues: OrderDetails = new OrderDetails();
  orderProducts: ProductDetails[] = [];
  responseMessage: string = "Request Not Submitted";

  showTable: boolean = false;
  showList: boolean = false;
  selectOrderNo: boolean = false;
  selectCell: boolean = false;
  showOrder: boolean =false;
  showcriteria:boolean = true;
  showCell: boolean = false;
  showOrdNo: boolean = false;
  showOptions: boolean = false;
  customerorder : CustomerOrder = new CustomerOrder();

  selectedOrder: SearchedOrder = new SearchedOrder();
  searchedOrders: SearchedOrder[] = [];
 

  ngOnInit(): void {
    this.orderForm= this.fb.group({  
      ordNo: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]],  
      cell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],   
        
    }); 
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

  searchByOrderNo(){
    this.api.searchByOrderNo(this.orderNo).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
        this.customer = res.customerDetails;
        this.calculatedValues = res.calculatedValues;
        this.orderProducts = res.orderProducts;
        this.orderDetails.CusOrdDate = res.orderDetails.OrderDate;
        this.orderDetails.CusOrdNumber =res.orderDetails.OrderNo;
        this.orderDetails.CustomerOrderID = res.CustomerOrderID;
        }
      })

      
      this.showOrder = true;
    }

    searchByCell(){
      this.api.searchByCell(this.cell).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message != null){
        this.responseMessage = res.Message;
        alert(this.responseMessage)}
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
        this.responseMessage = res.Message;
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

        this.api.cancelOrder(this.selectedOrder.CustomerOrderID).subscribe( (res:any)=> {
          console.log(res);
          if(res.Message != null){
          this.responseMessage = res.Message;
          alert(this.responseMessage)}
      })
    }

    collectCustomerOrder(){
      this.dialogService.openConfirmDialog('Confirm collect?')
      .afterClosed().subscribe(res => {
        if(res){
      this.api.collectCustomerOrder(this.customerorder).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message){
          this.dialogService.openAlertDialog(res.Message);}
        //this.router.navigate(["customer-management"])
      })
    }
    });
    }
    
  gotoCustomerOrderManagement()
  {
    this.router.navigate(["customer-order-management"])
  }

}
