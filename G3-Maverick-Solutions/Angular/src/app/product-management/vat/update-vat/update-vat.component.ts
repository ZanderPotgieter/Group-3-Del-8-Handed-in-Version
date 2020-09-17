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
  ngOnInit(){
    this.loadVat();
  }

  loadVat(){
    this.productService.getVat().subscribe((res:any)=> {
      console.log(res);
      this.vat.VATPerc = res.VATPerc;
      this.vat.VATStartDate = res.VATStartDate;
      this.vat.VATEndDate = res.VATEndDate;
      })
  }
  Save(){}

  Cancel(){}
}
