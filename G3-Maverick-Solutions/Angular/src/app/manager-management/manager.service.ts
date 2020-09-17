import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Manager} from './manager';
import{map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Manager'

  getManager(Id: number) {  
    return this.http.get(this.url + '/getManager/' + Id).pipe(map(result => result));  
  } 

  getAllManagers(): Observable<Manager[]> {  
    return this.http.get<Manager[]>(this.url + '/getAllManagers');  
  }

  searchManager(name: string, surname: string){  
    return this.http.get(this.url + '/searchManager?name='+name+'&surname='+surname).pipe(map(result => result));  
  } 

  createManager(Manager: Manager): Observable<Manager> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Manager>(this.url + '/createManager',  
    Manager, httpOptions);  
  } 

  

  updateManager(Manager: Manager): Observable<Manager> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Manager>(this.url + '/updateManager',  
    Manager, httpOptions);  
  }

  deleteManager(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/deleteManager?id=' + Id,  
 httpOptions); 
}
}
