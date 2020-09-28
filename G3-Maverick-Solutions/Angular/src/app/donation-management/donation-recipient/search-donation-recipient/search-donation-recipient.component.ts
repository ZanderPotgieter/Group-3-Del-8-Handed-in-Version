import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DonationRecipient} from '../../donation-recipient';
import { NgModule } from '@angular/core';
import {DonationService} from '../../donation.service';
import { Observable } from 'rxjs';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
@Component({
  selector: 'app-search-donation-recipient',
  templateUrl: './search-donation-recipient.component.html',
  styleUrls: ['./search-donation-recipient.component.scss']
})
export class SearchDonationRecipientComponent implements OnInit {

  constructor(private donationSerive: DonationService, private router: Router , private fb: FormBuilder) { }
  donForm: FormGroup;
  donationRecipient : DonationRecipient = new DonationRecipient();
  responseMessage: string = "Request Not Submitted";

  showAll: boolean = false;
  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showSearch: boolean = false;
  showResults: boolean = false;
  allRecipients: Observable<DonationRecipient[]>;

  name : string;
  surname : string;
  donNull: boolean = false;
  ngOnInit() {
    this.donForm= this.fb.group({  
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      surname :  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35), Validators.pattern('[a-zA-Z ]*')]],  
      DrName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25), Validators.pattern('[a-zA-Z ]*')]],  
      DrSurname :  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35), Validators.pattern('[a-zA-Z ]*')]],  
      DrCell :  ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9 ]*")]],  
      DrEmail :  ['', [Validators.required, Validators.email]],  
      DrStreetNr :  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern("[0-9 ]*")]],  
      DrStreet :  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35), Validators.pattern('[a-zA-Z ]*')]],  
      DrArea :  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35), Validators.pattern('[a-zA-Z ]*')]],  
      DrCode : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern("[0-9 ]*")]],  
      
       
    });
  }

  All(){
    this.allRecipients = this.donationSerive.getAllDonationRecipients();
    this.showAll = true;
    this.showSearch = false;
  }

  Input(){
    this.showSearch = true;
    this.showAll = false;
  }

  Search(){
    if(this.name == null || this.surname ==null)
    {
      this.donNull = true;
      this.showSearch = true;
      this.showResults = false;
    }
    else{
    this.donationSerive.searchDonationRecipient(this.name,this.surname).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message != null){
      this.responseMessage = res.Message;
      alert(this.responseMessage)}
      else{
          this.donationRecipient.RecipientID = res.RecipientID;
          this.donationRecipient.DrName = res.DrName;
          this.donationRecipient.DrSurname = res.DrSurname;
          this.donationRecipient.DrCell = res.DrCell;
          this.donationRecipient.DrEmail = res.DrEmail;
          this.donationRecipient.DrStreetNr = res.DrStreetNr;
          this.donationRecipient.DrStreet = res.DrStreet;
          this.donationRecipient.DrCode = res.DrCode;
          this.donationRecipient.DrArea = res.DrArea;
      }
      
      this.showSearch = true;
      this.showResults = true;
      
    })
  }
  }

  Cancel(){
    this.router.navigate(["donation-management"])
  }

  Update(){
    this.showSave = true;
    this.inputEnabled = false;
    this.showButtons = false;
  }

  Save(){
    this.donationSerive.updateDonationRecipient(this.donationRecipient).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["donation-management"])
    })
  }
  
  Delete(){
    this.donationSerive.deleteDonationRecipient(this.donationRecipient.RecipientID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
      this.responseMessage = res.Message;}
      alert(this.responseMessage)
      this.router.navigate(["donation-management"])
    })
  }

  cancel(){
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false;
  }

}
