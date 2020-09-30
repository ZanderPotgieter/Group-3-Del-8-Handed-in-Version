import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpClientModule} from "@angular/common/http"; 
import { Observable } from 'rxjs'; 
import { User} from "./user";
import {UserTypeAccess} from './user-type-access';

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


  getTreeData(){
    return this.http.get(this.url + '/getTreeData')
  }

  getAccessForUserType(id: number){
    return this.http.get(this.url + '/getAccessForUserType/'+id)

  }
setUserTypeAccess(UserTypeAccess: UserTypeAccess[]){
  return this.http.post(this.url + '/setUserTypeAccess',this.httpOptions)
  

}
addUserTypeAccess(accessid: number, usertypeid: number){
  return this.http.get(this.url + '/addUserTypeAccess?accessid='+accessid+'&usertypeid='+usertypeid, this.httpOptions)


}

removeUserTypeAccess(accessid: number, usertypeid: number){
  return this.http.get(this.url + '/removeUserTypeAccess?accessid='+accessid+'&usertypeid='+usertypeid, this.httpOptions)


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

  getUserAccess(session: any){
    return this.http.post(this.url + '/getUserAccess',session, this.httpOptions)
  }

  getUserTypeAccess(){
    return this.http.get(this.url + '/getUserTypeAccess')
  }
  

}
