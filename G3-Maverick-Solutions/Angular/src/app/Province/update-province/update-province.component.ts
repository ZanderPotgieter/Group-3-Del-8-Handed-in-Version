import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-province',
  templateUrl: './update-province.component.html',
  styleUrls: ['./update-province.component.scss']
})
export class UpdateProvinceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
      if(window.confirm("The province being added already exist. Would you like to add a new province")) {
        console.log("Implement delete functionality here");
      }
    }
    else if (name == 'recordNotFound')
    {
      window.alert("Record not found") 
    }
    else if (name == 'successfulAdd')
    {
      window.alert("The province has been successfully added") 
    }

  }

}
