import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SupplierOrder } from './supplier-order';
import { Product } from './product_backlog';
import { SupplierDetail } from './supplier-detail';

@Injectable({
  providedIn: 'root'
})
export class SupplierOrderService {

  constructor(private http:HttpClient) { }

  url = 'https://localhost:44399/Api/SupplierOrder'

  getProducts(): Observable<Product[]> {  
    return this.http.get<Product[]>(this.url + '/getProducts');  
  }

  getSupplier(name:string): Observable<SupplierDetail[]> {  
    return this.http.get<SupplierDetail[]>(this.url + '/getSupplier?name=' + name);  
  }
}
