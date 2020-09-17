import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../model/employee.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  //add for storing employee info 
  employeeData: Employee;
  employeeList: Employee[];

  constructor( private http: HttpClient ) { }
  //CRUD Employee
  getEmployee() {
    return this.http.get(environment.ApiUrl + '/Employee').toPromise();
  }

  postEmployee(obj: Employee) {
    return this.http.post(environment.ApiUrl + '/Employee', obj);
  }

  putEmployee(obj: Employee) {
    return this.http.put(environment.ApiUrl + '/Employee/' + obj.EmployeeID, obj);
  }

  deleteEmployee(id: number) {
    return this.http.delete(environment.ApiUrl + '/Employee/' + id);
  }

}
