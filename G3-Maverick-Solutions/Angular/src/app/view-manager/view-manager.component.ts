import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {Manager} from '../manager-management/manager';
import {Employee} from '../employee-management/model/employee.model';
import {User} from '../employee-management/model/user.model';
import {Container} from '../container-management/container';
import {ManagerService} from '../manager-management/manager.service';

import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DialogService } from '../shared/dialog.service';
@Component({
  selector: 'app-view-manager',
  templateUrl: './view-manager.component.html',
  styleUrls: ['./view-manager.component.scss']
})
export class SearchManagerComponent implements OnInit {

  constructor(private api:ManagerService,private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }
  allowEdit:boolean = true;
  manager: Manager = new Manager();
  user: User = new User();
  employee: Employee = new Employee();
  managers: User[] = [];

  empForm: FormGroup;

  
  containerSelected: Container = new Container();
  selection:number;
  responseMessage: string = "Request Not Submitted";

  //to store list of all containers
  containers: Container[] = [];

 //selected containers to save
 selectedContainers: Container[] = [];

 showSave: boolean = false;
 showTable: boolean = true;
 showButtons: boolean = true;
 inputEnabled:boolean = true;
 showResults: boolean = false;
 showConatinerSelect: boolean = false;

 showViewAll: boolean = false;
 showSearch: boolean = false;


 name : string;
 surname : string;

  ngOnInit(): void {
    this.empForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z]*')]],
      UserName: [''],
      UserSurname: [''],
      UserCell: [''],
      UserEmail: [''],
      caption: [''],
      captionCV: [''],

      
      EmpShiftsCompleted: [''],
      EmployeeStartDate: [''],

      ManNationality: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      ManQualification: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')]],
      ManIDNumber: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(13), Validators.pattern('[0-9]*')]],
      ManNextOfKeenCell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      ManNextOfKeenFName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
      container: ['', [Validators.required]]
    }); 

  }

  search(){
    this.showSearch = true;
    this.showViewAll = false;
   
  }

  viewAll(){
    this.showSearch = false;
    this.showViewAll = true;
    this.api.getAllManagers().subscribe((res:any)=>{
      console.log(res);
      this.managers = res.managers;
    })
  }

  view(ndx: number){
    this.name = this.managers[ndx].UserName;
    this.surname = this.managers[ndx].UserSurname;
    this.api.searchManager(this.managers[ndx].UserName,this.managers[ndx].UserSurname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage)}
        else{
        //Get Manager Details
        this.manager.ManagerID = res.manager.ManagerID;
        this.manager.ManQualification = res.manager.ManQualification;
        this.manager.ManNationality = res.manager.ManNationality;
        this.manager.ManIDNumber = res.manager.ManIDNumber;
        this.manager.ManNextOfKeenFName = res.manager.ManNextOfKeenFName;
        this.manager.ManNextOfKeenCell = res.manager.ManNextOfKeenCell;
        this.manager.Containers =  res.Containers;

        if(res.containersManaged != null)
        {
          this.selectedContainers = res.containersManaged;
        }
        

        //Get User Details
        this.user.UserID = res.user.UserID;
        this.user.UserName = res.user.UserName;
        this.user.UserSurname = res.user.UserSurname;
        this.user.UserCell = res.user.UserCell;
        this.user.UserEmail = res.user.UserEmail;

        if(res.employee != null){
          //Get Employee Details
        this.employee.EmployeeID = res.employee.EmployeeID;
        this.employee.EmpShiftsCompleted = res.employee.EmpShiftsCompleted;
        this.employee.EmpStartDate = res.employee.EmpStartDate;
        }
        

        //Get list Of Containers
        this.containers = res.containers;
        
      this.showSearch = false;
      this.showResults = true;
      
      }

      
    })
    
  }

  searchManager(){
    this.api.searchManager(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.responseMessage = res.Message;
        this.dialogService.openAlertDialog(this.responseMessage);
       // alert(this.responseMessage)
      }
        else{
        //Get Manager Details
        this.manager.ManagerID = res.manager.ManagerID;
        this.manager.ManQualification = res.manager.ManQualification;
        this.manager.ManNationality = res.manager.ManNationality;
        this.manager.ManIDNumber = res.manager.ManIDNumber;
        this.manager.ManNextOfKeenFName = res.manager.ManNextOfKeenFName;
        this.manager.ManNextOfKeenCell = res.manager.ManNextOfKeenCell;
        this.manager.Containers =  res.Containers;

        if(res.containersManaged != null)
        {
          this.selectedContainers = res.containersManaged;
        }

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

        //Get list Of Containers
        this.containers = res.containers;
        
      this.showSearch = false;
      this.showResults = true;
      
      }

      
    })

  }

  enableInputs(){
    this.showSave = true;
    this.showButtons = false;
    this.allowEdit = false;

  }


  updateManager(){
    this.manager.UserID = this.user.UserID;
     this.api.updateManager(this.manager).subscribe( (res:any)=> {
       console.log(res);
       if(res.Message){
       this.responseMessage = res.Message;}
       this.dialogService.openAlertDialog(this.responseMessage)
       //alert(this.responseMessage)
       this.router.navigate(["manager-management"])
     })
 
   }

   addContainer(val: Container){
     if(val != null){
      this.showlist(val);
     }
    
  }


  showlist(val: Container){
    if(val != null){
    this.selectedContainers.push(val);
    this.manager.Containers.push(val);}
    
  }

  remove(ndx: number){
   this.containerSelected = this.containers[ndx];
   
   this.spliceContainer(ndx);
  }

  spliceContainer(ndx: number){
    this.containers.splice(ndx,1);

  }

  gotoManagerManagement(){
    this.router.navigate(['manager-management']);

  }

  
  deleteManager(){
    this.dialogService.openConfirmDialog('Delete Manager Profile?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.deleteManager(this.manager.ManagerID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;
      this.dialogService.openAlertDialog(this.responseMessage)
      //alert(this.responseMessage)
      this.router.navigate(["manager-management"])}
      if(res.Error){

      }

      
    })
  }})


  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

}
