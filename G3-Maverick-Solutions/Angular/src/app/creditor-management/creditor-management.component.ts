import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creditor-management',
  templateUrl: './creditor-management.component.html',
  styleUrls: ['./creditor-management.component.scss']
})
export class CreditorManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/CreditorManagementScreen.html")
  }

}
