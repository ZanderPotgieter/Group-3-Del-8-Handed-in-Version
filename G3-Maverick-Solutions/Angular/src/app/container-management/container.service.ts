import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Container} from './container';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private http: HttpClient) { }

  url = 'https://localhost:44399/Api/Container'

  getAllContainers(): Observable<Container[]> {  
    return this.http.get<Container[]>(this.url + '/GetAllContainers');  
  }
  
  getContainer(Id: number): Observable<Container> {  
    return this.http.get<Container>(this.url + '/GetContainer/' + Id);  
  } 
  
  searchContainer(name: string): Observable<Container> {  
    return this.http.get<Container>(this.url + '/SearchContainer?name=' + name);  
  }  

  addContainer(Container: Container): Observable<Container> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Container>(this.url + '/AddContainer',  
    Container, httpOptions);  
  }  

  updateContainer(Container: Container): Observable<Container> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Container>(this.url + '/UpdateContainer',  
    Container, httpOptions);  
  }  

  deleteContainer(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/DeleteContainer?id=' + Id,  
 httpOptions);  
  } 



}
