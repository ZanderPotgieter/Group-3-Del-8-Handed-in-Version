import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable, from } from 'rxjs'; 
import {Sale} from './sale';
import{map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
   

  url = 'https://localhost:44399/Api/Sale';

  initiateSale( session : any){
    return this.http.post(this.url + '/initiateMakeSale', session, this.httpOptions); 
  }

  addSaleProduct(productID: number, saleID: number, quantity){
    return this.http.get(this.url + '/addSaleProduct?productID='+productID+'&saleID='+saleID +'&quantity='+quantity, this.httpOptions)
  }

  removeSaleProduct(productID: number, saleID: number, quantity){
    return this.http.get(this.url + '/removeSaleProduct?productID='+productID+'&saleID='+saleID +'&quantity='+quantity, this.httpOptions)
  }

  makeSalePayment(saleID: number, payAmount: number, paymentTypeID:number){
  return this.http.get(this.url + '/makeSalePayment?saleID='+saleID+'&payAmount='+payAmount +'&paymentTypeID='+paymentTypeID, this.httpOptions)
  }

 cancelSale(saleID: number){
  return this.http.get(this.url + '/cancelSale?saleID='+saleID, this.httpOptions)
 }

  searchSalesByDate(date : Date){
    const httpOptions = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*'}) };
    return this.http.get(this.url + '/searchSalesByDate/'+date , httpOptions);
  }

  searchSalesByProduct(prodId:number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.get(this.url + '/searchSalesByProduct/'+ prodId , httpOptions);
  }

  getSale(id:number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.get(this.url + '/getSale/'+ id , httpOptions);
  }
  getAllSales(){
    return this.http.get(this.url + '/getAllSales');
  }

  getUserDetails(session: any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.post('https://localhost:44399/Api/Login/getUserDetails',session, httpOptions);
  }

  checkStock(containerID: number){
    return this.http.get(this.url + '/checkStock?containerID='+containerID, this.httpOptions)
  }

}
