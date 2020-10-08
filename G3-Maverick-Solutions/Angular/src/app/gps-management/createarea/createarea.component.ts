import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Province } from 'src/app/Province/province';
import { AreaStatus } from '../areastatus';
import { Area } from '../model/area.model';
import { AreaserviceService } from '../services/areaservice.service';

@Component({
  selector: 'app-createarea',
  templateUrl: './createarea.component.html',
  styleUrls: ['./createarea.component.scss']
})
export class CreateareaComponent implements OnInit {

  constructor(private areaService: AreaserviceService,  private router: Router) { }
  newArea : Area = new Area();
  selectedProvince: Province;
  selectedStatus: AreaStatus;
  area : Area = new Area();
  responseMessage: string = "Request Not Submitted";
  statusses: AreaStatus[];
  provinces: Province[];
  Select: number;

  ngOnInit(): void {

    this.areaService.getAllAreaStatus()
    .subscribe(value => {
      if (value != null) {
        this.statusses = value;
      }
    });

    this.areaService.getAllProvinces()
    .subscribe(value => {
      if (value != null) {
        this.provinces = value;
      }
    });

  }

  loadStatus(val: AreaStatus){
   
    this.addStatus(val);
  }

  addStatus(val : AreaStatus){
    this.selectedStatus = val;
  }

  loadProvinces(val: Province){
   
    this.addProvince(val);
  }

  addProvince(val : Province){
    this.selectedProvince = val;
  }

  Save(){
    this.newArea.ProvinceID = this.selectedProvince.ProvinceID;
    this.newArea.AreaStatusID = this.selectedStatus.AreaStatusID;
    this.areaService.addArea(this.area).subscribe( (res: any)=> {
      console.log(res);
      if(res.Message){
        this.responseMessage = res.Message;
        alert(this.responseMessage)
        this.router.navigate(["product-management"]);}
        else if (res.Error){
          alert(res.Error);
        }
       
    })
    
  }

}
