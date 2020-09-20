import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container } from '../container-management/container';
import { NgModule } from '@angular/core';
import {ContainerService} from '../container-management/container.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';

@Component({
  selector: 'app-create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.scss']
})
export class CreateContainerComponent implements OnInit {

  constructor(private api: ContainerService, private router: Router, private fb: FormBuilder) { }
  angForm: FormGroup;
  container : Container = new Container();
  responseMessage: string = "Request Not Submitted";

  ngOnInit(){
    this.angForm= this.fb.group({  
      ConName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      ConDescription: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      
       
    });  
  }

  Save()
  {
    this.api.addContainer(this.container).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["container-management"])
    })
  }

  Cancel()
  {this.router.navigate(['container-management']);}
}
