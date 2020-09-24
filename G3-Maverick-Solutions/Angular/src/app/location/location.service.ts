import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';  
import { HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Location } from './location'; 
import { AreaVM } from './area-vm'; 
import { StatusVm} from './status-vm';   
import { ContainerVm} from './container-vm';

@Injectable({
  providedIn: 'root'
})
export class LocationService {  
  constructor(private http: HttpClient) { }  
  url = 'https://localhost:44399/Api/Location';  

  areaList: AreaVM[];
  statusList: StatusVm[];
  containerList: ContainerVm[];

  
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


  //Get Area
  getAreas()
  {
    return this.http.get('https://localhost:44399/Api/Areas').toPromise();
  }

  //get status
  getStatuses() 
  {
    return this.http.get('https://localhost:44399/Api/Location_Status').toPromise();

  }

    //get containers
    getContainers() 
    {
      return this.http.get('https://localhost:44399/Api/Container/GetAllContainers').toPromise();
  
    }


}
