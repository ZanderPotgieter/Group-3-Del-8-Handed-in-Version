import { Component, OnInit } from '@angular/core';
import { AreaserviceService } from '../services/areaservice.service';
import { Area } from '../model/area.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Province } from 'src/app/Province/province';
import { AreaStatus } from '../areastatus';
import { DialogService } from 'src/app/shared/dialog.service';


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
  area: Area = new Area();
  province: Province = new Province();
  status: AreaStatus = new AreaStatus();
  inputEnabled:boolean = true;
  inputDisabled:boolean = true;
  showSearch: boolean = true;
  showResults: boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;

  constructor(public api: AreaserviceService,private router: Router, private dialogService: DialogService) { }


  ngOnInit(): void {
  }
    
  searchArea()
  {
    this.api.searchArea(this.name).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);

      }
      else 
      {
        this.area.ProvinceID = res.ProvinceID;
        this.area.AreaStatusID = res.AreaStatusID;
        this.area.ArName = res.ArName;
        this.area.ArPostalCode = res.ArPostalCode;
        this.province.ProvName = res.Province.ProvName;
        this.status.ASDescription = res.Area_Status.ASDescription;
        this.showSearch = false;
        this.showResults = true;
      }

       
    })
  }

  updateArea(){
    this.dialogService.openConfirmDialog('Are you sure you want to update this creditor?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.updateArea(this.area).subscribe( (res: any) =>
    {
      console.log(res);
      if(res.Message)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      this.router.navigate(["gps-management"])
    })
  }
});
}

removeArea(){
  this.dialogService.openConfirmDialog('Are you sure you want to remove this supplier as creditor?')
  .afterClosed().subscribe(res => {
    if(res){
  this.api.deleteArea(this.area.AreaID).subscribe( (res:any)=> {
    console.log(res);
    if(res.Message != null){
      this.dialogService.openAlertDialog(res.Message);
      this.router.navigate(["gps-management"])
  }
  else{
    this.dialogService.openAlertDialog('Unable to delete supplier as creditor. Payments were made to this creditor.');
  }
  })
}
});

}

enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.inputDisabled = true;
    this.showButtons = false;
  }
    
  cancel()
  {
    this.dialogService.openConfirmDialog('Are you sure you want to Cancel?')
    .afterClosed().subscribe(res => {
      if(res){
        
  }
});

}

  
  
}
