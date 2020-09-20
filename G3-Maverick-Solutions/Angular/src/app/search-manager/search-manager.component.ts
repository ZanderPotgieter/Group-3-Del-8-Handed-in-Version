import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {Manager} from '../manager-management/manager';
import {Employee} from '../employee-management/model/employee.model';
import {User} from '../employee-management/model/user.model';
import {Container} from '../container-management/container';
import {ManagerService} from '../manager-management/manager.service';

@Component({
  selector: 'app-search-manager',
  templateUrl: './search-manager.component.html',
  styleUrls: ['./search-manager.component.scss']
})
export class SearchManagerComponent implements OnInit {

  constructor(private api:ManagerService,private router: Router) { }
  allowEdit:boolean = false;
  manager: Manager = new Manager();
  user: User = new User();
  employee: Employee = new Employee();

  
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
 showSearch: boolean = true;
 showResults: boolean = false;
 showConatinerSelect: boolean = false;


 name : string;
 surname : string;

  ngOnInit(): void {
  }

  searchManager(){
    this.api.searchManager(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.responseMessage = res.Message;
        alert(this.responseMessage)}
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
      }

      
      this.showSearch = false;
      this.showResults = true;
      
    })

  }

  updateManager(){
    this.manager.UserID = this.user.UserID;
     this.api.updateManager(this.manager).subscribe( (res:any)=> {
       console.log(res);
       if(res.manager.Message){
       this.responseMessage = res.manager.Message;}
       alert(this.responseMessage)
       this.router.navigate(["manager-management"])
     })
 
   }

   addContainer(val: any){
    this.showlist(val);
  }

  showlist(val: any){
    this.selectedContainers.push(val);
    this.manager.Containers.push(val);
    
  }

  gotoManagerManagement(){
    this.router.navigate(['manager-management']);

  }

  
  deleteManager(){
    this.api.deleteManager(this.manager.ManagerID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["manager-management"])
    })

  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

}
