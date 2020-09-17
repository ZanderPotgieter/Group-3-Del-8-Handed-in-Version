import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Container } from '../container-management/container';
import { NgModule } from '@angular/core';
import {ContainerService} from '../container-management/container.service';

@Component({
  selector: 'app-create-container',
  templateUrl: './create-container.component.html',
  styleUrls: ['./create-container.component.scss']
})
export class CreateContainerComponent implements OnInit {

  constructor(private api: ContainerService, private router: Router) { }

  container : Container = new Container();
  responseMessage: string = "Request Not Submitted";

  ngOnInit(): void {
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
  {}
}
