import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import {ProductService} from '../product.service';
import {SalesService} from '../../sales-management/sales.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {User} from '../../user';
import {Container} from '../../container-management/container';
import {StockTakeProduct} from '../../product-management/stock-take-product';
import {StockTake} from '../stock-take';

@Component({
  selector: 'app-stock-take-form',
  templateUrl: './stock-take-form.component.html',
  styleUrls: ['./stock-take-form.component.scss']
})
export class StockTakeFormComponent implements OnInit {

  list: ProductDetails[] = [];
  containerID: number;
  user: User = new User();
  session:any;
  quantity: number = 0;
  Todaysdate: Date = new Date();
  showForm: boolean = false;
  showButton:boolean = true;

  SelectReason: number;
  container: Container;
  stocktake: StockTake = new StockTake();

  constructor(private productService: ProductService, private router: Router,private api: SalesService) { }

  ngOnInit(): void {

    if(!localStorage.getItem("accessToken")){
      this.router.navigate([""]);
    }
    else {
      this.session = {"token" : localStorage.getItem("accessToken")}

      this.api.getUserDetails(this.session).subscribe( (res:any) =>{
        console.log(res);
        this.user = res;
        this.containerID = res.ContainerID;

        this.productService.getContainerProducts(res.ContainerID).subscribe((res: any)=>{
          console.log(res);
          if(res.Message != null){ 
          alert(res.Message)}
          else{
            this.list = res.products;
            
          }
    
            })
          
        
      })
    }

      

   
  }

  generateForm(){
    this.productService.initateStockTake(this.session).subscribe((res: any)=>{
      console.log(res);
          if(res.Error != null){ 
          alert(res.Message)}
          else{
            this.stocktake = res.stock_Take;
            this.container = res.container;

            this.showButton = false;
            this.showForm = true;
            
          }
    })
  }

    
  save(ndx: number){
    this.productService.addStockTakeProduct(this.stocktake.StockTakeID, this.list[ndx].ProductID, this.list[ndx].Subtotal)
    .subscribe((res: any)=>{
      console.log(res);
    })

  }

      Cancel(){
        this.router.navigate(['stock-take']);
      }

      Complete(){

      }

}
