import { Component, OnInit } from '@angular/core';
import { ProvinceService } from '../province.service';
import { Province } from '../province';
import { Router } from '@angular/router';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';


@Component({
  selector: 'app-add-province',
  templateUrl: './add-province.component.html',
  styleUrls: ['./add-province.component.scss']
})
export class AddProvinceComponent implements OnInit {

  angForm: FormGroup;

  dataSaved = false;
  provinceForm : any;
  provinceIDUpdate = null;
  message = null; 

  

  constructor(private provinceService: ProvinceService, private formBuilder: FormBuilder, private router: Router, private fb: FormBuilder ) { };

  province : Province = new Province();
  responseMessage: string = "Request Not Submitted";

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
 // name : string;

  ngOnInit(): void {
    this.angForm= this.fb.group({  
      ProvName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
    });
    
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

}

  getAllProvinces(){
    this.provinceService.getAllProvinces().subscribe( (res:any) =>{
      console.log(res);
      if(res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["gps-management"])
    })
  }
  


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



  Cancel(){
    this.router.navigate(["gps-management"])
  }



}
