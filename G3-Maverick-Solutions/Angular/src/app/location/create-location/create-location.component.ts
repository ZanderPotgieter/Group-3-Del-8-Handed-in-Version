import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { Location } from '../location';
import { AreaVM } from './../area-vm'; 
import { StatusVm} from './../status-vm'; 
import { ContainerVm} from './../container-vm'; 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {
  http: any;

  constructor(public api: LocationService, private router: Router, private fb: FormBuilder) { }
  location : Location = new Location();
  responseMessage: string = "Request Not Submitted";
  angForm: FormGroup;
  statuses: StatusVm[];
  areas: AreaVM[];
  containers: ContainerVm[];

  ngOnInit(): void {
    /* //this.resetForm();
    //this.refreshList();
    console.log(this.api.areaList);
    console.log(this.api.statusList);
    console.log(this.api.containerList); */

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

    this.angForm= this.fb.group({  
      LocName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
  
      AreaName: [''],
      ContainerName: [''],
      StatusName: [''],
      AreaID: ['', [Validators.required]],
      ContainerID: [''],
      StatusID: [''],
      Locname: ['', [Validators.required]],
    });
  }

  addLocation(){
    this.api.addLocation(this.location).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["gps-management"])
    })

  }

  gotoGPSManagement(){
    this.router.navigate(['gps-management']);
  }


  //ADD FOR LOCATION AREA

 /*  refreshList() {
    this.api.getAreas().then(res => this.api.areaList = res as AreaVM[]);
    this.api.getStatuses().then(res => this.api.statusList = res as StatusVm[]);
    this.api.getContainers().then(res => this.api.containerList = res as ContainerVm[]);

  }

  resetForm() {
    this.api.areaList = [];
    this.api.statusList = [];
    this.api.containerList = [];
  } */

}


