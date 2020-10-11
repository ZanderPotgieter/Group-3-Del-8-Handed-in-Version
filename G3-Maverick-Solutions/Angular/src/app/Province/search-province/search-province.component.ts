import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
//import { FormBuilder, Validators } from '@angular/forms';
import { ProvinceService } from '../province.service';
import { Province } from '../province';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from 'src/app/shared/dialog.service';


@Component({
  selector: 'app-search-province',
  templateUrl: './search-province.component.html',
  styleUrls: ['./search-province.component.scss']
})
export class SearchProvinceComponent implements OnInit {

  constructor(private provinceService: ProvinceService, private router: Router, private fb: FormBuilder , private dialogService: DialogService) { }
  province : Province = new Province();
  provinces: Province [];
  responseMessage: string = "Request Not Submitted";
  provinceNull: boolean = false;

  angForm: FormGroup;
  showSave: boolean = false;
  showButtons: boolean = false;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  showOptions: boolean = true;
  showViewAll: boolean = false;
  name : string;
  ProvName: string;

  ngOnInit(): void {
    this.angForm= this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]], 
      ProvName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
    });
  }

  showSearchDiv()
  {
    this.showOptions = false;
    this.showSearch = true;
    this.showViewAll  = false;
    this.showResults = false;
  }


 view(val : any )
 {
    this.name = val;
    this.searchProvince();   
 }

  getAllProvinces()
  {
    this.provinceService.getAllProvinces().subscribe( (res:any) =>
    {
      console.log(res);
      if(res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      else
      {
       this.provinces = res;
        this.showSearch = false;
        this.showResults = false;
        this.showOptions = false;
        this.showViewAll = true;
      }
    });
  }


  gotoGPSManagement()
  {
    this.router.navigate(['gps-management']);
  }

  searchProvince()
  {
    this.provinceService.searchProvince(this.name).subscribe( (res:any) =>
    {
      console.log(res);
      if(res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      else
      {
        this.province.ProvinceID = res.ProvinceID;
        this.province.ProvName = res.ProvName;
        this.showSearch = true;
        this.showResults = true;
        this.showOptions = false;
        this.showViewAll = false;
        this.showButtons = true;
      }

      

    })
  }

  updateProvince(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this province?')
    .afterClosed().subscribe(res => {
      if (res){
        this.provinceService.updateProvince(this.province).subscribe( (res:any)=> 
        {
          console.log(res);
          if(res.Message)
          {
            this.dialogService.openAlertDialog(res.Message)
          }
          this.router.navigate(["gps-management"])
        })
      }
    })

  }

  removeProvince()
  {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this province?')
    .afterClosed().subscribe(res => {
      if (res)
      {
        this.provinceService.removeProvince(this.province.ProvinceID).subscribe( (res:any)=> 
        {
          console.log(res);
          if(res.Message)
          {
            this.dialogService.openAlertDialog(res.Message)
          }
          this.router.navigate(["gps-management"])
        })
      }
    })
    

  }

  enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }

  cancel()
  {
    /* this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; */
    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed();
    this.router.navigate(["gps-management"])
  }



}
