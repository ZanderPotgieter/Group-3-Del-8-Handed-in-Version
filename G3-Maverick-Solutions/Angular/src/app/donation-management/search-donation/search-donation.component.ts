import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DonationService } from '../donation.service';
import { DonatedProduct } from '../donated-product';
import { Donation } from '../donation';
import { DonationRecipient } from '../donation-recipient';
import { DonationStatus } from '../donation-status';
import { Container } from '../container';
import { DatePipe } from '@angular/common';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';

import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-search-donation',
  templateUrl: './search-donation.component.html',
  providers: [DatePipe],
  styleUrls: ['./search-donation.component.scss']
})
export class SearchDonationComponent implements OnInit {
  constructor(private donationService: DonationService, private router: Router, private fb: FormBuilder,  private dialogService: DialogService) { }

  angForm: FormGroup;
  donation: Donation = new Donation();
  donations: Donation[];
  donationRecipient: DonationRecipient = new DonationRecipient();
  donationStatus: DonationStatus = new DonationStatus();
  donatedProduct: DonatedProduct = new DonatedProduct();
  responseMessage: string = "Request Not Submitted";
  donationForm: any;

  dateVal = new Date();

  donatedProducts: DonatedProduct[];

  showSave: boolean = false;
  showButtons: boolean = false;
  inputEnabled:boolean = true;
  showSearch: boolean = true;
  showAddDon: boolean = false
  showResults: boolean = false;
  showCell: boolean = false;
  showName: boolean = false;
  showDonation : boolean = false;
  showAllDons: boolean = false;
  showText: boolean = false;
  showInput: boolean = false;
  inputDisabled:boolean = true;
  showEditProduct: boolean = false;
  donationNull: boolean = false;
  showDonationDet: boolean = false;

  cell : string;
  name: string;
  surname: string;
  id:number;

  statuses: DonationStatus[];
  containers: Container[];

  ngOnInit(){
    this.angForm= this.fb.group({  
      cell: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9 ]*')]],  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      DrName: [''],
      DrSurname: [''],
      DrEmail: [''],
      DrCell: [''],
      DonDescription: [''],
      DonStatus: [''],
      DonAmount: [''],
      DonDate: [''],
      DSDescription: [''],
      DonationStatusID: [''],
    }); 
    
