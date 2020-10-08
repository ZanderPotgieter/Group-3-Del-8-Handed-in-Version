import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {SupplierOrder} from '../supplier-order';
import { NgModule } from '@angular/core';
import {SupplierOrderService} from '../supplier-order.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Product } from '../product_backlog';

@Component({
  selector: 'app-place-supplier-order',
  templateUrl: './place-supplier-order.component.html',
  styleUrls: ['./place-supplier-order.component.scss']
})
export class PlaceSupplierOrderComponent implements OnInit {
  private _allProducts: Observable<Product[]>;  
  public get allProducts(): Observable<Product[]> {  
    return this._allProducts;  
  }
  public set allProducts(value: Observable<Product[]>) {  
    this._allProducts = value;  
  }  

  showBacklog = true;
  showOrders = false;
  showSupOrder = false;
  constructor(public product:SupplierOrderService,private router: Router) { }

  loadDisplay(){  
    debugger;  
    this.allProducts= this.product.getProducts();    
  }  

  addProduct(){
  
  }

  viewOrders(){
    this.showBacklog = false;
    this.showOrders = true;
    this.showSupOrder = false;
  }

  selectOrder(){
    this.showBacklog = false;
    this.showOrders = false;
    this.showSupOrder = true;
  }

  ngOnInit() {  
    this.loadDisplay();  

  }  

}
