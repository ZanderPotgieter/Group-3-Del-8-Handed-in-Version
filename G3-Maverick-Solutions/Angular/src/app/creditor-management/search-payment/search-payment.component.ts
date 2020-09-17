import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import {CreditorPayment} from '../creditor-payment';
import { NgModule } from '@angular/core';
import {CreditorPaymentService} from '../creditor-payment.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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

  constructor(public credpayment:CreditorPaymentService,private router: Router) { }

  loadDisplay(){  
    debugger;  
    this.allPayments= this.credpayment.searchCreditorPayment();    
  }  
  ngOnInit() {  
    this.loadDisplay();  

  }  
  
}  
