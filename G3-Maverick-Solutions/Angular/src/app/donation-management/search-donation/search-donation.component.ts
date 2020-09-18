import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
//import { FormBuilder, Validators } from '@angular/forms';
import { DonationService } from '../donation.service';
import { DonatedProduct } from '../donated-product';
import { Donation } from '../donation';
import { DonationRecipient } from '../donation-recipient';
import { DonationStatus } from '../donation-status';
import { Container } from '../container'
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-donation',
  templateUrl: './search-donation.component.html',
  styleUrls: ['./search-donation.component.scss']
})
export class SearchDonationComponent implements OnInit {
  constructor(private donationService: DonationService, private router: Router) { }

  donation: Donation = new Donation();
  donations: Donation[];
  donationRecipient: DonationRecipient = new DonationRecipient();
  donatedProduct: DonatedProduct = new DonatedProduct();
  responseMessage: string = "Request Not Submitted";
  donationForm: any;

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showAddDon: boolean = false
  showResults: boolean = false;
  cell : string;

  statuses: DonationStatus[];
  containers: Container[];

  ngOnInit(): void {
  }

  gotoDonationManagement()
  {
    this.router.navigate(['donation-management']);
  }

   searchDonations()
  {
    this.donationService.searchDonations(this.cell).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.responseMessage = res.Message;
        alert(this.responseMessage)

      }
      else 
      {
        this.donations = res;
        //this.donationRecipient = res['DonationRecipient']
         /*
        this.donation.DonationID = res.DonationID;
        this.donation.RecipientID = res.RecipientID;
        this.donation.DonationStatusID= res.DonationStatusID
        this.donation.DonDate = res.DonDate;
        this.donation.DonAmount= res.DonAmount;
        this.donationRecipient.DrName = res.DonationRecipient.DrName;
        this.donationRecipient.DrSurname = res.DrSurname;
        this.donationRecipient.DrEmail= res.DrEmail;
        this.donationRecipient.DrCell = res.DrCell;
        this.donatedProduct.DPQuantity = res.DPQuantity;
        this.donatedProduct.ProductID = res.ProductID;
        this.donatedProduct.DonationID = res.DonationID;
       // this.donations = res['Donations']; */
        
        //this.supplier.SupCell = res.Supplier.SupCell;
        //this.supplier.SupEmail = res.Supplier.SupEmail;
        this.showSearch = true;
        this.showResults = true; 
      }

      
    })
  }

  viewDonation()
  {
    this.router.navigate(["search-donated-product"])
  }

  updateDonation(){
    this.donationService.updateDonation(this.donation).subscribe( (res: any) =>
    {
      console.log(res);
      if(res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["donation-management"])
    })
  }

  removeDonation()
  {
    this.donationService.deleteDonation(this.donation.DonationID).subscribe( (res:any) =>
    {
      console.log(res);
      if (res.Message)
      {
        this.responseMessage = res.Message;
      }
      alert(this.responseMessage)
      this.router.navigate(["donation-management"])
    })
  }
  

  enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }
    
  cancel()
  {
    /* this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; */
    this.router.navigate(["donation-management"])
  }

  gotoAddDonationRecipient(){
    this.router.navigate(['add-donation-recipient']);
  }

 

}
