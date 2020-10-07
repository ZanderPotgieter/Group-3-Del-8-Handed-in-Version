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
import {Supplier} from 'src/app/supplier-management/supplier';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = 'https://localhost:44399/API/Product'
  constructor(private http: HttpClient) { }

  getAllSuppliers(): Observable<Supplier[]> {  
    return this.http.get<Supplier[]>('https://localhost:44399/Api/Supplier' + '/getAllSuppliers');  
  }
  getAllProductCategory(): Observable<ProductCategory[]> {  
    return this.http.get<ProductCategory[]>(this.url + '/GetAllProductCategories');  
  } 
  
  getAllProducts() {  
    return this.http.get(this.url + '/getAllProductsForAllContainers');  
  } 
  
  getContainerProducts(id: number){  
    return this.http.get<Product[]>(this.url + '/getAllProductsForSpecificContainer/'+id);  
  } 
  
  getProductByID(id: number){  
    return this.http.get(this.url + '/getProductByID/' + id);  
  } 

  getProductByBarcode(prodBarcode: string){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post<Product>(this.url + '/getProductByBarcode/?prodBarcode=' + prodBarcode ,httpOptions)
  }

  getProductByName(prodName: string){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post(this.url + "/getProductByName?prodName=" + prodName, httpOptions);
  }

  getProductByCategory(categoryID: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get<Product>(this.url + "/getProductByCategory?categoryID=" + categoryID, httpOptions);
  }

  moveProduct(fromConID : number, productID: number, quantity: number, toConID : number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.get("https://localhost:44399/Api/Product/moveProduct?fromConID=" +fromConID +"&productID=" + productID +"&quantity="+quantity + "&toConID=" + toConID
    , httpOptions);
  }

  getLowStock(containerID: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.get(this.url + '/getLowStock?containerID='+containerID, httpOptions)
  }

  

  addProduct(newProduct: Price): Observable<Price>   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Price>(this.url + '/addProduct',  
    newProduct, httpOptions);  
  }  

  updateProduct(newProduct: Product): Observable<Product>   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Product>(this.url + '/updateProduct',  
    newProduct, httpOptions);  
  } 

  deleteProduct(id: number) {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<Product>(this.url + '/deleteProduct?id='+id, httpOptions);  
  } 

  addPrice(newPrice: Price) {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put(this.url + '/addPrice',  
    newPrice, httpOptions);  
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
    return this.http.put<Vat>(this.url + '/UpdateVat',  
    vat, httpOptions);  
  }  

  linkContainer(containerID: number, productID: number, quantity:number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put("https://localhost:44399/Api/Product/addProductToContainer?containerID=" +containerID +"&productID=" + productID +"&quantity="+quantity
    , httpOptions); 
  }

  removeContainer(containerID: number, productID: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post("https://localhost:44399/Api/Product/removeProductFromContainer?containerID=" +containerID +"&productID=" + productID
    , httpOptions); 
  }

  initateStockTake(session: any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post(this.url + '/initateStockTake', session, httpOptions);
  }

  addStockTakeProduct(stockTakeID: number, productID: number, STcount: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/addStockTakeProduct?stockTakeID='+ stockTakeID + '&productID=' +productID + '&STcount=' +STcount, httpOptions);
  }

  getStockTake(id: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getStockTake?id='+ id,  httpOptions);
  }
  getAllStockTakes(){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getAllStockTakes',  httpOptions);
  }

  getTodaysStockTake(date: string, containerID: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getTodaysStockTake?date='+ date + "&containerID=" + containerID,  httpOptions);
  }

  getCompletedStockTakes(){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getCompletedStockTakes',  httpOptions);
  }

  getIncompleteStockTakes(){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getIncompleteStockTakes',  httpOptions);
  }

  getContainerStockTakes(containerID: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/getContainerStockTakes?containerID='+ containerID,  httpOptions);
  }

  AddMarkedOff(markedOff: MarkedOff){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.post(this.url + '/AddMarkedOff', markedOff, httpOptions);
  }

  completeStockTake(id: number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) }; 
    return this.http.get(this.url + '/completeStockTake?id='+ id,  httpOptions);
  }



  
  
}
