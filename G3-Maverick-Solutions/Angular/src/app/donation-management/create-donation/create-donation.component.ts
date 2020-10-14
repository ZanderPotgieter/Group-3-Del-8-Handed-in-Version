import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms';
import { DonationService } from '../donation.service';
import { DonatedProduct } from '../donated-product';
import { Donation } from '../donation';
import { DonationRecipient } from '../donation-recipient';
import { DonationStatus } from '../donation-status';
import { ContainerProduct  } from '../container-product';
import { Product } from '../product';
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
  donationStatus: DonationStatus = new DonationStatus();
  responseMessage: string = "Request Not Submitted";
  donationForm: any;
  donation1: Donation = new Donation();

  showSave: boolean = false;
  showButtons: boolean = true;
  inputEnabled:boolean = true;
  showAddDon: boolean = false
  showResults: boolean = false;
  showDonation: boolean = true;
  cell : string;
  
  showSearch: boolean = true;
  showCell: boolean = false;
  showName: boolean = false;

  statuses: DonationStatus[];
  containers: Container[];
  container: Container = new Container();
  product: Product = new Product();

  name: string;
  surname: string;

  inputDisabled:boolean = true;
  showAddProduct: boolean = false;
  showSearchSelection: boolean = false;
  showNameSearch: boolean = false;
  showContainer: boolean = false;
  showTable: boolean = false;
  showDonatedProduct: boolean = false;

  containerID: number;
  donationID: number;
  productID: number;
  dpQuantity: number;

  donationNull: boolean = false;
  
  products: Product[];
  donatedProducts: DonatedProduct[];
  containerProducts: ContainerProduct[];
  prodNotSelected: boolean = false;
  prodBarcode: string;
 


  //donForm: FormGroup;

  selectContainer(id: any)
  {
    this.showNameSearch = true;
    this.showContainer = false;
    this.showName = false;
    this.showCell = false;
    this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = false;
    this.showDonation = false;
    this.showDonatedProduct = true;
    
    this.showSearch = false;
    this.showResults = false; 
    this.showAddDon = false;
    this.containerID = id;
    this.donationService.getAllContainerProducts(this.containerID).subscribe((value:any) => {
      if (value!=null)
      {
        this.containerProducts = value.ContainerProducts;
        this.products = value.Products;
      }
    });
  }

  addProduct(prodID: any, prodQuantity: any)
  {
    this.productID = prodID;
    this.dpQuantity = prodQuantity;
    this.getAddedDonation();
    console.log(this.productID);
    console.log(this.containerID);
    console.log(this.donationID);
    console.log(this.dpQuantity);
    /* this.donationService.addDonatedProduct(this.productID, this.containerID, this.donationID, this.dpQuantity).subscribe( (res:any)=> 
    {

      console.log(res);
      if(res.Message == "Donated Products Added Successfully")
      {
        //this.dialogService.openAlertDialog(res.Message);
        this.donatedProducts = res.DonatedProduct;
        this.showTable = true;
      }
      else{
        this.dialogService.openAlertDialog(res.Message);
      }
    })  */   
  }

  saveProducts()
  {
    //this.dialogService.openAlertDialog('Donated products added successfully');
    this.router.navigate(['donation-management']);
  }

  deleteProduct()
  {

  }

  ContainerSelection(val: Container){
    this.setContainer(val);
  }
  
  setContainer(val: Container){
    //this.currentContainer = val;
    this.containerID = val.ContainerID;
    this.container = val;
    //this.containerSelected = true;
   // this.showContainerNotSelected = false;
  
  }

  ProductSelection(val: Product){
    if(val == null){
      this.prodNotSelected= true
    }
    this.prodPush(val);
  }

  prodPush(val: Product){
    this.product = val;
    this.productID = val.ProductID;
    this.prodBarcode = val.ProdBarcode;
    }

  ngOnInit(): void {
    this.donationService.getDonationStatuses().subscribe(value => {
        if (value!=null){
          this.statuses = value;
        }
      });

      this.donationService.getAllContainers().subscribe(value => {
        if (value!=null)
        {
          this.containers = value;
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
        ContainerID: [''],
        ProductID: [''],
        DPQuantity: [''], 
         
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
    this.showDonation = true;
    this.showDonatedProduct = false;
    this.showContainer = false;
    this.showNameSearch = false;
    this.showTable = false;
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
    this.showDonation = true;
    this.showDonatedProduct = false;
    this.showContainer = false;
    this.showNameSearch = false;
    this.showTable = false;
  
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
        this.donationRecipient.DrCell = res.DrCell;
        this.donationRecipient.DrEmail = res.DrEmail;

        this.showSearch = true;
        this.showResults = true;
        this.showAddDon = true;
        this.showDonation = true;
        this.showDonatedProduct = false;
        this.showContainer = false;
        this.showNameSearch = false;
        this.showTable = false;

      }
      

    })
  }

  searchDonationRecipientByName()
  {
    if (this.name == null || this.surname==null)
    {
      this.donationNull = true;
    }
    else
    {
      this.donationService.searchDonationRecipientByName(this.name, this.surname).subscribe( (res:any) =>
      {
        console.log(res);
        if(res.Message != null)
        {
          this.dialogService.openAlertDialog(res.Message);
        }
        else
        {
          console.log(res)
          this.donationRecipient.RecipientID = res.RecipientID;
          this.donationRecipient.DrName = res.DrName;
          this.donationRecipient.DrSurname = res.DrSurname;
          this.donationRecipient.DrCell = res.DrCell;
          this.donationRecipient.DrEmail = res.DrEmail;
          this.cell = res.DrCell;

          this.showSearch = true;
          this.showResults = true;
          this.showAddDon = true;
          this.showDonation = true;
          this.showDonatedProduct = false;
          this.showContainer = false;
          this.showNameSearch = false;
          this.showTable = false;
        }
      })
    }
  }

  addDonation()
  {
   this.donation1.RecipientID = this.donationRecipient.RecipientID;
   this.donation1.DonationStatusID = this.donation.DonationStatusID;
   this.donation1.DonDescription = this.donation.DonDescription;
   this.donation1.DonDate =  this.donation.DonDate;
   this.donation1.DonAmount = this.donation.DonAmount;
   this.cell = this.donationRecipient.DrCell;
   console.log(this.donation1)

    if (this.donation1.DonAmount==null || this.donation1.DonDate== null || this.donation1.DonDescription==null || this.donation1.RecipientID==null || this.donation1.DonationStatusID==null)
    {
      this.donationNull = true;
    }
    else
    {
      this.dialogService.openConfirmDialog('Are you sure you want to add this donation?')
      .afterClosed().subscribe(res => {
        if (res)
        {
          this.donationService.addDonation(this.donation1).subscribe( (res:any)=> 
          {
            console.log(res);
            if(res.Message == "Donation Add Successful")
            {
              //this.dialogService.openAlertDialog(res.Message);
              alert(res.Message);
              this.showContainer = true; 
              this.showNameSearch = false;
              this.showSearch = false;
              this.showSave = false;
              this.showTable = false;
              this.showName = false;
              this.showCell = false;
              this.showSearch = false;
              this.showResults = false;
              this.showAddDon = false;
              this.showDonation = false;
              this.showDonatedProduct = true;
            }
            else 
            {
              //this.dialogService.openAlertDialog(res.Message);
              alert(res.Message);
              this.router.navigate(["donation-management"])
            }
          })
        }
      })
    }
    
  }

  getAddedDonation()
  {
    this.donationService.getAddedDonation(this.cell).subscribe( (res: any) =>
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
        this.donationID = res.donation.DonationID;

        //this.donationStatus.DSDescription = res.donation.DonStatus;
        //this.donationStatus.DonationStatusID = res.donation.DonationStatusID;
        
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
   /*  this.showSave = false;
    this.inputEnabled = false;
    this.showButtons = true;
    
    this.showSearch = true;
    this.showResults = false; */
    this.router.navigate(["donation-management"])
  }

  


}
