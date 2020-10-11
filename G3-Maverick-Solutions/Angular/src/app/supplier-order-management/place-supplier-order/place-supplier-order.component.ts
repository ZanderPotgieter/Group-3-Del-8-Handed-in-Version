import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import { NgModule } from '@angular/core';
import {SupplierOrderService} from '../supplier-order.service';
import {User} from '../../user';
import {SalesService} from '../../sales-management/sales.service';
import { DialogService } from '../../shared/dialog.service';
import {Product} from '../product_backlog';

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

  addProduct(){
  
  }

  viewOrders(){
    this.showBacklog = false;
    this.showOrders = true;
    this.showSupOrder = false;
    this.showButton = false;
  }

  selectOrder(){
    this.showBacklog = false;
    this.showOrders = false;
    this.showSupOrder = true;
    this.showButton = false;
  }

  

}
