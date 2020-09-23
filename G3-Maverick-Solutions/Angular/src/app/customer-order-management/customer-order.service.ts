import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable, from } from 'rxjs'; 
import {CustomerOrder} from './customer-order';
import{map} from 'rxjs/operators';
import {Subject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private http: HttpClient) { }

  private customerIDSourse = new Subject<number>();
  customerId$ =this.customerIDSourse.asObservable();

  sendCustomerID(customerID : number){
    this.customerIDSourse.next(customerID);
  }

  url = 'https://localhost:44399/Api/CustomerOrders'

  searchByCell(cell : string){  
    return this.http.get(this.url + '/searchByCell?cell='+cell).pipe(map(result => result));  
  } 
  
  searchByOrderNo(orderNo : string){  
    return this.http.get(this.url + '/searchByOrderNo?orderNo='+orderNo).pipe(map(result => result));  
  } 

  searchAll(){  
    return this.http.get(this.url + '/searchAll').pipe(map(result => result));  
  } 


  initiatePlaceOrder(customerID : number ){
    return this.http.get(this.url + '/initiatePlaceOrder/'+customerID); 

  }

  placeOrder(order: CustomerOrder) : Observable<CustomerOrder>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<CustomerOrder>(this.url + '/placeOrder',  
    order, httpOptions); 
  }

  cancelOrder(CustomerOrderID : number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post(this.url + '/cancelOrder',  
    CustomerOrderID, httpOptions); 
  }

  collectOrder(CustomerOrderID : number){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post(this.url + '/collectOrder',  
    CustomerOrderID, httpOptions); 
  }

  sendNotification(orders: CustomerOrder[]) : Observable<CustomerOrder[]>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<CustomerOrder[]>(this.url + '/sendNotification',  
    orders, httpOptions); 
  }

  getOrdersByStatus(status: string){
    return this.http.get(this.url + '/getOrdersByStatus?status=' +status).pipe(map(result => result))
  }

  searchCustomer(name: string, surname: string) {  
    return this.http.get('https://localhost:44399/Api/Customer/searchCustomer?name='+name+'&surname='+surname);  
  }

}
