import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-management/service/employee.service';
import { Employee} from '../model/employee.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-searchemployee',
  templateUrl: './searchemployee.component.html',
  styleUrls: ['./searchemployee.component.scss']
})
export class SearchemployeeComponent implements OnInit {
  isSearchError = false;
  constructor(private service: EmployeeService, private router: Router) { }

  ngOnInit(){
    this.resetForm();
  }

  resetForm() {
    this.service.empsearchData = 
    {
      UserID: 0,
      EmpName:'',
      EmpSurname: '',
    };
    this.service.empList = [];
  }

  submitEmployee() {
    
    this.service.postEmployee(this.service.empData).subscribe(res => {
      console.log(res);
      this.resetForm();
    });  
}

}
