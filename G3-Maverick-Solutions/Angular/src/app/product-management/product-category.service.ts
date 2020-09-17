import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { ProductCategory } from './product-category'; 

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  url = 'https://localhost:44399/Api/ProductCategory'
  constructor(private http: HttpClient) { }

  
  getAllProductCategory(): Observable<ProductCategory[]> {  
    return this.http.get<ProductCategory[]>(this.url + '/GetAllProductCategories');  
  }  

  getProductCategoryById(Id: number): Observable<ProductCategory> {  
    return this.http.get<ProductCategory>(this.url + '/GetProductCategory/' + Id);  
  }  

  addProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<ProductCategory>(this.url + '/AddProductCategory',  
    productCategory, httpOptions);  
  }  
  
  searchProductCategory(name: string): Observable<ProductCategory> {  
    return this.http.get<ProductCategory>(this.url + '/SearchProductCategory?name=' + name );  
  }  

  updateProductCategory(productCategory: ProductCategory): Observable<ProductCategory> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<ProductCategory>(this.url + '/UpdateProductCategory/',  
    productCategory, httpOptions);  
  }  

  deleteProductCategoryById(productCategoryId: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/DeleteProductCategoryDetails?id=' + productCategoryId,  
 httpOptions);  
  } 
}
