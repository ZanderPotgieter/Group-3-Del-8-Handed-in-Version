import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { ProductCategory } from '../../product-category';
import { MarkedOffReason } from '../../marked-off-reason'

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.scss']
})
export class StockTakeComponent implements OnInit {

  showStockTake = false;
  showMarkedOff = false;

  categories: ProductCategory[];
  reasons : MarkedOffReason[];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.productService.getAllProductCategory()
      .subscribe(value => {
        if (value != null) {
          this.categories = value;
        }
      });

      this.productService.getAllMarkedOffReasons()
      .subscribe(res => {
        if (res != null){
          this.reasons = res;
        }
      });
  }

  //Stock Take
  StockTake(){
    this.showStockTake=true;
    this.showMarkedOff=false;
  }

  Add(){}

  Remove(){}

  Save(){}

  Cancel(){}

  //Marked-Off
  MarkedOff(){
    this.showMarkedOff=true;
    this.showStockTake=false;
  }
  
  AddMO(){}

  RemoveMO(){}

  SaveMO(){}

  CancelMO(){}

}
