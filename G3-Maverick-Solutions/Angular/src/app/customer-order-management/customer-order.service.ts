import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable, from } from 'rxjs'; 
import {CustomerOrder} from './customer-order';
import{map} from 'rxjs/operators';
//import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subject} from 'rxjs';
import { Customer } from '../customer-management/customer';
import { PaymentType } from '../sales-management/payment-type';
@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

 


  constructor(private http: HttpClient) { }

  
  /*private customerIDSource = new BehaviorSubject<number>();
  currentCustomerID = this.customerIDSource.asObservable();
  changeCustomerID(customerID: number){
    this.currentCustomerID.next(customerID);
  }*/




  private customerIDSource = new Subject<number>();
  currentCustomerID = this.customerIDSource.asObservable;
  //customerId$ =this.customerIDSourse.asObservable();

  changeCustomerID(customerID : number){
    this.customerIDSource.next(customerID);
  }





  url = 'https://localhost:44399/Api/CustomerOrders'

  urlcus = 'https://localhost:44399/Api/Customer'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  searchByCell(cell : string){  
    return this.http.get(this.url + '/searchByCell/'+cell, this.httpOptions);  
  } 
  
  searchByOrderNo(orderNo : string){  
    return this.http.get(this.url + '/searchByOrderNo?orderNo='+orderNo).pipe(map(result => result));  
  } 

  searchAll(){  
    return this.http.get(this.url + '/searchAll').pipe(map(result => result));  
  } 

  searchAllFulfilled(){  
    return this.http.get(this.url + '/searchAllFulfilled').pipe(map(result => result));  
  } 

  initiatePlaceOrder(customerID : number, session : any ){
    return this.http.post(this.url + '/initiatePlaceOrder/'+customerID, session, this.httpOptions).pipe(map(result => result)); 

  }

  sendOrderEmail(email: string)
  {
    return this.http.post(this.url + '/sendOrderEmail?email=' + email, this.httpOptions);
  }

  addCustomerOrderProduct(productID: number, customerorderID: number, quantity){
    return this.http.get(this.url + '/addCustomerOrderProduct?productID='+productID+'&customerorderID='+customerorderID +'&quantity='+quantity, this.httpOptions)
  }

  removeCustomerOrderProduct(productID: number, customerorderID: number, quantity){
    return this.http.get(this.url + '/removeCustomerOrderProduct?productID='+productID+'&customerorderID='+customerorderID +'&quantity='+quantity, this.httpOptions)
  }

  placeOrder(order: CustomerOrder) : Observable<CustomerOrder>{
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<CustomerOrder>(this.url + '/placeOrder',  
    order , httpOptions); 
  }

  makeOrderPayment(customerorderID: number, payAmount: number, paymentTypeID:number){
    return this.http.get(this.url + '/makeOrderPayment?customerorderID='+customerorderID+'&payAmount='+payAmount +'&paymentTypeID='+paymentTypeID, this.httpOptions)
    }

  cancelCustomerOrder(customerorderID: number){
    return this.http.get(this.url + '/cancelCustomerOrder?customerorderID='+customerorderID, this.httpOptions)
   }

  cancelCusOrder(CustomerOrder: CustomerOrder): Observable<CustomerOrder> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<CustomerOrder>(this.url + '/cancelCusOrder',  
    CustomerOrder, httpOptions);  
  }  

  collectCusOrder(CustomerOrder: CustomerOrder): Observable<CustomerOrder> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<CustomerOrder>(this.url + '/collectCusOrder',  
    CustomerOrder, httpOptions);  
  }  
  

  getOrdersByStatus(status: string){
    return this.http.get(this.url + '/getOrdersByStatus?status=' +status).pipe(map(result => result))
  }

  searchCustomer(name: string, surname: string) {  
    return this.http.get('https://localhost:44399/Api/Customer/searchCustomer?name='+name+'&surname='+surname);  
  }

  getAllCustomers(): Observable<Customer[]> {  
    return this.http.get<Customer[]>(this.urlcus + '/getAllCustomers');  
  }

  getAllPaymentTypes(): Observable<PaymentType[]> {  
    return this.http.get<PaymentType[]>('https://localhost:44399/Api/CustomerOrders' + '/getAllPaymentTypes');  
  }

  getUserDetails(session: any){
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };
    return this.http.post('https://localhost:44399/Api/Login/getUserDetails',session, httpOptions);
  }

  sendNotification(email: String, number: string)
  {
    return this.http.post(this.url + '/sendNotification?email=' + email+'&number='+ number, this.httpOptions);
  }



}