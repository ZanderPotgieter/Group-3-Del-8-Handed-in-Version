import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reporting-management',
  templateUrl: './reporting-management.component.html',
  styleUrls: ['./reporting-management.component.scss']
})
export class ReportingManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/ReportingManagementScreen.html")
  }

}
