import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../employee-management/service/employee.service';
import { Employee} from '../model/employee.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {User} from '../model/user.model';
import {Directive, HostBinding, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { EmployeeCV } from '../model/employee-cv';
import { EmployeePicture } from '../model/employee-picture';

import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-searchemployee',
  templateUrl: './searchemployee.component.html',
  styleUrls: ['./searchemployee.component.scss']
})
export class SearchemployeeComponent implements OnInit {
 
  isSearchError = false;
  user: User = new User();
  employee: Employee = new Employee();
  allowEdit:boolean = false;
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  showBar: boolean = true;
  showAll: boolean = false;
  showUpload: boolean = false;
  showImg: boolean = false;
  showCv: boolean = false;

  imageUrl: string = "/assets/img/DefaultUser.jpg";

  employees: Employee[] = [];

  name : string;
  surname : string;

  empForm: FormGroup;
  showImgs: boolean = false;
  showCvs: boolean = false;
  empPicture: EmployeePicture = new EmployeePicture();
  empCV: EmployeeCV = new EmployeeCV();
  employeeCvs: EmployeeCV[] = [];
  employeePictures: EmployeePicture[] = [];

  constructor(private api: EmployeeService, private router: Router, private sanitizer: DomSanitizer, private fb: FormBuilder) { }

  ngOnInit(){
    this.empForm= this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      surname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      UserName: [''],
      UserSurname: [''],
      UserCell: [''],
      UserEmail: [''],
      caption: [''],
      captionCV: [''],

      EmpShiftsCompleted: ['',[Validators.required]],
      EmpStartDate: ['',[Validators.required]],
       
    });  
  }

  public getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
}

  

  cv()
  {
    this.showCv = true;
    this.showSearch = false
    this.showUpload =true;
    this.showResults = false;
    this.showAll = false;
    this.showImgs = false;
    this.showCvs = false;
    this.showBar = true;
    this.showUpload = false;
  }


  getImg()
  {
    this.api.getImage(this.employee.EmployeeID).subscribe (( res: any) => {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage)
      }
      else{
        this.imageUrl = res.Image;

        this.showImg = true;
        this.showSearch = false
        this.showUpload =true;
        this.showResults = false;
        this.showAll = false;
        this.showImgs = false;
        this.showCvs = false;
      }

    })

    
  }

  viewAll()
  {
    this.api.getAll().subscribe( (res:any)=> {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage)
      }
      else
      {

        this.user = res.user;
        this.employee = res.employee;
       /*  //Get User Details
        this.user.UserID = res.user.UserID;
        this.user.UserName = res.user.UserName;
        this.user.UserSurname = res.user.UserSurname;
        this.user.UserCell = res.user.UserCell;
        this.user.UserEmail = res.user.UserEmail;

        //Get Employee Details
        this.employee.EmployeeID = res.employee.EmployeeID;
        this.employee.EmpShiftsCompleted = res.employee.EmpShiftsCompleted;
        this.employee.EmpStartDate = res.employee.EmpStartDate;*/
        this.showAll = true;
        this.showResults= false; 
        this.showUpload = false;
        this.showSearch = false;
        
        this.showImgs = false;
        this.showCvs = false;
        this.showBar = true;
        this.showUpload = false;
      }
    })
  
  }

  search()
  {
    this.showSearch = true;
    this.showResults = false;
    this.showButtons = true;
    this.showUpload =false;
    
    this.showImgs = false;
    this.showCvs = false;
    this.showBar = true;
    this.showUpload = false;
  }

  searchEmployee(){
    this.api.searchEmployee(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Error != null){
        this.responseMessage = res.Error;
        alert(this.responseMessage)
      }
      else
      {
        
      //Get User Details
      this.user.UserID = res.user.UserID;
      this.user.UserName = res.user.UserName;
      this.user.UserSurname = res.user.UserSurname;
      this.user.UserCell = res.user.UserCell;
      this.user.UserEmail = res.user.UserEmail;

      //Get Employee Details
      this.employee.EmployeeID = res.employee.EmployeeID;
      this.employee.EmpShiftsCompleted = res.employee.EmpShiftsCompleted;
      this.employee.EmpStartDate = res.employee.EmpStartDate;

      }
      this.showSearch = false;
      this.showResults = true;
      this.showUpload = true;
      
      this.showImgs = false;
      this.showCvs = false;
      this.showBar = true;
      this.showUpload = false;
    })

  }

  update()
  {
    this.showSave = true;
    this.showButtons = false;
    this.inputEnabled = false;
    
    this.showImgs = false;
    this.showCvs = false;
    this.showBar = true;
    this.showUpload = false;
  }

  Save(){
    this.employee.UserID = this.user.UserID;
     this.api.updateEmployee(this.employee).subscribe( (res:any)=> {
       console.log(res);
       if(res.Error !=null)
       {
       this.responseMessage = res.Error;
       alert(this.responseMessage)
       }
       else if(res.Message != null)
       {
        this.responseMessage = res.Message;
        alert(this.responseMessage)
       }
       this.router.navigate(["employee-management"])
     })
 
   }

   view(userN: string, userS: string){
    this.name = userN;
    this.surname = userS;
    this.searchEmployee();
  }

  

   

  gotoEmployeeManagement(){
    this.router.navigate(['employee-management']);

  }

  
  deleteEmployee(){
    this.api.deleteEmployee(this.employee.EmployeeID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Error)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage);
      }
      else if(res.Message)
      {
        this.responseMessage = res.Message;
        alert(this.responseMessage);
      }
      this.router.navigate(["employee-management"])
    })

  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = false;
    this.showResults = false;
    this.showAll = false;
    
    this.showImgs = false;
    this.showCvs = false;
    this.showBar = false;
    this.showUpload = false;
  }

  getImages()
  {
    this.api.getImages(this.employee.EmployeeID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage)
      }
      else
      {

        this.empPicture = res.Img;
        this.showAll = false;
        this.showResults= false; 
        this.showUpload = false;
        this.showSearch = false;
        this.showImgs = false;
        this.showCvs = false;
        this.showBar = false;
        this.showUpload = true;
      }
    });
  }

  getCvs()
  {
    this.api.getCvs(this.employee.EmployeeID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage)
      }
      else
      {

        this.empCV = res.EmployeeCVs;
        this.showAll = false;
        this.showResults= false; 
        this.showUpload = false;
        this.showSearch = false;
        this.showImgs = false;
        this.showCvs = false
        this.showBar = false;
        this.showUpload = true;
      }
    })
  }

}
