import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Area } from '../model/area.model';
import { AreaStatus } from '../areastatus';
import { Province } from 'src/app/Province/province';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class AreaserviceService {
  url = 'https://localhost:44399/API/Area'
  constructor(private http: HttpClient) { }

  getAllProvinces(): Observable<Province[]> {  
    return this.http.get<Province[]>('https://localhost:44399/Api/Province' + '/getAllProvinces');  
  }
  getAllAreaStatus(): Observable<AreaStatus[]> {  
    return this.http.get<AreaStatus[]>(this.url + '/GetAllAreaStatus');  
  } 

  getAllAreas() {  
    return this.http.get(this.url + '/getAllAreas');  
  } 

  getAreaByID(id: number){  
    return this.http.get(this.url + '/getAreaByID/' + id);  
  } 

  addArea(Area: Area): Observable<Area> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Area>(this.url + '/addArea',  
    Area, httpOptions);  
  }   

  updateArea(newArea: Area): Observable<Area>   {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Area>(this.url + '/updateArea',  
    newArea, httpOptions);  
  } 

  deleteArea(id: number) {   
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<Area>(this.url + '/deleteArea?id='+id, httpOptions);  
  } 

  searchArea(name: string){  
    return this.http.get(this.url + '/searchArea?name='+name).pipe(map(result => result));  
  } 

}
