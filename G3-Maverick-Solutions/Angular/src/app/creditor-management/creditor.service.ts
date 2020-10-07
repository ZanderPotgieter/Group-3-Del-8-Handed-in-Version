import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Creditor } from './creditor';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class CreditorService {

  url = 'https://localhost:44399/api/Creditor';    //address of REST API server

  constructor( private http: HttpClient) { }

  getAllCreditors(): Observable<Creditor[]>
  {
    return this.http.get<Creditor[]>(this.url + '/getAllCreditors');
  }

  getCreditorById(creditorID: number): Observable<Creditor>
  {
    return this.http.get<Creditor>(this.url + '/getCreditorByID' + creditorID);
  }

  searchCreditor(name: string): Observable<Creditor>
  {
    return this.http.get<Creditor>(this.url + '/searchCreditor?name=' +name);
  }

  getAllSuppliers(): Observable<Supplier[]> {  
    return this.http.get<Supplier[]>('https://localhost:44399/Api/Supplier' + '/getAllSuppliers');  
  }

  addCreditor(creditor: Creditor): Observable<Creditor>  {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Creditor>(this.url + '/AddCreditor',  
    creditor, httpOptions);  
  }  

  updateCreditor(creditor: Creditor): Observable<Creditor>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.put<Creditor>(this.url + '/updateCreditor/', creditor, httpOptions);
  }

  removeCreditor(creditorID: number): Observable<Creditor>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.delete<Creditor>(this.url + '/removeCreditor?id=' + creditorID, httpOptions);
 
  }

  searchSupplier(name: string): Observable<any>
  {
    return this.http.get<Creditor>(this.url + '/searchSupplier?name=' +name);
  }

}
