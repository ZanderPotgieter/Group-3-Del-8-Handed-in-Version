import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-management/service/employee.service';
import { Employee} from '../model/employee.model';
import { Router } from '@angular/router';
import {  Validators, FormGroup, FormBuilder, } from '@angular/forms';
import { User } from '../model/user.model';


@Component({
  selector: 'app-createemployee',
  templateUrl: './createemployee.component.html',
  styleUrls: ['./createemployee.component.scss']
})
export class CreateemployeeComponent implements OnInit {

  constructor( public api: EmployeeService,private router: Router , private fb: FormBuilder) { }

  empForm: FormGroup;
  addForm: FormGroup;

  user: User = new User();
  employee: Employee = new Employee();
  responseMessage: string = "Request Not Submitted";
  dupMessage: string = "Employee already exists";

  showTable: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  showNewEmp: boolean = false;
  showButton: boolean = true;
  showDate: boolean = true;
  showText: boolean = true;

  name : string;
  surname : string;

  ngOnInit(){
     this.empForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      UserName: [''],
      UserSurname: [''],
      UserCell: [''],
      UserEmail: [''],

      empShiftsCompleted: ['',[Validators.required]],
      empStartDate: ['',[Validators.required]],
    }); 
  }

  searchEmployee(){
    this.api.searchEmployee(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      
        //Get User Details
        this.user.UserID = res.user.UserID;
        this.user.UserName = res.user.UserName;
        this.user.UserSurname = res.user.UserSurname;
        this.user.UserCell = res.user.UserCell;
        this.user.UserEmail = res.user.UserEmail;

        //Get Employee Details
        if (this.employee== null) //check if employee exist
        {
          this.showButton = true;
          /* this.showDate = true;
          this.showText = false; */
        }
        else //display employee details if record exists
        { 
          //alert(this.dupMessage);
          this.employee.EmployeeID = res.employee.EmployeeID;
          this.employee.EmpShiftsCompleted = res.employee.EmpShiftsCompleted;
          this.employee.EmpStartDate = res.employee.EmpStartDate;

          this.showButton = false;
         /*  this.showDate = false;
          this.showText = true; */
        }

        
  
      this.showSearch = false;
      this.showResults = true;
      this.showNewEmp = true;
      
    })

  }


  createEmployee(){
      this.employee.UserID = this.user.UserID;
      this.api.createEmployee(this.employee).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null)
      {
      this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["employee-management"])
    })

  }
  gotoEmployeeManagement(){
    this.router.navigate(['employee-management']);

  }

  cancel(){
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
    this.showNewEmp = false;
  }

  


  


  clear()
  {
    window.location.reload()
  }
}
