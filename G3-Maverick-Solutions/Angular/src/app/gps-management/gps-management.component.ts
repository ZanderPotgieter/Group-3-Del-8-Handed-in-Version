import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gps-management',
  templateUrl: './gps-management.component.html',
  styleUrls: ['./gps-management.component.scss']
})
export class GPSManagementComponent implements OnInit {

  showlocation = false;
  showarea = false;
  showprovince=false;

  constructor() { }

  ngOnInit(): void {

  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/GPSManagementScreen.html")
  }

  location(){
    this.showlocation = true;
    this.showarea = false;
    this.showprovince=false;
  }

  area(){
    this.showlocation = false;
    this.showarea = true;
    this.showprovince=false;

  }

  province(){

    this.showlocation = false;
    this.showarea = false;
    this.showprovince=true;
  }

}
