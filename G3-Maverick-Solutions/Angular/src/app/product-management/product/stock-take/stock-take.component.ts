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
lowStock(){
  this.router.navigate(['lowstock'])
}

openHelp(){
  window.open("https://ghelp.z1.web.core.windows.net/StockManagementScreen.html")
}

stockTakeForm(){
  this.router.navigate(['stock-take-form'])
}

MarkedOff(){
  this.router.navigate(['marked-off'])
}

  StockTake(){
    this.router.navigate(['complete-stock-take'])
    
  }

 
  SearchStockTake(){
    this.router.navigate(['search-stock-take'])
    
  }

}
