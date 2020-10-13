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
import { Product } from '../product'
import { DialogService } from '../../shared/dialog.service';


@Component({
  selector: 'app-search-donated-product',
  templateUrl: './search-donated-product.component.html',
  styleUrls: ['./search-donated-product.component.scss']
})
export class SearchDonatedProductComponent implements OnInit {

  angForm: FormGroup;

  showContainer: boolean = true;
  showNameSearch: boolean = false;
  donation: Donation = new Donation();
  products: Product[];
  containers: Container[];
  donatedProducts: DonatedProduct[];
  donationRecipient: DonationRecipient = new DonationRecipient();
  donatedProduct: DonatedProduct = new DonatedProduct();
  responseMessage: string = "Request Not Submitted";
  containerID: number;
  
  constructor(private donationService: DonationService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.donationService.getAllContainers().subscribe(value => {
      if (value!=null)
      {
        this.containers = value;
      }
    });
  }

  selectContainer()
  {

  }

  


 


}
