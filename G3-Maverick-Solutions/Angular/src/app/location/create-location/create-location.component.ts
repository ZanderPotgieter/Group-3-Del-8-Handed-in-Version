import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../location.service';
import { Location } from '../location';
import { AreaVM } from './../area-vm'; 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-location',
  templateUrl: './create-location.component.html',
  styleUrls: ['./create-location.component.scss']
})
export class CreateLocationComponent implements OnInit {
  http: any;

  constructor(private api: LocationService, private router: Router) { }
  location : Location = new Location();
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void {
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

}


