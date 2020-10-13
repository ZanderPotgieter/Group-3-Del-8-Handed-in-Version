import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import { NgModule } from '@angular/core';
import {SupplierOrderService} from '../supplier-order.service';
import {User} from '../../user';
import {SalesService} from '../../sales-management/sales.service';
import { DialogService } from '../../shared/dialog.service';
import {Product} from '../product_backlog';
import {SupplierOrderProduct} from 'src/app/supplier-order-management/supplier-order-product';

@Component({
  selector: 'app-place-supplier-order',
  templateUrl: './place-supplier-order.component.html',
  styleUrls: ['./place-supplier-order.component.scss']
})
export class PlaceSupplierOrderComponent implements OnInit {
 
 

  constructor(public api :SupplierOrderService,private router: Router, private saleService: SalesService,private dialogService: DialogService) { }

  showButton = true;
  showBacklog = true;
  showOrders = false;
  showSupOrder = false;
  session: any;
  user: User = new User();
  products : Product[] = [];
  quantity: number;
  index: number;
  showError = false;
  errorMessage: string;
  supplierOrders: SupplierOrder[] = [];
  supplierOrder: SupplierOrder = new SupplierOrder();
  selectedOrder: SupplierOrder = new SupplierOrder();
  selectedOrderID: number;
  orderproducts: SupplierOrderProduct = new SupplierOrderProduct();

  ngOnInit() {   

  }  

  searchBacklog(){  
    this.showButton = false;
    
    this.session = {"token" : localStorage.getItem("accessToken")}

    this.saleService.getUserDetails(this.session).subscribe( (res:any) =>{
      console.log(res);
      this.user = res;

      this.api.getBacklogProducts(res.ContainerID).subscribe((res:any)=>{
        console.log(res);
        if(res.Error){
          this.dialogService.openAlertDialog(res.Error)
        }
        else{
          this.products = res.products;
          
        }
      })
      
    })
      
  }

  trackByndx(ndx: number, item:any): any{
    return ndx;
  }  

  addProduct(ndx: number){
    this.quantity = this.products[ndx].QuantityToOrder;
    this.api.addProductToOrder(this.user.ContainerID,this.products[ndx].SupplierID, this.products[ndx].ProductID, this.quantity).subscribe((res:any)=>
      {
        console.log(res)
        if (res.Error){
          this.dialogService.openAlertDialog(res.Error)
        }
        else{
          this.products.splice(ndx,1);
          this.errorMessage = this.products[ndx].ProdName + " added to order"; 
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 5000);
        }

      })

  
  }

  viewOrders(){

    this.api.getTodaysSupplierOrders(this.user.ContainerID).subscribe((res:any) =>
    {
      console.log(res)
        if (res.Error){
          this.dialogService.openAlertDialog(res.Error)
        }
        else{
          this.supplierOrders = res.supplierOrders;
        }

    })

    this.showBacklog = false;
    this.showOrders = true;
    this.showSupOrder = false;
    this.showButton = false;
  }

  View(ndx: number){
    this.index = ndx
    this.selectedOrder = this.supplierOrders[ndx];
      this.selectedOrderID = this.supplierOrders[ndx].SupplierOrderID
    this.api.getSupplierOrdersByID(this.supplierOrders[ndx].SupplierOrderID).subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrder = res.supplierOrder;
        this.orderproducts = res.products;

        this.showBacklog = false;
        this.showOrders = false;
        this.showSupOrder = true;
        this.showButton = false;
      }

    })
    
}

  selectOrder(){
    this.showBacklog = false;
    this.showOrders = false;
    this.showSupOrder = true;
    this.showButton = false;
  }

  Back()
  {
    this.showBacklog = false;
    this.showOrders = true;
    this.showSupOrder = false;
    this.showButton = false;
    
  }
  PlaceOrder(){
    this.dialogService.openConfirmDialog('Order Email will be Sent to '+ this.selectedOrder.SupName + ' ?') 
    .afterClosed().subscribe(res => {
      if(res){
    this.api.placeSupplierOrder(this.selectedOrderID).subscribe((res:any) =>{
      console.log(res);
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.dialogService.openAlertDialog(res.Message)
        this.showBacklog = false;
        this.showOrders = true;
        this.showSupOrder = false;
        this.showButton = false;
      }
    })}
      
  })

  }

  CancelOrder(){
    this.dialogService.openConfirmDialog('Are You Sure You Want to Cancel This Order?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.cancelSupplierOrder(this.selectedOrderID).subscribe((res:any) =>{
      console.log(res);
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.dialogService.openAlertDialog(res.Message)
        this.router.navigate(["search-supplier-order"])
      }
    })}
      
  })
}

Cancel(){
  this.router.navigate(["search-supplier-order"])
}

}
