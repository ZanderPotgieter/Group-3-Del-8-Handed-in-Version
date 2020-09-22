import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-searched-product-details',
  templateUrl: './searched-product-details.component.html',
  styleUrls: ['./searched-product-details.component.scss']
})
export class SearchedProductDetailsComponent implements OnInit {
  
  constructor(private router: Router) { }

  showBtns: boolean = true;
  showBtnsWhenUpdateClicked: boolean = false;

  ngOnInit(): void {
  }

  Update(){
   this.showBtnsWhenUpdateClicked = true;
   this.showBtns = false;
  }

  Remove(){

  }

  ListAllPrices(){

  }

  AddPrice(){

  }

  Save(){

  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }
  

}
