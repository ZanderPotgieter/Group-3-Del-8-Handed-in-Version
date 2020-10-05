import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs'; 

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = "https://localhost:44399/Api/Admin/"

  constructor(private http: HttpClient) { }

  getSaleReportData()
  {
    return this.http.get(this.url + "getSaleReportData").pipe(map(result => result))
  }
}
