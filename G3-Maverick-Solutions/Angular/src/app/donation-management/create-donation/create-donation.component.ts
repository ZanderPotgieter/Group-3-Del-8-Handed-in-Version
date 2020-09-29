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
  selector: 'app-create-donation',
  templateUrl: './create-donation.component.html',
  styleUrls: ['./create-donation.component.scss']
})
export class CreateDonationComponent implements OnInit {

  constructor(private donationService: DonationService, private router: Router) { }

  donation: Donation = new Donation();
  donationRecipient: DonationRecipient = new DonationRecipient();
  donatedProduct: DonatedProduct = new DonatedProduct();
  responseMessage: string = "Request Not Submitted";
  donationForm: any;
  donation1: Donation = new Donation();

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
    this.donationService.getDonationStatuses().subscribe(value => {
        if (value!=null){
          this.statuses = value;
        }
      });
  }

  gotoDonationManagement()
  {
    this.router.navigate(['donation-management']);
  }

  searchDonationRecipient()
  {
    this.donationService.searchDonDonationRecipient(this.cell).subscribe( (res:any) =>
    {
      console.log(res);
      if(res.Message != null)
      {
        this.responseMessage = res.Message;
        alert(this.responseMessage)
      }
      else
      {
        console.log(res)
        this.donationRecipient.RecipientID = res.RecipientID;
        this.donationRecipient.DrName = res.DrName;
        this.donationRecipient.DrSurname = res.DrSurname;
        this.donationRecipient.DrCell = res. DrCell;
        this.donationRecipient.DrEmail = res.DrEmail;
      }

      if (res.Message != "Record Not Found")
      {
        this.showSearch = true;
        this.showResults = true;
        this.showAddDon = true;
      }
      

    })
  }

  addDonation()
  {
   this.donation1.RecipientID = this.donationRecipient.RecipientID;
   this.donation1.DonationStatusID = this.donation.DonationStatusID;
   this.donation1.DonDescription = this.donation.DonDescription;
   this.donation1.DonDate =  this.donation.DonDate;
   this.donation1.DonAmount = this.donation.DonAmount;
   console.log(this.donation1)

    this.donationService.addDonation(this.donation1).subscribe( (res:any)=> 
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
  

  enableInputs()
  {
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }

  cancel()
  {
   /*  this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; */
    this.router.navigate(["donation-management"])
  }

  


}
