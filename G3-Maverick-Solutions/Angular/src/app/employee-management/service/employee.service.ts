import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../model/employee.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  

  constructor( private http: HttpClient ) { }

  url = 'https://localhost:44399/API/Employee'

  getEmployee(Id: number) {  
    return this.http.get(this.url + '/getEmployee/' + Id).pipe(map(result => result));  
  } 

  getAllEmployees(): Observable<Employee[]> {  
    return this.http.get<Employee[]>(this.url + '/getAllEmployees');  
  }

  searchEmployee(name: string, surname: string){  
    return this.http.get(this.url + '/searchEmployee?name='+name+'&surname='+surname).pipe(map(result => result));  
  } 

  createEmployee(Manager: Employee): Observable<Employee> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.post<Employee>(this.url + '/createEmployee',  
    Manager, httpOptions);  
  } 

  updateEmployee(employee: Employee): Observable<Employee> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.put<Employee>(this.url + '/updateEmployee',  
    employee, httpOptions);  
  }

  deleteEmployee(Id: number): Observable<number> {  
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json'}) };  
    return this.http.delete<number>(this.url + '/deleteEmployee?id=' + Id,  
 httpOptions); 
}

getAll()
{
  return this.http.get(this.url + '/getAll').pipe(map(result => result)); 
}

getImage(employeeID: number)
{
  return this.http.get(this.url + '/getImage?employeeID=' + employeeID);
}

postFile(caption: string, fileToUpload: File, employeeID: number)
{
  const endpoint = 'https://localhost:44399/API/Employee/uploadImage?employeeID=';
  const formData: FormData = new FormData();
  formData.append('Image', fileToUpload, fileToUpload.name)
  formData.append('ImageCation', caption);
  return this.http.post(endpoint + employeeID, formData);

}

}

