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

  
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  url = 'https://localhost:44399/Api/SupplierOrder'

  getProducts(): Observable<Product[]> {  
    return this.http.get<Product[]>(this.url + '/getProducts');  
  }

  getAllContainers(){
    return this.http.get('https://localhost:44399/Api/Login' + '/getAllContainers')
  }

  getSupplierOrderStatuses(){
    return this.http.get(this.url + '/getSupplierOrderStatuses', this.httpOptions);
  }

  getSupplier(name:string): Observable<SupplierDetail[]> {  
    return this.http.get<SupplierDetail[]>(this.url + '/getSupplier?name=' + name);  
  }
  
  getBacklogProducts(containerID : number){
    return this.http.get(this.url + '/getBacklogProducts?containerID=' + containerID);
  }

  addProductToOrder(containerID: number, supplierID: number, productID: number, quantity: number){
    return this.http.get(this.url + '/addProductToOrder?containerID='+containerID +'&supplierID='+supplierID+'&productID='+productID+'&quantity=' +quantity)
  }
  
  getTodaysSupplierOrders(containerID : number){
    return this.http.get(this.url + '/getTodaysSupplierOrders?containerID=' + containerID);
  }

  getSupplierOrdersByContainer(containerID : number){
    return this.http.get(this.url + '/getSupplierOrdersByContainer?containerID=' + containerID);
  }

  getAllSupplierOrders(){
    return this.http.get(this.url + '/getAllSupplierOrders', this.httpOptions);
  }

  getSupplierOrdersByDate(date : string){
    return this.http.get(this.url + '/getSupplierOrdersByDate?date=' + date);
  }

  getSupplierOrdersByID(id : number){
    return this.http.get(this.url + '/getSupplierOrdersByID?id=' + id);
  }

  getSupplierOrdersByStatus(id : number){
    return this.http.get(this.url + '/getSupplierOrdersByStatus?id=' + id);
  }

  placeSupplierOrder(id : number){
    return this.http.get(this.url + '/placeSupplierOrder?id=' + id);
  }

  cancelSupplierOrder(id : number){
    return this.http.get(this.url + '/cancelSupplierOrder?id=' + id);
  }

  sendBackOrderEmail(id : number){
    return this.http.post(this.url + '/sendBackOrderEmail?supplierOrderID=' + id , this.httpOptions);
  }

  receiveOrderProduct( supplierOrderID: number, productID: number, quantity: number){
    return this.http.get(this.url + '/receiveOrderProduct?supplierOrderID='+supplierOrderID+'&productID='+productID+'&quantity=' +quantity)
  }

  updateCustomerOrder(containerID: number, supplierOrderID: number){
    return this.http.get(this.url + '/updateCustomerOrder?containerID='+containerID +'&supplierOrderID='+supplierOrderID)
  }

  getPlacedSupplierOrdersInContainer(containerID:number){
    return this.http.get(this.url + '/getPlacedSupplierOrdersInContainer?containerID='+containerID)
  }



}
