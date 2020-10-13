import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { ProductService } from '../../product.service';
import { Vat } from '../../vat';
import { DialogService } from '../../../shared/dialog.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-add-vat',
  templateUrl: './add-vat.component.html',
  styleUrls: ['./add-vat.component.scss']
})
export class AddVatComponent implements OnInit {

  constructor(private productService: ProductService,private fb: FormBuilder, private router: Router, private dialogService: DialogService) { }
  VatForm: FormGroup;
  vat : Vat = new Vat();
  list: Vat[] = [];
  date = new Date();
  responseMessage: string = "Request Not Submitted";
  found: boolean;
  showError = false;
  errorMessage: string;

  ngOnInit(): void {
    this.VatForm= this.fb.group({
       
      VatPerc: ['', [Validators.required]],
      VatStartDate: ['', [Validators.required]],
    }); 
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
          this.dialogService.openAlertDialog(this.responseMessage)
          this.router.navigate(["product-management"])}
          if(res.Error){
            this.responseMessage = res.Message;
            this.dialogService.openAlertDialog(this.responseMessage)
          }
      })
    }
    if(this.found == true){
      this.dialogService.openAlertDialog("Duplicate Vat Start Date Found")
    }
    if((this.vat.VATStartDate.getMonth() < this.date.getMonth()) && (this.vat.VATStartDate.getDate() < this.date.getDate())  && (this.vat.VATStartDate.getFullYear() < this.date.getFullYear())){
      this.errorMessage = "Vat Start Date Cannot Be In The Past"; 
          this.showError = true;
          setTimeout(() => {
            this.showError = false;
          }, 6000);
    }
    

  }

  Cancel(){
    this.router.navigate(["product-management"]);
  }

}
