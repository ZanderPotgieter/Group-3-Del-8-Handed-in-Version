import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { Creditor } from '../creditor';
import { Supplier } from '../supplier';
import { CreditorService } from '../creditor.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-creditor',
  templateUrl: './search-creditor.component.html',
  styleUrls: ['./search-creditor.component.scss']
})
export class SearchCreditorComponent implements OnInit {

  private _allCred: Observable<Creditor[]>;  
  public get allCred(): Observable<Creditor[]> {  
    return this._allCred;  
  }  
  public set allCred(value: Observable<Creditor[]>) {  
    this._allCred = value;  
  }  

  constructor(private api: CreditorService,private creditorService: CreditorService, private router: Router, private dialogService: DialogService, private bf: FormBuilder ) { }
  credForm: FormGroup;
  loadDisplay(){  
    debugger;  
    this.allCred= this.api.getAllCreditors();  
  
  } 

  creditor: Creditor = new Creditor();
  supplier: Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";
  creditorNull: boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  inputDisabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;

  ngOnInit(): void {
    debugger;  
    this.allCred= this.api.getAllCreditors();  

    this.loadDisplay();  
    this.credForm= this.bf.group({  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z0-9 ]*')]],  
      CredBank: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z0-9 ]*')]],   
      CredBranch: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z0-9 ]*')]],
      CredAccount: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z0-9 ]*')]],
      CredType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],      
    }); 
    
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
        this.dialogService.openAlertDialog(res.Message);

      }
      else 
      {
        this.creditor.SupplierID = res.SupplierID;
        this.creditor.CreditorID = res.CreditorID;
        this.creditor.CredAccountBalance = res.CredAccountBalance;
        this.creditor.CredBank = res.CredBank;
        this.creditor.CredBranch = res.CredBranch;
        this.creditor.CredAccount = res.CredAccount;
        this.creditor.CredType = res.CredType;
        this.supplier.SupName = res.Supplier.SupName;
        this.supplier.SupCell = res.Supplier.SupCell;
        this.supplier.SupEmail = res.Supplier.SupEmail;
        this.showSearch = false;
        this.showResults = true;
      }

       
    })
  }

  updateCreditor(){
    if (this.creditor.SupplierID == null || this.creditor.CredAccountBalance ==null || this.creditor.CredBank == null || this.creditor.CredBranch==null)
    {
      this.creditorNull = true;
    }
    else
    {
    this.dialogService.openConfirmDialog('Are you sure you want to update this creditor?')
    .afterClosed().subscribe(res => {
      if(res){
    this.creditorService.updateCreditor(this.creditor).subscribe( (res: any) =>
    {
      console.log(res);
      if(res.Message)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      this.router.navigate(["creditor-management"])
    })
  }
});
}}


removeCreditor(){
  this.dialogService.openConfirmDialog('Are you sure you want to remove this supplier as creditor?')
  .afterClosed().subscribe(res => {
    if(res){
  this.api.removeCreditor(this.creditor.SupplierID).subscribe( (res:any)=> {
    console.log(res);
    if(res.Message != null){
      this.dialogService.openAlertDialog(res.Message);
      this.router.navigate(["creditor-management"])
  }
  else{
    this.dialogService.openAlertDialog('Unable to delete supplier as creditor. Payments were made to this creditor.');
  }
  })
}
});

}

  enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.inputDisabled = true;
    this.showButtons = false;
  }
    
  cancel()
  {
    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed().subscribe(res => {
      if(res){
        
  }
});

}
      
    
  

}