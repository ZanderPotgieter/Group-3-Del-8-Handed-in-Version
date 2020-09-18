import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ProvinceService } from '../province.service';
import { Province } from '../province';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-province',
  templateUrl: './add-province.component.html',
  styleUrls: ['./add-province.component.scss']
})
export class AddProvinceComponent implements OnInit {

 

  dataSaved = false;
  provinceForm : any;
  provinceIDUpdate = null;
  message = null; 

  

  constructor(private provinceService: ProvinceService, private formBuilder: FormBuilder, private router: Router) { };

  province : Province = new Province();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
 // name : string;

  ngOnInit(): void {
    
  }

  

addProvince()
{
   this.provinceService.addProvince(this.province).subscribe( (res:any)=> 
  {
    console.log(res);
    if(res.Message)
    {
      this.responseMessage = res.Message;
    }
    alert(this.responseMessage)
    this.router.navigate(["gps-management"])
  }) 

  


  /*  if (this.provinceIDUpdate == null)
  {
    this.provinceService.addProvince(this.province).subscribe(
      (res:any) => {
        this.dataSaved = true;
        this.provinceIDUpdate = null;
        
      }
    );
  }
  else
  {
    this.province.ProvinceID = this.provinceIDUpdate;
    this.provinceService.updateProvince(this.province).subscribe(
      () => {
        this.dataSaved = true;
        this.provinceIDUpdate = null;
      }
    );
  }  */

}


  Cancel(){
    this.router.navigate(["gps-management"])
  }



}