    this.donationService.getDonationStatuses()
    .subscribe(value => {
      if (value!=null){
        this.statuses = value;
      }
    })
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/SearchDonation.html")
  }

  editProducts()
  {
    
    this.showCell = false;
    this.showName = false;
    this.showSave = false;
    this.inputEnabled = true;
    this.showButtons = false;
    
    this.showSearch = false;
    this.showResults = false; 
    this.showAllDons = false;
    this.showDonation = false;
    this.showDonationDet = false;
    this.showText = false;
    this.showInput = false;
    this.showEditProduct = true;

  }

  getDonatedProducts(DonID: any)
  {
    this.donationService.getDonatedProducts(DonID).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      else 
      {
        this.donatedProducts = res.donatedProducts;
        this.editProducts();
      }

    })

  }

  showSearchByCell()
  {
    this.showCell = true;
    this.showName = false;
    this.showSave = false;
    this.inputEnabled = true;
    this.showButtons = false;
    
    this.showSearch = true;
    this.showResults = false; 
    this.showAllDons = false;
    this.showDonation = false;
    this.showDonationDet = false;
    this.showText = false;
    this.showInput = false;
  }

  showSearchByName()
  {
    this.showName = true;
    this.showCell = false;
    this.showSave = false;
    this.inputEnabled = true;
    this.showButtons = false;
    this.showDonation = false;
    this.showDonationDet = false;
    
    this.showSearch = true;
    this.showResults = false; 
    this.showAllDons = false;
    this.showText = false;
    this.showInput = false;
  }

  

  gotoDonationManagement()
  {
    this.router.navigate(['donation-management']);
  }

   searchDonationsByCell()
  {
    this.donationService.searchDonationsByCell(this.cell).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      else 
      {
        this.donationRecipient.RecipientID = res.recipient.RecipientID;
        this.donationRecipient.DrName = res.recipient.DrName;
        this.donationRecipient.DrSurname = res.recipient.DrSurname;
        this.donationRecipient.DrEmail= res.recipient.DrEmail;
        this.donationRecipient.DrCell = res.recipient.DrCell;

        this.donations = res.donations;
        //this.donations = res;
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
        this.showAllDons = true;
        this.showDonation = false;
        this.showDonationDet = false;
        this.showText = false;
        this.showInput = false;
      }

      
    })
  }

  searchDonationsByName()
  {
    this.donationService.searchDonationsByName(this.name, this.surname).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);

      }
      else 
      {
        //get donation  details 
        this.donationRecipient.RecipientID = res.recipient.RecipientID;
        this.donationRecipient.DrName = res.recipient.DrName;
        this.donationRecipient.DrSurname = res.recipient.DrSurname;
        this.donationRecipient.DrEmail= res.recipient.DrEmail;
        this.donationRecipient.DrCell = res.recipient.DrCell;

        this.donations = res.donations;
        this.showSearch = true;
        this.showResults = true; 
        this.showAllDons = true;
        this.showDonation = false;
        this.showDonationDet = false;
        this.showText = false;
        this.showInput = false;   
      }

      
    })
  }

  searchDonationByID()
  {
    this.donationService.searchDonationByID(this.id).subscribe( (res: any) =>
    {
      console.log(res);
      if (res.Message != null)
      {
        this.dialogService.openAlertDialog(res.Message);
      }
      else 
      {
        //get donation  details 
        this.donationRecipient.RecipientID = res.recipient.RecipientID;
        this.donationRecipient.DrName = res.recipient.DrName;
        this.donationRecipient.DrSurname = res.recipient.DrSurname;
        this.donationRecipient.DrEmail= res.recipient.DrEmail;
        this.donationRecipient.DrCell = res.recipient.DrCell;

        this.donation.DonAmount = res.donation.DonAmount;
        this.donation.DonDate = res.donation.DonDate;
        this.donation.DonDescription = res.donation.DonDescription
        this.donation.DonationStatusID = res.donation.DonationStatusID;
        this.donation.DonationID = res.donation.DonationID;

        this.donationStatus.DSDescription = res.donation.DonStatus;
        this.donationStatus.DonationStatusID = res.donation.DonationStatusID;

        this.showSearch = true;
        this.showResults = true; 
        this.showName = false;
        this.showCell = false;
        this.showSave = false;
        this.inputEnabled = true;
        this.showButtons = true;
        this.showAllDons = false;
        this.showDonation = true;
        this.showDonationDet = true;
        this.showText = true;
        this.showInput = false;

        
      }

      
    })
  }

  update()
  {
    this.showSearch = true;
        this.showResults = true; 
        this.showName = false;
        this.showCell = false;
        this.showSave = true;
        this.inputEnabled = false;
        this.showButtons = false;
        this.showAllDons = false;
        this.showDonation = true;
        this.showDonationDet = true;
        this.showText = false;
        this.showInput = true;
  }

  view(val: any){
    this.id = val;
    this.searchDonationByID() ;
  }

  getStatuses(){
    this.donationService.getDonationStatuses().subscribe( (res: any) =>
    {
      console.log(res);
      if(res.Message)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.router.navigate(["donation-management"])
      }
      else 
      {
        this.statuses = res.Statuses;
      }
      
    })
  }

  Save(){

    if(this.donation.DonAmount ==null || this.donation.DonDate ==null || this.donation.DonDescription ==null || this.donation.DonationStatusID ==null)
    {
      this.donationNull = true;
    }
    else
    {
      this.dialogService.openConfirmDialog('Are you sure you want to update this donation?')
      .afterClosed().subscribe(res => {
        if (res)
        {
          this.donationService.updateDonation(this.donation).subscribe( (res: any) =>
          {
            console.log(res);
            if (res.Message)
            {
              this.dialogService.openAlertDialog(res.Message);
              
            }
            this.router.navigate(["donation-management"])
          })
        }
      })
    }
  }

  removeDonation()
  {
    this.donationService.deleteDonation(this.donation.DonationID).subscribe( (res:any) =>
    {
      console.log(res);
      if (res.Message)
      {
        this.dialogService.openAlertDialog(res.Message);
        this.router.navigate(["donation-management"])
      }
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
