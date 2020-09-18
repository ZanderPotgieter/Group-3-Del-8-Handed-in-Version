import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
//import { FormBuilder, Validators } from '@angular/forms';
import { ProvinceService } from '../province.service';
import { Province } from '../province';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-province',
  templateUrl: './search-province.component.html',
  styleUrls: ['./search-province.component.scss']
})
export class SearchProvinceComponent implements OnInit {

  constructor(private provinceService: ProvinceService, private router: Router) { }
  province : Province = new Province();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  name : string;

  ngOnInit(): void {
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
        this.responseMessage = res.Message;
        alert(this.responseMessage)
      }
      else
      {
        this.province.ProvinceID = res.ProvinceID;
        this.province.ProvName = res.ProvName;
        this.showSearch = true;
        this.showResults = true;
      }

      

    })
  }

  updateProvince(){
    this.provinceService.updateProvince(this.province).subscribe( (res:any)=> 
    {
      console.log(res);
      if(res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["gps-management"])
    })

  }

  removeProvince()
  {
    this.provinceService.removeProvince(this.province.ProvinceID).subscribe( (res:any)=> 
    {
      console.log(res);
      if(res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["gps-management"])
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

    this.router.navigate(["gps-management"])
  }



}
