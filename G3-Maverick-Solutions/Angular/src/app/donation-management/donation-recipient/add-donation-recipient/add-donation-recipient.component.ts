import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DonationRecipient } from '../../donation-recipient';
import { NgModule } from '@angular/core';
import { DonationService } from '../../donation.service';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { DialogService } from '../../../shared/dialog.service';

@Component({
  selector: 'app-add-donation-recipient',
  templateUrl: './add-donation-recipient.component.html',
  styleUrls: ['./add-donation-recipient.component.scss']
})
export class AddDonationRecipientComponent implements OnInit {

  constructor(private donationService: DonationService, private router: Router , private fb: FormBuilder, private dialogService: DialogService) { }
  donForm: FormGroup;
  donationRecipient : DonationRecipient = new DonationRecipient();
  responseMessage: string = "Request Not Submitted";
  donNull: boolean = false;
  ngOnInit() {
    this.donForm= this.fb.group({  
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

  Save(){
    if(this.donationRecipient.DrName == null || this.donationRecipient.DrCell == null || this.donationRecipient.DrEmail == null || this.donationRecipient.DrStreetNr == null || this.donationRecipient.DrStreet == null || this.donationRecipient.DrArea == null || this.donationRecipient.DrCode == null )
    {
      this.donNull = true;
    }
    else{
      this.dialogService.openConfirmDialog('Are you sure you want to add the recipient?')
          .afterClosed().subscribe(res => {
            if(res){
    this.donationService.addDonationRecipient(this.donationRecipient).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
      this.router.navigate(["donation-management"])
    })
  }
  })
  }
  }

  Cancel(){
    this.router.navigate(["donation-management"])
  }
}
