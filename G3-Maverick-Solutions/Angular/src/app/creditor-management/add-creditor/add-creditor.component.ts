import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreditorService } from '../creditor.service';
import { Creditor } from '../creditor';
import { Router } from '@angular/router';
import { Supplier} from '../supplier';
import { SupplierService } from 'src/app/supplier-management/supplier.service';

@Component({
  selector: 'app-add-creditor',
  templateUrl: './add-creditor.component.html',
  styleUrls: ['./add-creditor.component.scss']
})
export class AddCreditorComponent implements OnInit {

  dataSaved = false;
  creditorForm : any;
  provinceIDUpdate = null;
  message = null;
  selectedSupplier: Supplier;
  selectedSupID: number;

  constructor(private creditorService: CreditorService, private supplierService: SupplierService,private formBuilder: FormBuilder, private router: Router) { }

  creditor : Creditor = new Creditor();
  supplier: Supplier = new Supplier();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  suppliers: Supplier[] = [];
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;
  id: number;

  ngOnInit(): void {
     this.creditorForm = this.formBuilder.group({
      ProvName: ['', [Validators.required]],
    }) 

    this.supplierService.getAllSuppliers().subscribe((res:any) =>{
      console.log(res);
      this.suppliers = res; 
      if (res.Error){
        alert(res.Error);
      }
  })
}

  loadSuppliers(val: Supplier){
   
    this.addSupplier(val);
  }

  addSupplier(val : Supplier){
    this.selectedSupplier= val;
  }

  Save(){
    this.creditor.SupplierID = 3 //this.selectedSupplier.SupplierID = 3;
    this.creditorService.addCreditor(this.creditor).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        alert(this.responseMessage)
        this.router.navigate(["creditor-management"]);}
        else if (res.Error){
          alert(res.Error);
        }
       
    })
    
  }

  gotoCreditorManagement()
  {
    this.router.navigate(['creditor-management']);
  }

 

searchSupplier(name: string)
{
  this.creditorService.searchSupplier(this.name).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.responseMessage = res.Message;
        alert(this.responseMessage)

      }
      else 
      { 
        
        this.supplier.SupName = res.SupName;
        this.supplier.SupCell = res.SupCell;
        this.supplier.SupEmail = res.SupEmail;
        this.supplier.SupplierID = res.SupplierID;
      }

      this.showSearch = true;
      this.showResults = true; 
    })
}

addCreditor( )
{
  this.creditorService.addCreditor(this.creditor).subscribe( (res:any)=> 
  {
    console.log(res);
    if(res.Message)
    {
      this.responseMessage = res.Message;
    }
    alert(this.responseMessage)
    this.router.navigate(["creditor-management"])
  })


  /* if (this.provinceIDUpdate == null)
  {
    this.provinceService.addProvince(province).subscribe(
      () => {
        this.dataSaved = true;
        this.provinceIDUpdate = null;
      }
    );
  }
  else
  {
    province.ProvinceID = this.provinceIDUpdate;
    this.provinceService.updateProvince(province).subscribe(
      () => {
        this.dataSaved = true;
        this.provinceIDUpdate = null;
      }
    );
  } */
}

cancel(){
  this.router.navigate(["gps-management"])
}



}


  


