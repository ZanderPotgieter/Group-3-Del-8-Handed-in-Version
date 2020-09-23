import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { ProductCategory } from './product-category'; 
import { Vat } from './vat';
import { Product } from './product';
import { Price } from './price';
import { StockTake } from './stock-take';
import { MarkedOff } from './marked-off';
import { MarkedOffReason } from './marked-off-reason';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'https://localhost:44399/API/Product'
  constructor(private http: HttpClient) { }

  
  getAllProductCategory(): Observable<ProductCategory[]> {  
    return this.http.get<ProductCategory[]>(this.url + '/GetAllProductCategories');  
  } 
  
  getProductByID(id: number): Observable<Product> {  
    return this.http.get<Product>(this.url + '/getProductByID/' + id);  
  } 

  getProductByBarcode(prodBarcode: string): Observable<Product>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Product>(this.url + '/getProductByBarcode/?prodBarcode=' + prodBarcode ,httpOptions)
  }

  getProductByName(prodName: string): Observable<Product>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Product>(this.url + "/getProductByName?prodName=" + prodName, httpOptions);
  }

  getProductByCategory(prodCategory: string): Observable<Product>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Product>(this.url + "/getProductByCategory?prodCategory=" + prodCategory, httpOptions);
  }

  

  addProduct(newProduct: Product): Observable<Product>   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Product>(this.url + '/addProduct',  
    newProduct, httpOptions);  
  }  

  addStockTake(stockTake: StockTake): Observable<StockTake> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<StockTake>(this.url + '/AddStockTake',  
    stockTake, httpOptions);  
  }  

  getAllMarkedOffReasons(): Observable<MarkedOffReason[]> {  
    return this.http.get<MarkedOffReason[]>(this.url + '/GetAllMarkedOffReasons');  
  } 

  getVat() : Observable<Vat[]>{
    return this.http.get<Vat[]>(this.url + '/GetVat');
  }

  addVat(vat: Vat): Observable<Vat> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Vat>(this.url + '/AddVat',  
    vat, httpOptions);  
  }  

  updateVat(vat: Vat): Observable<Vat> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Vat>(this.url + '/UpdateVat/',  
    vat, httpOptions);  
  }  
}
