import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import {ProductService} from '../product.service';
import {SalesService} from '../../sales-management/sales.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {User} from '../../user';
import {Container} from '../../container-management/container';
import {StockTakeProduct} from '../../product-management/stock-take-product';
import {StockTake} from '../stock-take';
import { DialogService } from '../../shared/dialog.service';

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
  errorMessage: string;

  showError = false;
  SelectReason: number;
  container: Container;
  stocktake: StockTake = new StockTake();
  stocktakeID: number;

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
        this.containerID = res.ContainerID;

        this.productService.getContainerProducts(res.ContainerID).subscribe((res: any)=>{
          console.log(res);
          if(res.Message != null){ 
            this.dialogService.openAlertDialog(res.Message)}
          else{
            this.list = res.products;
            
          }
    
            })
          
        
      })
    }

      

   
  }

  generateForm(){
    if(!localStorage.getItem("accessToken")){
      this.router.navigate([""]);
    }
    else {
      this.session = {"token" : localStorage.getItem("accessToken")}

    this.productService.initateStockTake(this.session).subscribe((res: any)=>{
      console.log(res);
          if(res.Error){ 
            this.dialogService.openAlertDialog(res.Error)}
          else{
            this.stocktakeID = res.stock_TakeID;
            this.container = res.container;

            this.showButton = false;
            this.showForm = true;
            
          }
    })
  }
}

    
  save(ndx: number){
    this.productService.addStockTakeProduct(this.stocktakeID, this.list[ndx].ProductID, this.list[ndx].Subtotal)
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

      Cancel(){
        this.router.navigate(['stock-take']);
      }

      Complete(){
        this.dialogService.openAlertDialog("Stock Take Form Saved");
        this.router.navigate(['stock-take']);
      }

      

}
