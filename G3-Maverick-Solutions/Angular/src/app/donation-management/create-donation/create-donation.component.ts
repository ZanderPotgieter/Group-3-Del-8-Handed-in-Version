import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms';
import { DonationService } from '../donation.service';
import { DonatedProduct } from '../donated-product';
import { Donation } from '../donation';
import { DonationRecipient } from '../donation-recipient';
import { DonationStatus } from '../donation-status';
import { Container } from '../container'
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { DialogService } from '../../shared/dialog.service';

@Component({
  selector: 'app-create-donation',
  templateUrl: './create-donation.component.html',
  styleUrls: ['./create-donation.component.scss']
})
export class CreateDonationComponent implements OnInit {
  constructor(private donationService: DonationService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }

  angForm: FormGroup;
  donation: Donation = new Donation();
  donationRecipient: DonationRecipient = new DonationRecipient();
  donatedProduct: DonatedProduct = new DonatedProduct();
  responseMessage: string = "Request Not Submitted";
  donationForm: any;
  donation1: Donation = new Donation();

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showAddDon: boolean = false
  showResults: boolean = false;
  cell : string;
  
  showSearch: boolean = true;
  showCell: boolean = false;
  showName: boolean = false;

  statuses: DonationStatus[];
  containers: Container[];

  name: string;
  surname: string;

  showAddProduct: boolean = false;
  showSearchSelection: boolean = false;
  showNameSearch: boolean = false;


  //donForm: FormGroup;

  useBarcode()
  {

  }

  useName()
  {

  }

  ngOnInit(): void {
    this.donationService.getDonationStatuses().subscribe(value => {
        if (value!=null){
          this.statuses = value;
        }
      });

      this.angForm= this.fb.group({  
        cell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*')]],  
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
        surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
        DrName: [''],
        DrSurname: [''],
        DrEmail: [''],
        DrCell: [''],
        DonDescription:['', [Validators.required, Validators.minLength(2),  Validators.pattern('[a-zA-Z ]*')]], 
        DonStatus: ['', [Validators.required ]],
        DonAmount:['', [Validators.required, Validators.pattern('[0-9 ]*')]], 
        DonDate: ['', [Validators.required ]],
        //DSDescription: [''], 
        DonationStatusID: ['', [Validators.required ]],
         
      }); 


  }

  showSearchByCell()
  {
    this.showCell = true;
    this.showName = false;
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; 
    this.showAddDon = false;
  }

  showSearchByName()
  {
    this.showName = true;
    this.showCell = false;
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; 
    this.showAddDon = false;
  }

  gotoDonationManagement()
  {
    this.router.navigate(['donation-management']);
  }

  gotoAddDonationRecipient(){
    this.router.navigate(['add-donation-recipient']);
  }

  searchDonationRecipientByCell()
  {
    this.donationService.searchDonationRecipientByCell(this.cell).subscribe( (res:any) =>
    {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
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

        this.showSearch = true;
        this.showResults = true;
        this.showAddDon = true;
      }
      

    })
  }

  searchDonationRecipientByName()
  {
    this.donationService.searchDonationRecipientByName(this.name, this.surname).subscribe( (res:any) =>
    {
      console.log(res);
      if(res.Error != null)
      {
        this.responseMessage = res.Error;
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
