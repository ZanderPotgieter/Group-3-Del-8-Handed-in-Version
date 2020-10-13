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
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-createarea',
  templateUrl: './createarea.component.html',
  styleUrls: ['./createarea.component.scss']
})
export class CreateareaComponent implements OnInit {

  constructor(private api: AreaserviceService,  private router: Router,private fb: FormBuilder, private dialogService: DialogService) { }
  area : Area = new Area();
  responseMessage: string = "Request Not Submitted";
  statuses: AreaStatus[];
  provinces: Province[];
  arForm: FormGroup;
  areaNull: boolean = false;

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

    this.arForm= this.fb.group({  
      ArName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      ArPostalCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9 ]*')]],
      StatusID: ['', [Validators.required]],
      StatusName: [''],
      ProvName: [''],
      ProvinceID: ['', [Validators.required]],
    });

  }

  addArea(){
    if (this.area.ProvinceID == null || this.area.AreaStatusID ==null || this.area.ArName == null || this.area.ArPostalCode==null)
    {
      this.areaNull = true;
    }
    else
    {
      this.dialogService.openConfirmDialog("Are you sure you want to add the area? ")
      .afterClosed().subscribe(res => {
        if (res)
        {
          this.api.addArea(this.area).subscribe( (res:any)=> {
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
  }

  gotoGPSManagement(){
    this.router.navigate(['gps-management']);
  }

  

  

  

  

}
