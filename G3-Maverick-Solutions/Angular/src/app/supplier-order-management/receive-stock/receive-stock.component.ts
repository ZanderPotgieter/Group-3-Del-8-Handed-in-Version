import { Component, OnInit } from '@angular/core';
import {User} from '../../user';
import { Router } from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import {SupplierOrderProduct} from '../supplier-order-product';
import {SupplierOrderService} from '../supplier-order.service';
import {SupplierOrderStatus} from '../supplier-order-status';
import {Container} from '../../container-management/container';
import { DialogService } from '../../shared/dialog.service';
import {SalesService} from '../../sales-management/sales.service';

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
  showBackOrder = false;
  showDone = false;

  showdate = false;
  date: Date = new Date();
  selecteddate = this.date.toDateString();
  quantity:number;
  showList = false;
  selectedOrderID: number;
  selectedOrder: SupplierOrder = new SupplierOrder;
  supplierOrders: SupplierOrder[] = [];
  errorMessage: string;
  user: User;
  session: any;


  constructor(private api: SupplierOrderService,private saleService: SalesService, private router: Router, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.session = {"token" : localStorage.getItem("accessToken")}
    
    this.saleService.getUserDetails(this.session).subscribe( (res:any) =>{
      console.log(res);
      this.user = res;
    
      
      this.api.getPlacedSupplierOrdersInContainer(res.ContainerID).subscribe((res:any) =>{
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
    this.api.receiveOrderProduct(this.supplierOrder.SupplierOrderID, this.orderproducts[ndx].ProductID, this.quantity, this.supplierOrder.ContainerID)
    .subscribe((res: any)=>{
      console.log(res);
      if(res.Message){
        this.errorMessage = res.Message; 
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 5000);
      }else{
        this.errorMessage = "Failed To Save Quantity"; 
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
        }, 5000);
      }
      this.showBackOrder = true;
      this.showDone = true;
    })


  }

  Done(){
    this.api.updateCustomerOrder(this.supplierOrder.ContainerID, this.supplierOrder.SupplierOrderID).subscribe((resp:any)=>{
      console.log(resp);
    })


    this.dialogService.openAlertDialog("Stock Successfuly received")
    this.router.navigate(['supplier-order-management'])
      
  }

  BackOrder(){
    this.api.updateCustomerOrder(this.supplierOrder.ContainerID, this.supplierOrder.SupplierOrderID).subscribe((resp:any)=>{
      console.log(resp);
    })
    this.dialogService.openConfirmDialog('Back Order Email will be Sent to '+ this.selectedOrder.SupName + ' ?') 
    .afterClosed().subscribe(res => {
      if(res){
    this.api.sendBackOrderEmail(this.supplierOrder.SupplierOrderID).subscribe((re:any)=>{
      console.log(re);
      if(re.Message || re == true){
        
        this.router.navigate(['supplier-order-management'])
        this.dialogService.openAlertDialog("Supplier BackOrder Email successfuly Sent")
        this.showBackOrder = false;
        this.showDone = false;
      }
      if(re.Error){
        this.dialogService.openAlertDialog("Supplier Order Email sending failed")
      }
    
  })
    }})
    
  }

}
