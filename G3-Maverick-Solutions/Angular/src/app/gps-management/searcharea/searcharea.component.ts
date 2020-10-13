import { Component, OnInit } from '@angular/core';
import { AreaserviceService } from '../services/areaservice.service';
import { Area } from '../model/area.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Province } from 'src/app/Province/province';
import { AreaStatus } from '../areastatus';
import { DialogService } from 'src/app/shared/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-searcharea',
  templateUrl: './searcharea.component.html',
  styleUrls: ['./searcharea.component.scss']
})
export class SearchareaComponent implements OnInit {

  private _allAr: Observable<Area[]>;  
  public get allAr(): Observable<Area[]> {  
    return this._allAr;  
  }  
  public set allAr(value: Observable<Area[]>) {  
    this._allAr = value;  
  }  
  name : string;
  statuses: AreaStatus[];
  provinces: Province[];
  area: Area = new Area();
  areas: Area[];
  province: Province = new Province();
  status: AreaStatus = new AreaStatus();
  inputEnabled:boolean = true;
  inputDisabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;
  arForm: FormGroup;
  showOptions: boolean = true;
  showSearchEdit: boolean = true;
  showResultsEdit: boolean = false;
  showViewAll: boolean = false;
  responseMessage: string = "Request Not Submitted";

  constructor(public api: AreaserviceService,private router: Router, private dialogService: DialogService,private fb: FormBuilder) { }


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
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
        ArName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
        ArPostalCode: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9 ]*')]],
        StatusID: ['', [Validators.required]],
        StatusName: [''],
        ProvName: [''],
        ProvinceID: ['', [Validators.required]],
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

     view(area: any)
  {
    this.name = area;
    this.searchArea();
  }

  searchArea(){
    this.api.searchArea(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message !=null)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.showSearch = true;
        this.showResults = false;
        this.showResultsEdit = false;
    
      }
      else{
          this.area.AreaID = res.AreaID;
          this.area.ArName = res.ArName;
          this.area.ArPostalCode = res.ArPostalCode;
          this.area.AreaStatusID = res.Area_Status.ASDescription;
          this.area.ProvinceID = res.Province.ProvName;
          this.showSearch = false;
          this.showResults = true;
          this.showResultsEdit = false;
          this.showViewAll = false;
      }     
    })

  }

  gotoUpdate() {
    this.api.searchArea(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.showSearch = true;
        this.showResults = false;
        this.showResultsEdit = false;
    
      }
      else{
        console.log(res);
        this.area.AreaID = res.AreaID;
          this.area.ArName = res.ArName;
          this.area.ArPostalCode = res.ArPostalCode;
          this.area.AreaStatusID = res.AreaStatusID;
          this.area.ProvinceID = res.ProvinceID;
          this.showSearch = false;
          this.showResults = false;
          this.showResultsEdit = true;
          this.showViewAll = false;
      }     
    })
  }

  getAll(){
    this.api.getAllAreas().subscribe( (res:any)=> {
      console.log(res);
      if(res.Message !=null)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.showSearch = true;
        this.showResults = false;
        this.showResultsEdit = false;
    
      }
      else{
      
          this.areas = res.Areas;
          this.showSearch = false;
          this.showResults = false;
          this.showResultsEdit = false;
          this.showSearchEdit = false;
          this.showViewAll = true;
      }     
    })

  }

  updateArea(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this Area?')
    .afterClosed().subscribe(res => {
      if(res){
        this.api.updateArea(this.area).subscribe( (res:any)=> {
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

  deleteArea(){
    this.dialogService.openConfirmDialog('Are you sure you want to delete this area?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.deleteArea(this.area.AreaID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      this.dialogService.openAlertDialog(this.responseMessage)
      this.router.navigate(["gps-management"])
    })

  }
})

}

  enableInputs(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = false;
    this.showResults = false;
    this.showResultsEdit = true;
    this.showViewAll = false;
  
  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
    this.showResultsEdit = false;
    this.showViewAll = false;
  }

  }
    
  
  


    
 
  
  

