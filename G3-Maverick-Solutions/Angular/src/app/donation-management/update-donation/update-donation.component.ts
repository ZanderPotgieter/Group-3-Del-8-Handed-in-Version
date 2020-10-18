import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-donation',
  templateUrl: './update-donation.component.html',
  styleUrls: ['./update-donation.component.scss']
})
export class UpdateDonationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openHelp(){
    window.open("https://ghelp.z1.web.core.windows.net/UpdateDonation.html")
  }

  clickMethod(name: string) {
    if (name == 'confirmCancel')
    {
      if(window.confirm("Are you sure you wish to cancel?")) {
        console.log("Implement delete functionality here");
      }
    }
    else if (name == 'fieldsIncomplete')
    {
      window.alert("Some of the input fields were not completed. Please return and correct") 
    }
    else if (name == 'invalidInputs')
    {
      window.alert("Some of the data input is invalid. Please return and correct") 
    }
    else if (name == 'duplicateRecord')
    {
      window.alert("The province being added already exist.")
    }
    else if (name == 'unsuccessfulAdd')
    {
      window.alert("The adding of a province was unsuccessful") 
    }
    else if (name == 'successfulAdd')
    {
      window.alert("The province has been successfully added") 
    }
  }

}
