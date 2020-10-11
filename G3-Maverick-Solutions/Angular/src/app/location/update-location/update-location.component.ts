import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '../location';
import { NgModule } from '@angular/core';
import {LocationService} from '../location.service';
import { AreaVM } from './../area-vm'; 
import { StatusVm} from './../status-vm'; 
import { ContainerVm} from './../container-vm'; 

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {

  constructor(private api: LocationService, private router: Router) { }
  location : Location= new Location();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearchEdit: boolean = true;
  showResultsEdit: boolean = false;
  name : string;
  statuses: StatusVm[];
  areas: AreaVM[];
  containers: ContainerVm[];

  ngOnInit(): void {
    /* this.resetForm();
    this.refreshList(); */
    this.api.getStatuses().subscribe(value => {
      if (value!=null){
        this.statuses = value;
      }
    });

    this.api.getAreas().subscribe(value => {
      if (value!=null){
        this.areas = value;
      }
    });

    this.api.getContainers().subscribe(value => {
      if (value!=null){
        this.containers = value;
      }
    });
  }


  searchLocationEdit(){
    this.api.searchLocation(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message == "Record Not Found"){
      this.responseMessage = res.Message;
      alert(res.Message);
      this.showSearchEdit = true;
      this.showResultsEdit = false;
    
    }
      else{
        console.log(res);
          this.location.LocationID = res.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.LocationStatusID;
          this.location.AreaID = res.AreaID;
          this.location.ContainerID = res.ContainerID;
          this.showSearchEdit = false;
          this.showResultsEdit = true;
      }     
    })

  }

  updateLocation(){
    this.api.updateLocation(this.location).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["gps-management"])
    })

  }


  /* refreshList() {
    this.api.getAreas().then(res => this.api.areaList = res as AreaVM[]);
    //this.api.getStatuses().then(res => this.api.statusList = res as StatusVm[]);
    this.api.getContainers().then(res => this.api.containerList = res as ContainerVm[]);

  }

  resetForm() {
    this.api.areaList = [];
    this.api.statusList = [];
    this.api.containerList = [];
  } */

  gotoGPSManagement() {
    this.router.navigate(['gps-management']);
     }
   


}
