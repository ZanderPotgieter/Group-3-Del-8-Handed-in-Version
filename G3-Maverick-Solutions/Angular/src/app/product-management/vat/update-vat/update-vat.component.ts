import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { Vat } from '../../vat';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-update-vat',
  templateUrl: './update-vat.component.html',
  styleUrls: ['./update-vat.component.scss']
})
export class UpdateVatComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router) { }

  vat : Vat = new Vat();
  newVat: Vat = new Vat();
  list: Vat[] =[];  
  addDes : string;
  showadd: boolean = false;
  enableInput: boolean = true;
  responseMessage : string;
  

  ngOnInit(){
    this.productService.getVat().subscribe((res:any)=> {
      console.log(res);
      this.list = res.VAT;
      })
  }

  trackByndx(ndx: number, item:any): any{
    return ndx;
  }

  save(ndx: number){
    this.vat.VATID = this.list[ndx].VATID;
    this.vat.VATPerc = this.list[ndx].VATPerc;
    this.vat.VATStartDate = this.list[ndx].VATStartDate;
    this.vat.VATEndDate = this.list[ndx].VATEndDate;
    this.saveupdate( this.vat);

  }

 

  update(){
    this.enableInput = false;
  }

  saveupdate(vatUpdate: Vat){
    this.productService.updateVat(vatUpdate).subscribe((res:any)=> {
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

  add(){

    this.showadd = true;
    
  }

  saveadd(){
    this.productService.addVat(this.newVat).subscribe((res:any)=> {
      console.log(res);
      })

  }

  Cancel(){
    this.router.navigate(['product-management']);
  }
}
