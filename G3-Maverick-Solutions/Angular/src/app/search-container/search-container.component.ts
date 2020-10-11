import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Container} from '../container-management/container';
import { NgModule } from '@angular/core';
import {ContainerService} from '../container-management/container.service';
import { Observable } from 'rxjs';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-search-container',
  templateUrl: './search-container.component.html',
  styleUrls: ['./search-container.component.scss']
})
export class SearchContainerComponent implements OnInit {

  constructor(private api: ContainerService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }
  conForm: FormGroup;
  container : Container = new Container();
  responseMessage: string = "Request Not Submitted";

  showOptions: boolean = true;
  showAll: boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  name : string;
  allContainers: Observable<Container[]>;
containerNull : boolean = false;

  ngOnInit() {
    this.conForm= this.fb.group({  
      ConName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      ConDescription: ['', [Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z ]*')]],  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],
       
    }); 
  }

  All(){
    this.allContainers = this.api.getAllContainers();
    this.showAll = true;
    this.showSearch = false;
    this.showOptions = true;
  }

  Input(){
    this.showSearch = true;
    this.showAll = false;
    this.showOptions = false;
  }
  Search(){
    if(this.name == null)
    {
      this.containerNull = true;
      this.showSearch = true;
      this.showResults = false;
    }
    else{
    this.api.searchContainer(this.name).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
        this.dialogService.openAlertDialog(res.Message);
      }
      else{
          this.container.ContainerID = res.ContainerID;
          this.container.ConName = res.ConName;
          this.container.ConDescription = res.ConDescription;
      }
      
      this.showSearch = true;
      this.showResults = true;
      this.containerNull = false;
      
    })
  }

  }

  Cancel(){
    this.router.navigate(["container-management"])
  }

  Update(){
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }

  Delete(){
    this.dialogService.openConfirmDialog('Are you sure you want to delete this container?')
    .afterClosed().subscribe( res => {
      if(res){
    this.api.deleteContainer(this.container.ContainerID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);
      this.responseMessage = res.Message;}
      this.router.navigate(["container-management"])
    })
  }
  })
  }

  Save(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this container?')
    .afterClosed().subscribe(res => {
      if(res){
        this.api.updateContainer(this.container).subscribe( (res:any)=> {
        console.log(res);
        if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
        this.router.navigate(["container-management"])
    })
  }
  })
  }

  cancel(){

    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed();
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

}
