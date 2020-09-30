import { Component, OnInit } from '@angular/core';
import {Items} from 'src/app/adminModels/items';
import {UserTypeAccess} from '../../user-type-access';

import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {AdminService} from 'src/app/admin.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private api: AdminService, private router: Router) { }

  selection: number;
  list: Items[] = [];
  item: Items = new Items();
  selectedtype: Items = new Items();
  id: number;
  description: string;
  addDes : string;
  showadd: boolean = false;
  enableInput: boolean = true;
  allAccess: Items[] = [];
  userAccess: Items[] = [];
  selectedAccess: Items = new Items();
  accessSelection: Items= new Items();
  userTA: UserTypeAccess = new UserTypeAccess();
  userTA_list: UserTypeAccess[] ;


  ngOnInit(){
   
  }

  search(){
    return this.api.getAllUserTypes().subscribe((res: any) =>{
      console.log(res);
      this.list = res.List;
      this.addDes = "";
    })
  }

  save(ndx: number){
    this.id = this.list[ndx].id;
    this.description = this.list[ndx].description;
    this.saveupdate(this.list[ndx].id, this.list[ndx].description )

  }

  trackByndx(ndx: number, item:any): any{
    return ndx;
  }

  update(ndx: number){
    if(this.id != ndx){
    this.id = ndx;
    this.selectedtype.id = this.list[ndx].id;
    this.selectedtype.description = this.list[ndx].description;
     this.searchUserTypeAccess(this.list[ndx].id)
    this.enableInput = false;}
    else{
      this.userAccess = [];
    }
    
  }

  searchUserTypeAccess(id: number){
    
    this.api.getAccessForUserType(id).subscribe((res: any)=>{
      console.log(res);
      if(res.Error){
        alert(res.Error); 
      }
    else{
      this.allAccess = res.AllAccess;
      this.userAccess = res.userAccess;
    }
    })
    


  }

  saveadd(){
    return this.api.addUserType(this.addDes).subscribe((res:any)=>{
      console.log(res)
      if(res.Message){
        alert(res.Message);
      }
      if(res.Error){
        alert(res.Error);
    }})
  }


      saveupdate(id: number, description: string){
    this.api.updateUserType(id, description).subscribe((res:any)=>{
      console.log(res)
      if(res.Message){
        alert(res.Message);
      }
      if(res.Error){
        alert(res.Error);
      }
    })
  }

  add(){

    this.showadd = true;
    
  }

  addAccess(val: Items){
   
    this.AccessPush(val);
  }

  AccessPush(val: Items){
    this.selectedAccess = val;
  
    }

  listAccess(){
      this.userAccess.push(this.selectedAccess)
      
      
    }

  

  delete(ndx: number){
    this.userAccess.splice(ndx,1);
  }


  Cancel(){
    this.router.navigate(['admin']);
  }

  saveAccess(){
   
    this.setAccess();
    this.api.setUserTypeAccess(this.userTA_list).subscribe((res: any)=>{
      console.log(res);
      if(res.Error){
        alert(res.Error)
      }
      if(res.Message){
        alert(res.Message)
      }
    })

  }

  setAccess(){
    for(var item of this.userAccess) 
    {
      this.userTA.AccessID = item.id;
      this.userTA.UserTypeID = this.selectedtype.id;
      this.userTA_list.push(this.userTA);
      console.log(this.userTA);
    }
    console.log(this.userTA_list);
    return Promise.all(this.userTA_list)
   
  }

  }

