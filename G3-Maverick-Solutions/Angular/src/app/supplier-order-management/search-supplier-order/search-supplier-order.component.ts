import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import {SupplierOrderProduct} from '../supplier-order-product';
import {SupplierOrderService} from '../supplier-order.service';
import {SupplierOrderStatus} from '../supplier-order-status';
import {Container} from '../../container-management/container';
import { DialogService } from '../../shared/dialog.service';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-search-supplier-order',
  templateUrl: './search-supplier-order.component.html',
  styleUrls: ['./search-supplier-order.component.scss']
})
export class SearchSupplierOrderComponent implements OnInit {
  showError = false
  index: number;

  showOrder = false;
  supplierOrder: SupplierOrder = new SupplierOrder();
  orderproducts: SupplierOrderProduct[] = [];

  showdate = false;
  date: Date = new Date();
  selecteddate = this.date.toDateString();

  showList = false;
  selectedOrderID: number;
  selectedOrder: SupplierOrder = new SupplierOrder;
  supplierOrders: SupplierOrder[] = [];

  showStatuses = false;
  SelectStatus = 0
  selectedStatusID: number;
  selectedStatus: SupplierOrderStatus = new SupplierOrderStatus();
  statuses: SupplierOrderStatus[] = [];

  showContainer = false;
  SelectContainer = 0;
  selectedContainerID: number;
  selectedContainer: Container;
  containers: Container[] = [];

  constructor(private api: SupplierOrderService, private router: Router, private dialogService: DialogService) { }

  ngOnInit(): void {

  }

  getAll(){
    this.api.getAllSupplierOrders().subscribe((res:any) =>{
      console.log(res);
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrders = res.supplierOrders;
        this.showContainer = false;
        this.showStatuses = false;
        this.showList = true;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
      }
    })
  }

  getContainers(){
    this.api.getAllContainers().subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Message)
      }
      else{
        this.containers = res;

        this.showContainer = true;
        this.showStatuses = false;
        this.showList = true;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
      }

    })
  }

  getOrderStatuses(){
    this.api.getSupplierOrderStatuses().subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.statuses = res.Statuses

        this.showContainer = false;
        this.showStatuses = true;
        this.showList = false;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
      }

    })
  }

  showDate(){
    
    this.showContainer = false;
    this.showStatuses = false;
    this.showList = false;
    this.showdate = true;
    this.showOrder = false;
    this.showError = false;

  }

  selectContainer(val: Container){
    this.setContainer(val);
  }
  
  setContainer(val: Container){
    this.selectedContainer = val;
    this.selectedContainerID = val.ContainerID;
  }


  selectStatus(val: SupplierOrderStatus){
    this.setStatus(val);
  }

  setStatus(val: SupplierOrderStatus){
      this.selectedStatus = val;
      this.selectedStatusID = val.SupplierOrderStatusID;
  }

  searchByContainer(){
    if( this.selectedContainer == null){
      this.showError = true;
    }
    else{
    this.api.getSupplierOrdersByContainer(this.selectedContainerID).subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrders = res.supplierOrders;

        this.showContainer = false;
        this.showStatuses = false;
        this.showList = true;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
      }

    })}

  }


  searchByStatus(){
    if( this.selectedStatus == null){
      this.showError = true;
    }
    else{
    this.api.getSupplierOrdersByStatus(this.selectedStatusID).subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrders = res.supplierOrders;

        this.showList = true;
        this.showdate = false;
      }

    })}
  }

  searchByDate(){
    if( this.date == null){
      this.showError = true;
    }
    else{
    this.api.getSupplierOrdersByDate(this.selecteddate).subscribe((res:any) =>{
      console.log(res)
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.supplierOrders = res.supplierOrders;

        this.showContainer = false;
        this.showStatuses = false;
        this.showList = true;
        this.showdate = false;
        this.showOrder = false;
        this.showError = false;
      }

    })}
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
  
          this.showContainer = false;
          this.showStatuses = false;
          this.showList = false;
          this.showOrder = true;
          this.showError = false;
        }
  
      })
      
  }

  CancelOrder()
  {
    this.dialogService.openConfirmDialog('Are You Want To Cancel The Order?')
    .afterClosed().subscribe(res => {
      if(res){
      this.api.cancelSupplierOrder(this.supplierOrders[this.index].SupplierOrderID).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message){
      this.dialogService.openAlertDialog(res.Message);}
        this.router.navigate(["supplier-order-management"])
      })
    }
    });
    
  }

  Back()
  {
        this.showContainer = false;
          this.showStatuses = false;
          this.showList = true;
          this.showdate = false;
          this.showOrder = false;
          this.showError = false;
    
  }

 
  
  Cancel(){
    
        this.router.navigate(["supplier-order-management"])
   
}


}
