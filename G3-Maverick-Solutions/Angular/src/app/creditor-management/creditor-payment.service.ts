import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {CreditorPayment} from './creditor-payment';
import { filter } from 'rxjs/operators';
import { Supplier } from '../supplier-management/supplier';

@Injectable({
  providedIn: 'root'
})
export class CreditorPaymentService {


  constructor(private http:HttpClient) { }
   
  url = 'https://localhost:44399/Api/CreditorPayment'

  getAllCreditorPayments(): Observable<CreditorPayment[]> {  
    return this.http.get<CreditorPayment[]>(this.url + '/getAllCreditorPayments');  
  }

  getCreditorPayment(Id: number): Observable<CreditorPayment> {  
    return this.http.get<CreditorPayment>(this.url + '/getCreditorPayment/' + Id);  
  } 

  searchCreditorPayment():Observable<CreditorPayment[]>  
  {  
    return this.http.get<CreditorPayment[]>(this.url + '/searchCreditorPayment');  
  }   

  addCreditorPayment(CreditorPayment: CreditorPayment): Observable<CreditorPayment> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<CreditorPayment>(this.url + '/addCreditorPayment',  
    CreditorPayment, httpOptions);  
  }  

  getAllCreditors(): Observable<Supplier[]>{
    return this.http.get<Supplier[]>(this.url + '/GetAllCreditors');
  }

}
