import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-manager',
  templateUrl: './update-manager.component.html',
  styleUrls: ['./update-manager.component.scss']
})
export class UpdateManagerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoManagerManagement(){
    this.router.navigate(['manager-management']);

  }
}
