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

  url = 'https://localhost:44399/API/Sale'

  initiateSale(){
    return this.http.get(this.url + '/initiateMakeSale').pipe(map(result => result)); 

  }

  makeSale(sale: Sale) : Observable<Sale>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Sale>(this.url + '/makeSale',  
    sale, httpOptions); 
  }

  searchSalesByDate(date : Date){
    const httpOptions = { headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*'}) };
    return this.http.get(this.url + '/searchSalesByDate/'+date , httpOptions);
  }

  searchSalesByProduct(prodId:number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.get(this.url + '/searchSalesByProdcut/'+ prodId , httpOptions);
  }

  getSale(id:number){
    return this.http.get(this.url + '/searchSalesByID/'+ id);
  }
  getAllSales(){
    return this.http.get(this.url + '/getAllSales');
  }






}
