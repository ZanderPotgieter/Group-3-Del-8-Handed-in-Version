import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Creditor } from '../creditor';
import { Supplier } from '../supplier';
import { CreditorService } from '../creditor.service';

@Component({
  selector: 'app-search-creditor',
  templateUrl: './search-creditor.component.html',
  styleUrls: ['./search-creditor.component.scss']
})
export class SearchCreditorComponent implements OnInit {

  constructor(private creditorService: CreditorService, private router: Router ) { }

  creditor: Creditor = new Creditor();
  supplier: Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;

  ngOnInit(): void {
  }

  gotoCreditorManagement()
  {
    this.router.navigate(['creditor-management']);
  }

   searchCreditor()
  {
    this.creditorService.searchCreditor(this.name).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.responseMessage = res.Message;
        alert(this.responseMessage)

      }
      else 
      {
        this.creditor.SupplierID = res.SupplierID;
        this.creditor.CreditorID = res.CreditorID;
        this.creditor.CredAccountBalance = res.CredAccountBalance
        this.supplier.SupName = res.Supplier.SupName;
        this.supplier.SupCell = res.Supplier.SupCell;
        this.supplier.SupEmail = res.Supplier.SupEmail;
        this.showSearch = true;
        this.showResults = true;
      }

       
    })
  }

  updateCreditor(){
    this.creditorService.updateCreditor(this.creditor).subscribe( (res: any) =>
    {
      console.log(res);
      if(res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["creditor-management"])
    })
  }

  removeCreditor()
  {
    this.creditorService.removeCreditor(this.creditor.CreditorID).subscribe( (res:any) =>
    {
      console.log(res);
      if (res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["creditor-management"])
    })
  }

  enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }
    
  cancel()
  {
    /* this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; */

    this.router.navigate(["creditor-management"])
  }
      
    
  

}
