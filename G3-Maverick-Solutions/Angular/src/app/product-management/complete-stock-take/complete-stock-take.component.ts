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

import { DialogService } from '../../shared/dialog.service';


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
  stocktakeID : number;

  showMarkOff: boolean = false;
  NoForm: boolean = true;
  response: string;
  showTable: boolean = false;
  showList: boolean = false;
  user: User = new User();
  employee: string;
  session: any;
  showSaveError: boolean = false;
  selectedProduct: StockTakeProduct = new StockTakeProduct();
  MOQuantity: number;
  MarkedOffProduct: MarkedOff = new MarkedOff();
  

  constructor(private productService: ProductService, private router: Router,private api: SalesService, private dialogService: DialogService) { }

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
         
              this.stocktakes = res.stock_Takes;
              this.showList = true;
            
         
        })
        
        
      })
      }

      if(this.stocktakes == null){
        this.dialogService.openAlertDialog("No Stock Take Forms Filled In Today")
      }
}

  Start(ndx: number){
    this.productService.getStockTake(this.stocktakes[ndx].StockTakeID).subscribe( (res:any) =>{
      console.log(res);
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error)
      }
      else{
        this.employee = res.employee;
        this.container = res.container;
        this.list = res.products;
        this.stocktake = res.stocktake;
        this.stocktakeID = res.stock_TakeID;

        this.showTable = true;
        this.showList = false;
      }
      
      
      
    })
    this.index = ndx;
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/CompleteStockTake.html")
  }

  Complete(){
    this.productService.completeStockTake( this.stocktakeID).subscribe((res:any)=>{
      if(res.Error){
        this.dialogService.openAlertDialog(res.Error);
      }
      else{
        this.dialogService.openAlertDialog(res.Message);
        this.router.navigate(['stock-take']);
      }
    })
    

  }
  

  markOff(ndx: number){
    if(this.list[ndx].CPQuantity >= this.list[ndx].STCount ){
      this.index = ndx;
      this.selectedProduct = this.list[ndx];
      this.MOQuantity = this.list[ndx].CPQuantity - this.list[ndx].STCount;
      this.MarkedOffProduct.ContainerID = this.container.ContainerID;
      this.MarkedOffProduct.MoQuantity = this.list[ndx].CPQuantity - this.list[ndx].STCount;
      this.MarkedOffProduct.MoDate = this.Todaysdate;
      this.MarkedOffProduct.ProductID = this.list[ndx].ProductID;
      this.MarkedOffProduct.StockTakeID = this.stocktakeID;
      this.MarkedOffProduct.UserID = this.user.UserID;
      this.list[this.index].MoQuantity = this.MOQuantity;
  
      this.showMarkOff = true;
      this.showSaveError = false;
    }
    else{
      this.dialogService.openAlertDialog("Cannot Mark Off if stock count is greater or equal to quantity")
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
    


  }

  Save(){
    
   

    this.productService.AddMarkedOff(this.MarkedOffProduct).subscribe((res:any)=>{
      console.log(res);
      if(res.Error){
          this.response = res.Error
          this.showSaveError = true;
      }
      else{
        this.response = res.Message;
        this.showSaveError = true;
        this.showMarkOff = false;
        this.list[this.index].MoQuantity = this.MOQuantity;

      }
    })
    
  }

      Cancel(){
        this.router.navigate(['stock-take']);
      }

}
