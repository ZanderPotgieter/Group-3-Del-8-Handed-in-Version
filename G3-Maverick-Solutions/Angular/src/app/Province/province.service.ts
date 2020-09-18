import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from './province'

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {
  
  url = 'https://localhost:44399/api/Province';    //address of REST API server

  /* const httpOptions = { 
    headers: new HttpHeaders ({
      'Content-Type': 'application/json'
    })
  }  */
  
  constructor( private http: HttpClient) { }

  getAllProvinces(): Observable<Province[]>
  {
    return this.http.get<Province[]>(this.url + '/getAllProvinces');
  }

  getProvinceById(provinceID: number) : Observable<Province>
  {
    return this.http.get<Province>(this.url + '/getProvinceByID?id=' + provinceID);
  }

  searchProvince(name: string) : Observable<Province>
  {
    return this.http.get<Province>(this.url + '/searchProvince?name=' + name);
  }

  addProvince(province: Province) : Observable<Province>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.post<Province>(this.url + '/addProvince/', province, httpOptions);
  }

  updateProvince(province: Province) : Observable<Province>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.put<Province>(this.url + '/updateProvince/', province, httpOptions);
  }

  removeProvince(id: number) : Observable<number>
  {
    const httpOptions = { headers: new HttpHeaders ({ 'Content-Type': 'application/json'}) };
    return this.http.delete<number>(this.url + '/removeProvince?id=' + id, httpOptions);
  }

  




  

 /* deleteSupplier(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/deleteSupplier?id=' + Id,  
 httpOptions);  
  } */

  /* errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent)
    {
      //get error on the client side
      errorMessage = error.error.message;
    }
    else 
    {
      //get error on the server side 
      errorMessage = 'Error Code: ${error.status}\nMessage: ${error.message}';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  } */

}

