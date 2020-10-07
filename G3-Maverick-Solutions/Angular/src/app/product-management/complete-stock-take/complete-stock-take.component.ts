import { Component, OnInit } from '@angular/core';
import {MarkedOffReason} from '../../product-management/marked-off-reason';
import {Container} from '../../container-management/container';
import {User} from '../../user';
import { Router } from '@angular/router'; 
import {ProductService} from '../product.service';
import {SalesService} from '../../sales-management/sales.service';
import {StockTakeProduct} from '../../product-management/stock-take-product';
import {StockTake} from '../stock-take';
import {MarkedOff} from '../marked-off';
import {formatDate} from '@angular/common';


@Component({
  selector: 'app-complete-stock-take',
  templateUrl: './complete-stock-take.component.html',
  styleUrls: ['./complete-stock-take.component.scss']
})
export class CompleteStockTakeComponent implements OnInit {

  SelectReason: number;
  reasons: MarkedOffReason[] = [];
  Todaysdate: Date = new Date();
  container: Container;
  list: StockTakeProduct[] = []; 
  stocktake: StockTake = new StockTake();
  stocktakes: StockTake[] =[];
  index: number;
  date = this.Todaysdate.toDateString();

  showMarkOff: boolean = false;
  NoForm: boolean = false;
  response: string;
  showTable: boolean = false;
  showList: boolean = true;
  user: User = new User();
  employee: string;
  session: any;
  showSaveError: boolean = false;
  selectedProduct: StockTakeProduct = new StockTakeProduct();
  MOQuantity: number;
  MarkedOffProduct: MarkedOff = new MarkedOff();
  

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

        this.productService.getTodaysStockTake(this.date, res.ContainerID).subscribe( (res:any) =>{
          console.log(res);
          if(res.Error){
            this.response = res.Error
            this.NoForm = true;
          }
          else if(res.Message){
            this.response = res.Message
            this.NoForm = true;
          }
          else{
          this.stocktakes = res.stock_Takes
          this.showList = true;
        }
        
        })
        
        
      })
    
  }
}

  Start(ndx: number){
    this.productService.getStockTake(this.stocktakes[ndx].StockTakeID).subscribe( (res:any) =>{
      console.log(res);
      if(res.Error){
        alert(res.Error)
      }
      else{
        this.employee = res.employee;
        this.container = res.container;
        this.list = res.products;
        this.stocktake = res.stocktake;

        this.showTable = true
      }
      
      
      
    })
  }

  Complete(){
    this.productService.completeStockTake(this.stocktake.StockTakeID).subscribe((res:any)=>{
      if(res.Error){
        alert(res.Error);
      }
      else{
        alert(res.Message);
        this.router.navigate(['stock-take']);
      }
    })
    

  }
  

  markOff(ndx: number){
    if(this.list[ndx].CPQuantity >= this.list[ndx].STCount ){
      this.index = ndx;
      this.selectedProduct = this.list[ndx];
      this.MOQuantity = this.list[ndx].CPQuantity - this.list[ndx].STCount;
  
      this.showMarkOff = true;
      this.showSaveError = false;
    }
    else{
      alert("No Products To Mark Of. Stock Count Is Equal to Quantity")
    }

    this.productService.getAllMarkedOffReasons().subscribe((res:any) =>
    {  console.log(res);
      if(res.Message){
          this.response = res.Error
            this.NoForm = true;
      }
      else{
        this.reasons =res.Reasons;
      }

    })
   

  }

  selectReason(val: MarkedOffReason){
    this.setReason(val);

  }

  setReason(val: MarkedOffReason){
    this.MarkedOffProduct.ReasonID = val.ReasonID;
    this.MarkedOffProduct.ContainerID = this.container.ContainerID;
    this.MarkedOffProduct.MoQuantity = this.MOQuantity;
    this.MarkedOffProduct.MoDate = this.Todaysdate;
    this.MarkedOffProduct.ProductID = this.list[this.index].ProductID;
    this.MarkedOffProduct.StockTakeID = this.stocktake.StockTakeID;
    this.MarkedOffProduct.UserID = this.user.UserID;

  }

  Save(){
    this.productService.AddMarkedOff(this.MarkedOffProduct).subscribe((res:any)=>{
      console.log(res);
      if(res.Message){
          this.response = res.Error
          this.showSaveError = true;
      }
      else{
        this.reasons =res.Reasons;
        this.showMarkOff = false;
        this.list[this.index].MoQuantity = this.MOQuantity;

      }
    })
    
  }

      Cancel(){
        this.router.navigate(['stock-take']);
      }

}
