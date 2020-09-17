import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-management',
  templateUrl: './donation-management.component.html',
  styleUrls: ['./donation-management.component.scss']
})
export class DonationManagementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  gotoAddDonationRecipient(){
    this.router.navigate(['add-donation-recipient']);
  }

  gotoSearchDonationRecipient(){
    this.router.navigate(['search-donation-recipient']);
  }

}
