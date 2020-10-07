import { Component, OnInit } from '@angular/core';
import {Container} from '../../container-management/container';
import {User} from '../../user';
import { Router } from '@angular/router'; 
import {ProductService} from '../product.service';
import {SalesService} from '../../sales-management/sales.service';
import {StockTakeProduct} from '../../product-management/stock-take-product';
import {StockTake} from '../stock-take';

@Component({
  selector: 'app-search-stock-take',
  templateUrl: './search-stock-take.component.html',
  styleUrls: ['./search-stock-take.component.scss']
})
export class SearchStockTakeComponent implements OnInit {

  
  Todaysdate: Date = new Date();
  container: Container;
  list: StockTakeProduct[] = []; 
  stocktake: StockTake = new StockTake();
  stocktakes: StockTake[] =[];
  index: number;
  showContainer: boolean = false;
  showList:boolean = false;
  showError= false;

  constructor(private productService: ProductService, private router: Router,private api: SalesService) { }


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

  getByContainer(val: Container){
    this.showContainer = true;
    this.showList = false;
    this.setContainer(val);

  }

  setContainer(val: Container){
    this.container = val;
    this.showError = false;
  }

  searchByContainer(){
    if(this.container == null){
      this.showError = true;
    }
    this.productService.getContainerStockTakes(this.container.ContainerID).subscribe((res: any) =>
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

}
