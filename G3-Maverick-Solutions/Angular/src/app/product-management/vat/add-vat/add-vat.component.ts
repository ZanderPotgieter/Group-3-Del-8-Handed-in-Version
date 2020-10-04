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
  list: Vat[] = [];
  date = new Date();
  responseMessage: string = "Request Not Submitted";
  found: boolean;

  ngOnInit(): void {
    this.productService.getVat().subscribe((res:any)=> {
      console.log(res);
      this.list = res.VAT;
      })
  }

  Save(){
    for(let item of this.list){
      if(item.VATStartDate == this.vat.VATStartDate){
        this.found = true;
        
      }
    }
    if(this.found == false){
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
    if(this.found = true){
      alert("Duplicate Vat Start Date Found")
    }


  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

}
