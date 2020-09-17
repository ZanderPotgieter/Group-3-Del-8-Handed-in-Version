import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-creditor',
  templateUrl: './add-creditor.component.html',
  styleUrls: ['./add-creditor.component.scss']
})
export class AddCreditorComponent implements OnInit {

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
      window.alert("The creditor being added already exist") 
    }
    else if (name == 'unsuccessfulAdd')
    {
      window.alert("The adding of a creditor was unsuccessful") 
    }
    else if (name == 'successfulAdd')
    {
      window.alert("The creditor has been successfully added") 
    }
  }

}
