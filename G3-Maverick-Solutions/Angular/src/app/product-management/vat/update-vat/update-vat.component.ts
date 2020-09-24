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

  ngOnInit(){
    this.productService.getVat().subscribe((res:any)=> {
      console.log(res);
      this.list = res;
      })
  }

  trackByndx(ndx: number, item:any): any{
    return ndx;
  }

  save(ndx: number){
    this.vat.VATPerc = this.list[ndx].VATPerc;
    this.vat.VATStartDate = this.list[ndx].VATStartDate;
    this.saveupdate( this.vat);

  }

 

  update(){
    this.enableInput = false;
  }

  saveupdate(vatUpdate: Vat){
    this.productService.updateVat(vatUpdate).subscribe((res:any)=> {
      console.log(res);
      this.list = res;
      })

  }

  add(){

    this.showadd = true;
    
  }

  saveadd(){
    this.productService.addVat(this.newVat).subscribe((res:any)=> {
      console.log(res);
      this.list = res;
      })

  }

  Cancel(){
    this.router.navigate(['product-management']);
  }
}
