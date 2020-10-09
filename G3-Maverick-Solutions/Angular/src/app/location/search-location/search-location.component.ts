import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '../location';
import { NgModule } from '@angular/core';
import {LocationService} from '../location.service';
import { AreaVM } from './../area-vm'; 
import { StatusVm} from './../status-vm'; 
import { ContainerVm} from './../container-vm'; 
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';


var inputEnabled = false;

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit {

  constructor(private api: LocationService, private router: Router, private fb: FormBuilder ) { }
  location : Location= new Location();
  locations: Location[];
  responseMessage: string = "Request Not Submitted";
  angForm: FormGroup;

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showOptions: boolean = true;
  showResults: boolean = false;
  showSearchEdit: boolean = true;
  showResultsEdit: boolean = false;
  showViewAll: boolean = false;
  name : string;
  statuses: StatusVm[];
  areas: AreaVM[];
  containers: ContainerVm[];


  ngOnInit(): void {
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
      LocName: [''], 
      AreaName: [''],
      ContainerName: [''],
      StatusName: [''],
      AreaID: ['', [Validators.required]],
      ContainerID: [''],
      StatusID: [''],
      Locname: ['', [Validators.required]],
    });
  }

  gotoSearch()
  {
    this.showOptions = false;
    this.showSearch = true;
    this.showSearchEdit = false;
    this.showResultsEdit = false;
    this.showResults = false;
  }

  gotoGPSManagement() {
 this.router.navigate(['gps-management']);
  }

  gotoUpdate() {
    this.api.searchLocation(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message == "Record Not Found"){
      this.responseMessage = res.Message;
      alert(res.Message);
      this.showSearch = true;
      this.showResults = false;
      this.showResultsEdit = false;
    
    }
      else{
        console.log(res);
          this.location.LocationID = res.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.LocationStatusID;
          this.location.AreaID = res.AreaID;
          this.location.ContainerID = res.ContainerID;
          this.showSearch = false;
          this.showResults = false;
          this.showResultsEdit = true;
      }     
    })
  }

  searchLocation(){
    this.api.searchLocation(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message == "Record Not Found"){
      this.responseMessage = res.Message;
      alert(res.Message);
      this.showSearch = true;
      this.showResults = false;
      this.showResultsEdit = false;
    
    }
      else{
          this.location.LocationID = res.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.Location_Status.LSDescription;
          this.location.AreaID = res.Area.ArName;
          this.location.ContainerID = res.Container.ConName;
          this.showSearch = false;
          this.showResults = true;
          this.showResultsEdit = false;
      }     
    })

  }

  getAll(){
    this.api.getAllLocations().subscribe( (res:any)=> {
      console.log(res);
      if(res.Error !=null){
      this.responseMessage = res.Message;
      alert(res.Message);
      this.showSearch = true;
      this.showResults = false;
      this.showResultsEdit = false;
    
    }
      else{
        
          /* this.location.LocationID = res.locations.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.Location_Status.LSDescription;
          this.location.AreaID = res.Area.ArName;
          this.location.ContainerID = res.Container.ConName; */
          this.locations = res;
          this.showSearch = false;
          this.showResults = false;
          this.showResultsEdit = false;
          this.showSearchEdit = false;
          this.showViewAll = true;
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

  enableInputs(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = false;
    this.showResults = false;
    this.showResultsEdit = true;
  
  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
    this.showResultsEdit = false;
  }

  }


