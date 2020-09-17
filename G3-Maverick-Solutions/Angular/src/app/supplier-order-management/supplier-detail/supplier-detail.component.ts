import { Component, OnInit } from '@angular/core';
import { SupplierOrderService } from '../supplier-order.service';
import { Router } from '@angular/router';
import { SupplierDetail } from '../supplier-detail';

@Component({
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss']
})
export class SupplierDetailComponent implements OnInit {

  constructor(private api: SupplierOrderService, private router: Router) { }
  supplierdetail : SupplierDetail = new SupplierDetail();

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void {
  }

  Search(){
    this.api.getSupplier(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.supplierdetail.ProductID = res.ProductID;
          this.supplierdetail.SupName = res.SupName;
          this.supplierdetail.ProdName = res.ProdName;
          this.supplierdetail.CellNum = res.CellNum;
          this.supplierdetail.Email = res.Email;
          this.supplierdetail.StreetNo = res.StreetNo;
        }
      })
  
      }
    }
