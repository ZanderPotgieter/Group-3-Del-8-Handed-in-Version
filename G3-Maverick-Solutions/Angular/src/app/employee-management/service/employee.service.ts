import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../model/employee.model';
import { SearchEmployee } from '../model/search-employee';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  //add for storing employee info 
  empData: Employee;
  empsearchData:SearchEmployee ;
  empList: Employee[];

  constructor(private fb: FormBuilder, private http: HttpClient ) { }


  search(formData) {
    return this.http.post(environment.ApiUrl  + '/Search/searchEmployee', formData);
  }
  
  postEmployee(formData) {
    return this.http.post(environment.ApiUrl + '/AppEmployees', formData);
  }

  deleteEmployee(formData) {
    return this.http.post(environment.ApiUrl + '/Delete/deleteEmployee', formData);
  }

}
