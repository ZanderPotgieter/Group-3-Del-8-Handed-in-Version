import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import {AdminService} from 'src/app/admin.service';
import {Items} from 'src/app/adminModels/items';

@Component({
  selector: 'app-view-statuses',
  templateUrl: './view-statuses.component.html',
  styleUrls: ['./view-statuses.component.scss']
})




export class ViewStatusesComponent implements OnInit {


 selection: number;
 list: Items[] = [];
 item: Items;
 id: number;
 description: string;
 addDes : string;
 showadd: boolean = false;
 enableInput: boolean = true;

  constructor(private api: AdminService, private router: Router) { }

  ngOnInit(): void {
  }

  getCusSta(){
    this.selection = 1;
    return this.api.getAllCusOrderStatuses().subscribe((res: any) =>{
      console.log(res);
      this.list = res.List;
      this.addDes = "";
      this.showadd
    })
   
  }
 



  getSupSta(){
    this.selection = 2;
    return this.api.getAllSupOrderStatuses().subscribe((res: any) =>{
      console.log(res);
      this.list = res.List;
      this.addDes = "";
    })

  }

  markedOffReason(){
    this.selection = 3;
    return this.api.getAllMarkedOfReasons().subscribe((res: any) =>{
      console.log(res);
      this.list = res.List;
      this.addDes = "";
    })
  }

  paymentType(){
    this.selection = 4;
    return this.api.getAllPaymentTypes().subscribe((res: any) =>{
      console.log(res);
      this.list = res.List;
      this.addDes = "";
    })

  }

  userType(){
    this.selection = 5;
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

  update(){
    this.enableInput = false;
  }

  saveadd(){
    switch(this.selection){
      case 1:
        return this.api.addCusOrderStatuses(this.addDes).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
       
        case 2:
        return this.api.addSupOrderStatuses(this.addDes).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
        case 3:
         return this.api.addMarkedOfReasons(this.addDes).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
          
        })
        case 4:
         return this.api.addPaymentTypes(this.addDes).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
        case 5:
         return this.api.addUserType(this.addDes).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
      
    }



  }

  saveupdate(id: number, description: string){
    switch(this.selection){
      case 1:
        return this.api.updateCusOrderStatuses(id, description).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
       
        case 2:
        return this.api.updateSupOrderStatuses(id, description).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
        case 3:
         return this.api.updateMarkedOfReason(id, description).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
        case 4:
         return this.api.updatePaymentTypes(id, description).subscribe((res:any)=>{
          console.log(res)
          if(res.Message){
            alert(res.Message);
          }
          if(res.Error){
            alert(res.Error);
          }
        })
        case 5:
          return this.api.updateUserType(id, description).subscribe((res:any)=>{
           console.log(res)
           if(res.Message){
             alert(res.Message);
           }
           if(res.Error){
             alert(res.Error);
           }
         })
      
    }

  }

  delete(){
    
  }

  add(){

    this.showadd = true;
    
  }

  Cancel(){
    this.router.navigate(['add']);
  }

}
