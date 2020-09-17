import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supplier-management',
  templateUrl: './supplier-management.component.html',
  styleUrls: ['./supplier-management.component.scss']
})
export class SupplierManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoAddSupplier(){
    this.router.navigate(['add-supplier']);
  }

  gotoViewSupplier(){
    this.router.navigate(['view-supplier']);

  }


}
