import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { Vat } from '../../vat';

@Component({
  selector: 'app-add-vat',
  templateUrl: './add-vat.component.html',
  styleUrls: ['./add-vat.component.scss']
})
export class AddVatComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router) { }

  vat : Vat = new Vat();
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void {
  }

  Save(){
    this.productService.addVat(this.vat).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        alert(this.responseMessage)
        this.router.navigate(["product-management"])}
        if(res.Error){
          this.responseMessage = res.Message;
        alert(this.responseMessage)
        }
    })
  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

}
