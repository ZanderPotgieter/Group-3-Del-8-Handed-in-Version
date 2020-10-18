import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container-management',
  templateUrl: './container-management.component.html',
  styleUrls: ['./container-management.component.scss']
})
export class ContainerManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/ContainerManagementScreen.html")
  }

  gotoCreateContainer(){
    this.router.navigate(['create-container']);
  }

  gotoSearchContainer(){
    this.router.navigate(['search-container']);
  }

}
