import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Supplier} from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Supplier'

  getAllSuppliers(): Observable<Supplier[]> {  
    return this.http.get<Supplier[]>(this.url + '/getAllSuppliers');  
  }
  
  getSupplier(Id: number): Observable<Supplier> {  
    return this.http.get<Supplier>(this.url + '/getSupplier/' + Id);  
  } 
  
  searchSupplier(name: string): Observable<Supplier> {  
    return this.http.get<Supplier>(this.url + '/searchSupplier?name=' + name);  
  }  

  addSupplier(Supplier: Supplier): Observable<Supplier> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Supplier>(this.url + '/addSupplier',  
    Supplier, httpOptions);  
  }  

  updateSupplier(Supplier: Supplier): Observable<Supplier> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Supplier>(this.url + '/updateSupplier',  
    Supplier, httpOptions);  
  }  

  deleteSupplier(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/deleteSupplier?id=' + Id,  
 httpOptions);  
  } 



}
