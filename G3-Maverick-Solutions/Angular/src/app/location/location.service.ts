import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Location } from './location';   

@Injectable({
  providedIn: 'root'
})
export class LocationService {  
  constructor(private http: HttpClient) { }  
  url = 'https://localhost:44399/Api/Location';  
  
  getAllLocations(): Observable<Location[]> {  
    return this.http.get<Location[]>(this.url + '/getAllLocations');  
  }
  
  getLocation(Id: number): Observable<Location> {  
    return this.http.get<Location>(this.url + '/getLocation/' + Id);  
  } 

  addLocation(Location: Location): Observable<Location> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Location>(this.url + '/addLocation',  
    Location, httpOptions);  
  }  

  searchLocation(name: string): Observable<Location> {  
    return this.http.get<Location>(this.url + '/searchLocation?name=' + name);  
  }  

  updateLocation(Location: Location): Observable<Location> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Location>(this.url + '/updateLocation',  
    Location, httpOptions);  
  }  


}
