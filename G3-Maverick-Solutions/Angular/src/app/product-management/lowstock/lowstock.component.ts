import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {User} from 'src/app/user';
import { Router } from '@angular/router';
import {SalesService} from 'src/app/sales-management/sales.service';
import { DialogService } from '../../shared/dialog.service';


@Component({
  selector: 'app-lowstock',
  templateUrl: './lowstock.component.html',
  styleUrls: ['./lowstock.component.scss']
})
export class LowstockComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private saleService: SalesService,private dialogService: DialogService) { }

  list: ProductDetails[] = [];
  showNone: boolean = false;
  user: User = new User();
  session: any;

  ngOnInit(): void {
    if(!localStorage.getItem("accessToken")){
      this.router.navigate([""]);
    }
    else {
      this.session = {"token" : localStorage.getItem("accessToken")}

      this.saleService.getUserDetails(this.session).subscribe( (res:any) =>{
        console.log(res);
        this.user = res;

        this.productService.getLowStock(res.ContainerID).subscribe( (res:any) =>{
          console.log(res);
          if(res.products != null){
          this.list = res.products;}
          else{
            this.showNone = true;
          }
          
          
        })
        
      })
    }
  }
     

      Cancel(){
        this.router[('product-management')];

      }

      Backlog(ndx: number){
        
        return this.productService.addProductToBacklog(this.list[ndx].ProductID, this.user.ContainerID).subscribe((res:any)=>{
          console.log();
          if(res.Error){
            this.dialogService.openAlertDialog(res.Error);
          }
          if(res.Message){
            this.dialogService.openAlertDialog(res.Message);
          }
        })
      }


}
