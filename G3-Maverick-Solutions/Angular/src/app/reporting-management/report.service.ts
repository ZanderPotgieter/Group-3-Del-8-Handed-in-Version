import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


export class ReportService {
  
  url = "https://localhost:44399/api/Reporting/"

  constructor(private http: HttpClient) { }

  getCreditorReportData()
  {
    return this.http.get(this.url + "getCreditorReportData").pipe(map(result => result))
  }

  getSalesReportData()
  {
    return this.http.get(this.url + "getSalesReportData").pipe(map(result => result))
  }

  getCustomerOrderReportData(selectedOption: number)
  {
    return this.http.get(this.url + "getCustomerOrderReportData?selectedOptionID=" + selectedOption).pipe(map(result => result))
  }

  getSupplierOrderReportData(selectedOption: number)
  {
    return this.http.get(this.url + "getSupplierOrderReportData?selectedOptionID=" + selectedOption).pipe(map(result => result))
  }

  getMarkedOffProductReportData()
  {
    return this.http.get(this.url + "getMarkedOffProductReportData").pipe(map(result => result))
  }

  getProductReportData()
  {
    return this.http.get(this.url + "getProductReportData").pipe(map(result => result))
  }

  getDonationReportData(selectedOption: number)
  {
    return this.http.get(this.url + "getDonationReportData?selectedOptionID=" + selectedOption).pipe(map(result => result))
  }
}
