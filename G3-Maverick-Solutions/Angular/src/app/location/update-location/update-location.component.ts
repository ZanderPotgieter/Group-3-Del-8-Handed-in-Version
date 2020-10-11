import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '../location';
import { NgModule } from '@angular/core';
import {LocationService} from '../location.service';
import { AreaVM } from './../area-vm'; 
import { StatusVm} from './../status-vm'; 
import { ContainerVm} from './../container-vm'; 
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-update-location',
  templateUrl: './update-location.component.html',
  styleUrls: ['./update-location.component.scss']
})
export class UpdateLocationComponent implements OnInit {

  constructor(private api: LocationService, private fb: FormBuilder, private router: Router, private dialogService: DialogService ) { }
  location : Location= new Location();
  responseMessage: string = "Request Not Submitted";
  locationNull : boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearchEdit: boolean = true;
  showResultsEdit: boolean = false;
  name : string;
  statuses: StatusVm[];
  areas: AreaVM[];
  containers: ContainerVm[];
  angForm: FormGroup;

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

    this.angForm= this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
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


  searchLocationEdit(){
    this.api.searchLocation(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
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
    this.dialogService.openConfirmDialog('Are you sure you want to update this location?')
    .afterClosed().subscribe(res=> {
      if (res){
        this.api.updateLocation(this.location).subscribe( (res:any)=> {
          console.log(res);
          if(res.Message)
          {
            this.dialogService.openAlertDialog(res.Message);
          }
          this.router.navigate(["gps-management"])
        })
      }
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
