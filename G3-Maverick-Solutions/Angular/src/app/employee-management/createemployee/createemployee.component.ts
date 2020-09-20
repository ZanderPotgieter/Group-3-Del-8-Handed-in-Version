import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-management/service/employee.service';
import { Employee} from '../model/employee.model';
import { Router } from '@angular/router';
import { NgForm , Validators, FormGroup, FormBuilder, NgModel} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-createemployee',
  templateUrl: './createemployee.component.html',
  styleUrls: ['./createemployee.component.scss']
})
export class CreateemployeeComponent implements OnInit {
  btnLabel: string;
  employeeForm: FormGroup;

  formModel = {
    EmployeeName: '',
    EmployeeSurname: '' 
  };

  variable = false;
  add = false;
  main = true;

  formModel1 = {
    EmpName: '',
    EmpCellNo: '',
    EmpSurname: '',
    EmpEmail: '' ,
    EmpStartDate:'',
    EmpShiftsCompleted:''
  };

  constructor( public service: EmployeeService,private router: Router,private toastr: ToastrService, private fb: FormBuilder) { }

  ngOnInit(){
    this.btnLabel = 'Create Employee';
    this.employeeForm = this.fb.group({
      EmployeeName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z]')]]
    });
  }

  


  submitEmployee(form: NgForm) {
     console.log(this.formModel1);
      this.service.postEmployee(form.value).subscribe((res: any) => {
        console.log(res);
        if (res !='Error' && res !='Nothing')
        {
          console.log(res);
          this.ngOnInit();
          this.main = true;
          this.variable = false;
          this.add = false;
          this.toastr.success('Success', 'Employee Updated :)');
        }
        else
        {
          console.log(res);
          this.toastr.error('Uh Oh ', 'Something Went Wrong. Please Try again');
        }
      });  
  }

  onSubmit(form: NgForm) {
    this.service.search(form.value).subscribe(
      (res: any) => {
        if(res =='NotFound')
        {
          console.log(res);
          this.variable = false;
          this.main = false;
          this.add = true;
          this.toastr.error('UH Oh', ' No Employee Found :( ');
        }
        else
        {
          this.service.empList = res as Employee[];
          console.log(this.service.empList);
          this.variable = true;
          this.main = false;
          this.toastr.success('Success', 'Employee Found :)');
        }
    });
  }


  clear()
  {
    window.location.reload()
  }
}
