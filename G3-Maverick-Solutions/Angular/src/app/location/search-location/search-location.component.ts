import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Location} from '../location';
import { NgModule } from '@angular/core';
import {LocationService} from '../location.service';

var inputEnabled = false;

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit {

  constructor(private api: LocationService, private router: Router) { }
  location : Location= new Location();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;


  ngOnInit(): void {

  }

  gotoGPSManagement() {
 this.router.navigate(['gps-management']);
  }

  searchLocation(){
    this.api.searchLocation(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message == "Record Not Found"){
      this.responseMessage = res.Message;
      alert(res.Message);
      this.showSearch = true;
      this.showResults = false;
    
    }
      else{
          this.location.LocationID = res.LocationID;
          this.location.LocName = res.LocName;
          this.location.LocationStatusID = res.Location_Status.LSDescription;
          this.location.AreaID = res.Area.ArName;
          this.location.ContainerID = res.Container.ConName;
          this.showSearch = false;
          this.showResults = true;
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
  
  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

  }


