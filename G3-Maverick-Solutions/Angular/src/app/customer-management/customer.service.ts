import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Customer} from './customer';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Customer'

  getAllCustomers(): Observable<Customer[]> {  
    return this.http.get<Customer[]>(this.url + '/getAllCustomers');  
  }
  
  getCustomer(Id: number): Observable<Customer> {  
    return this.http.get<Customer>(this.url + '/getCustomer/' + Id);  
  } 
  
  searchCustomer(name: string, surname: string): Observable<Customer> {  
    return this.http.get<Customer>(this.url + '/searchCustomer?name='+name+'&surname='+surname);  
  }  

  addCustomer(Customer: Customer): Observable<Customer> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Customer>(this.url + '/addCustomer',  
    Customer, httpOptions);  
  }  

  updateCustomer(Customer: Customer): Observable<Customer> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Customer>(this.url + '/updateCustomer',  
    Customer, httpOptions);  
  }  

  deleteCustomer(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/deleteCustomer?id=' + Id,  
 httpOptions);  
  } 
}
