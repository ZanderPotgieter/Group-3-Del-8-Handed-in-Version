import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import {ProductDetails} from 'src/app/customer-order-management/product-details';
import {User} from 'src/app/user';
import { Router } from '@angular/router';
import {SalesService} from 'src/app/sales-management/sales.service';

@Component({
  selector: 'app-lowstock',
  templateUrl: './lowstock.component.html',
  styleUrls: ['./lowstock.component.scss']
})
export class LowstockComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private saleService: SalesService) { }

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

      }

      BackLog(){
        
      }


}
