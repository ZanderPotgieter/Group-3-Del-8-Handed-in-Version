import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../product.service';
import { Vat } from '../../vat';
import { NgModule } from '@angular/core';
import { DialogService } from '../../../shared/dialog.service';

@Component({
  selector: 'app-update-vat',
  templateUrl: './update-vat.component.html',
  styleUrls: ['./update-vat.component.scss']
})
export class UpdateVatComponent implements OnInit {

  constructor(private productService: ProductService, private router: Router, private dialogService: DialogService) { }

  vat : Vat = new Vat();
  date = new Date();
  newVat: Vat = new Vat();
  list: Vat[] =[];  
  addDes : string;
  showadd: boolean = false;
  enableInput: boolean = true;
  responseMessage : string;
  todaysDate: string;
  selectedDate: string;
  

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
    if(this.list[ndx].VATPerc == 15){
      this.dialogService.openAlertDialog("Update Retricted For Selected VAT ")
    }
    else{
      this.saveupdate( this.vat);
    }
    

  }

 

  update(ndx: number){
    this.selectedDate = this.list[ndx].VATStartDate.toString();
    this.todaysDate = this.date.toString();
    if(this.selectedDate == this.todaysDate){
      this.dialogService.openAlertDialog("Update Retricted For Selected VAT ")
    }
    else{
      this.enableInput = false;
    }
    
  }

  saveupdate(vatUpdate: Vat){
    this.productService.updateVat(vatUpdate).subscribe((res:any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)
        this.router.navigate(["product-management"])}
        if(res.Error){
          this.responseMessage = res.Message;
          this.dialogService.openAlertDialog(this.responseMessage)
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
