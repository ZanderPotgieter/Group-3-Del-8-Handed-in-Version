import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplier-order-management',
  templateUrl: './supplier-order-management.component.html',
  styleUrls: ['./supplier-order-management.component.scss']
})
export class SupplierOrderManagementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/SupplierOrderManagementScreen.html")
  }

}
