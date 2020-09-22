import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {Manager} from '../manager-management/manager';
import {Employee} from '../employee-management/model/employee.model';
import {User} from '../employee-management/model/user.model';
import {Container} from '../container-management/container';
import {ManagerService} from '../manager-management/manager.service';



@Component({
  selector: 'app-create-manager',
  templateUrl: './create-manager.component.html',
  styleUrls: ['./create-manager.component.scss']
})
export class CreateManagerComponent implements OnInit {

  constructor(private api:ManagerService, private router: Router) { }
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


  
  

  showTable: boolean = false;
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
      //if(res.Message != null){
      //this.responseMessage = res.Message;
     // alert(this.responseMessage);
         /* //Get Manager Details
        this.manager.ManagerID = res.manager.ManagerID;
        this.manager.ManQualififaction = res.manager.ManQualififaction;
        this.manager.ManNationality = res.manager.ManNationality;
        this.manager.ManIDNumber = res.manager.ManIDNumber;
        this.manager.ManNextOfKeenFName = res.manager.ManNextOfKeenFName;
        this.manager.ManNextOfKeenCell = res.manager.ManNextOfKeenCell;
        this.manager.containersManaged =  res.containersManaged;

        if(res.containersManaged != null)
        {
          this.selectedContainers = res.containersManaged;
        }*/

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
        this.containers = res.containers //;}

     // else (res.manager != null)
      //{
       // this.responseMessage = res.Message;
      //alert("Manager Profile Already Exists");
      //}
  
      this.showSearch = false;
      this.showResults = true;
      
    })

  }


  createManager(){
  

    /*this.selectedContainers.forEach(element => {
      this.manager.containersManaged.push(element);   
       });*/

       this.manager.UserID = this.user.UserID;
      this.api.createManager(this.manager).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["manager-management"])
    })

  }
  gotoManagerManagement(){
    this.router.navigate(['manager-management']);

  }



  addContainer(val: Container){
    this.showlist(val);
  }

  showlist(val: Container){
    this.selectedContainers.push(val);
    this.manager.Containers.push(val);
    

    this.showTable = true;
  }

  cancel(){
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }
}
