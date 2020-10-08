import { Component, OnInit } from '@angular/core';
import {Container} from '../../container-management/container';
import {User} from '../../user';
import { Router } from '@angular/router'; 
import {ProductService} from '../product.service';
import {StockTakeProduct} from '../../product-management/stock-take-product';
import {StockTake} from '../stock-take';

import {LoginService} from 'src/app/login.service';

@Component({
  selector: 'app-search-stock-take',
  templateUrl: './search-stock-take.component.html',
  styleUrls: ['./search-stock-take.component.scss']
})
export class SearchStockTakeComponent implements OnInit {

  
  Todaysdate: Date = new Date();
  container: Container;
  containers: Container[] = [];
  list: StockTakeProduct[] = []; 
  stocktake: StockTake = new StockTake();
  stocktakes: StockTake[] =[];
  selectedStockTake: StockTake = new StockTake();
  index: number;
  selectedcontainerID: number;
  showContainer: boolean = false;
  showList:boolean = false;
  showError= false;
  showTable = false;
  employee: User = new User();
  SelectContainer = 0;
  stockdate: Date;

  constructor(private productService: ProductService, private router: Router, private api: LoginService) { }


  ngOnInit(): void {
  }

  getAll(){
    this.showContainer = false;
    this.productService.getAllStockTakes().subscribe((res: any) =>
    { console.log(res)
      if(res.Error){
        alert(res.Error)
      }
      else{
        this.stocktakes = res.stock_Takes;
        this.showList = true;

      }
    })

  }

  getComplete(){
    this.showContainer = false;
    this.productService.getCompletedStockTakes().subscribe((res: any) =>
    { console.log(res)
      if(res.Error){
        alert(res.Error)
      }
      else{
        this.stocktakes = res.stock_Takes;
        this.showList = true;

      }
    })

  }

  getIncomplete(){
    this.showContainer = false;
    this.productService.getIncompleteStockTakes().subscribe((res: any) =>
    { console.log(res)
      if(res.Error){
        alert(res.Error)
      }
      else{
        this.stocktakes = res.stock_Takes;
        this.showList = true;

      }
    })

  }

  getByContainer(){
    this.api.getAllContainers().subscribe((res:any) =>{
      console.log(res);
      this.containers = res; 
      if (res.Error){
        alert(res.Error);
      }
      
    });
    this.showContainer = true;
    this.showList = false;
  }

  selectContainer(val: Container){
    this.selectedcontainerID = val.ContainerID;
    this.showList = false;
    this.setContainer(val);

  }

  setContainer(val: Container){
    this.container = val;
    this.selectedcontainerID = val.ContainerID;
    this.showError = false;
  }

  searchByContainer(){
    if(this.container == null){
      this.showError = true;
    }
    this.productService.getContainerStockTakes(this.selectedcontainerID).subscribe((res: any) =>
    { console.log(res)
      if(res.Error){
        alert(res.Error)
      }
      else{
        this.stocktakes = res.stock_Takes;
        this.showList = true;

      }
    })
  }

  Cancel(){
    this.router.navigate(['stock-take']);
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

        this.showTable = true;
        this.showList = false;
      }
      
      this.selectedStockTake = this.stocktakes[ndx];
      
    })
  }
}
