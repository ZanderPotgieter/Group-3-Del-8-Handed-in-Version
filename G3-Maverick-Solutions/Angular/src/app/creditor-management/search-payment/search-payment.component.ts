import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {CreditorPayment} from '../creditor-payment';
import { NgModule } from '@angular/core';
import {CreditorPaymentService} from '../creditor-payment.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { Supplier } from '../supplier';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-search-payment',
  templateUrl: './search-payment.component.html',
  styleUrls: ['./search-payment.component.scss']
})
export class SearchPaymentComponent implements OnInit {
  private _allPayments: Observable<CreditorPayment[]>;  
  public get allPayments(): Observable<CreditorPayment[]> {  
    return this._allPayments;  
  }  
  public set allPayments(value: Observable<CreditorPayment[]>) {  
    this._allPayments = value;  
  }  

  constructor(public credpayment:CreditorPaymentService,private router: Router,private dialogService: DialogService) { }
  payment : CreditorPayment= new CreditorPayment();
  payments: CreditorPayment[];
  responseMessage: string = "Request Not Submitted";
  credForm: FormGroup;
  paymentNull : boolean = false;

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showOptions: boolean = true;
  showResults: boolean = false;
  showSearchEdit: boolean = true;
  showResultsEdit: boolean = false;
  showViewAll: boolean = true;
  suppliers: Supplier[];

  loadDisplay(){  
    debugger;  
    this.allPayments= this.credpayment.searchCreditorPayment();    
  }  
  ngOnInit() {  
    this.loadDisplay();  

  }  

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/SearchPayment.html")
  }

  gotoCreditorManagment(){
    this.router.navigate(['creditor-management']);
  }

  getAll(){
    this.credpayment.getAllCreditorPayments().subscribe( (res:any)=> {
      console.log(res);
      if(res.Message !=null)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.showSearch = true;
        this.showResults = false;
        this.showResultsEdit = false;
    
      }
      else{
        
          /* this.location.LocationID = res.locations.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.Location_Status.LSDescription;
          this.location.AreaID = res.Area.ArName;
          this.location.ContainerID = res.Container.ConName; */
          this.payments = res.Payments;
          this.showSearch = false;
          this.showResults = false;
          this.showResultsEdit = false;
          this.showSearchEdit = false;
          this.showViewAll = true;
      }     
    })

  }
  
}  
