import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import {SupplierOrderProduct} from '../supplier-order-product';
import {SupplierOrderService} from '../supplier-order.service';
import {SupplierOrderStatus} from '../supplier-order-status';
import {Container} from '../../container-management/container';
import { DialogService } from '../../shared/dialog.service';

@Component({
  selector: 'app-receive-stock',
  templateUrl: './receive-stock.component.html',
  styleUrls: ['./receive-stock.component.scss']
})
export class ReceiveStockComponent implements OnInit {

  showError = false
  index: number;

  showOrder = false;
  supplierOrder: SupplierOrder = new SupplierOrder();
  orderproducts: SupplierOrderProduct[] = [];

  showdate = false;
  date: Date = new Date();
  selecteddate = this.date.toDateString();
  quantity:number;
  showList = false;
  selectedOrderID: number;
  selectedOrder: SupplierOrder = new SupplierOrder;
  supplierOrders: SupplierOrder[] = [];
  errorMessage: string;



  constructor(private api: SupplierOrderService, private router: Router, private dialogService: DialogService) { }

  ngOnInit(): void {
    
      
      this.api.getSupplierOrdersByStatus(1).subscribe((res:any) =>{
        console.log(res)
        if(res.Error){
          this.dialogService.openAlertDialog(res.Error)
        }
        else{
          this.supplierOrders = res.supplierOrders;
  
          this.showList = true;
          this.showOrder = false;
        }
  
      })
    
  }

  View(ndx: number){
    this.index = ndx
    this.selectedOrder = this.supplierOrders[ndx];
    this.selectedOrderID = this.supplierOrders[ndx].SupplierOrderID;
    this.api.getSupplierOrdersByID(this.supplierOrders[ndx].SupplierOrderID).subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrder = res.supplierOrder;
        this.orderproducts = res.products;

        this.showList = false;
        this.showOrder = true;
      }

    })
    
}
Back()
{
        this.showList = true;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
  
}

  trackByndx(ndx: number, item:any): any{
    return ndx;
  }

  save(ndx: number){
    this.quantity = this.orderproducts[ndx].SOPQuantityRecieved;
    this.api.receiveOrderProduct(this.supplierOrder.SupplierOrderID, this.orderproducts[ndx].ProductID, this.quantity)
    .subscribe((res: any)=>{
      console.log(res);
      if(res.Message){
        this.errorMessage = res.Message; 
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 5000);
      }

    })
  }

  Done(){
      this.router[('supplier-order-management')]
  }

}
