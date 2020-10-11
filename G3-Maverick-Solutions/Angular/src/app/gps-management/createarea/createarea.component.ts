import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Province } from 'src/app/Province/province';
import { AreaStatus } from '../areastatus';
import { Area } from '../model/area.model';
import { AreaserviceService } from '../services/areaservice.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-createarea',
  templateUrl: './createarea.component.html',
  styleUrls: ['./createarea.component.scss']
})
export class CreateareaComponent implements OnInit {

  constructor(private api: AreaserviceService,  private router: Router) { }
  area : Area = new Area();
  responseMessage: string = "Request Not Submitted";
  statuses: AreaStatus[];
  provinces: Province[];

  ngOnInit(): void {

    this.api.getAllAreaStatus().subscribe(value => {
      if (value!=null){
        this.statuses = value;
      }
    });

    this.api.getAllProvinces().subscribe(value => {
      if (value!=null){
        this.provinces = value;
      }
    });

  }

  addArea(){
    this.api.addArea(this.area).subscribe( (res:any)=> {
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
