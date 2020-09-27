import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http"; 
import { Observable } from 'rxjs'; 
import { User} from "./user";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Admin'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  getAllUsers(){
    return this.http.get(this.url + '/getAllUsers')
  }
  getAllTypesAndUsers(){
    return this.http.get(this.url + '/getAllTypesAndUsers')
  }

  getAllUserTypes(){
    return this.http.get(this.url + '/getAllUserTypes')
  }

  getAllCusOrderStatuses(){
    return this.http.get('https://localhost:44399/Api/Admin/getAllCusOrderStatuses')
  }

  getAllSupOrderStatuses(){
    return this.http.get(this.url + '/getAllSupOrderStatuses')
  }

  getAllMarkedOfReasons(){
    return this.http.get(this.url + '/getAllMarkedOfReasons')
  }

  getAllPaymentTypes(){
    return this.http.get(this.url + '/getAllPaymentTypes')
  }


  updateCusOrderStatuses(id: number, description: string){
    return this.http.post(this.url + '/updateCusOrderStatuses?id='+id+'&description='+description, this.httpOptions)

  }

  updateSupOrderStatuses(id: number, description: string){
    return this.http.post(this.url + '/updateSupOrderStatuses?id='+id+'&description='+description, this.httpOptions)

  }

  updateMarkedOfReason(id: number, description: string){
    return this.http.post(this.url + '/updateMarkedOfReason?id='+id+'&description='+description, this.httpOptions)

  }

  updatePaymentTypes(id: number, description: string){
    return this.http.post(this.url + '/updatePaymentTypes?id='+id+'&description='+description, this.httpOptions)

  }
  updateUserType(id: number, description: string){
    return this.http.post(this.url + '/updateUserType?id='+id+'&description='+description, this.httpOptions)

  }

  addCusOrderStatuses(description: string){
    return this.http.post(this.url + '/addCusOrderStatuses?description='+ description, this.httpOptions)

  }

  addSupOrderStatuses(description: string){
    return this.http.put(this.url + '/addSupOrderStatuses?description='+ description, this.httpOptions)

  }

  addMarkedOfReasons(description: string){
    return this.http.put(this.url + '/addMarkedOfReason?description='+ description, this.httpOptions)
  }

  addPaymentTypes(description: string){
    return this.http.put(this.url + '/addPaymentTypes?description='+ description, this.httpOptions)
  }

  addUserType(description: string){
    return this.http.put(this.url + '/addUserType?description='+ description, this.httpOptions)
  }

  

}
