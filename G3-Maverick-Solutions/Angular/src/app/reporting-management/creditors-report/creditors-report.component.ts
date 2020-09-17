import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-creditors-report',
  templateUrl: './creditors-report.component.html',
  styleUrls: ['./creditors-report.component.scss']
})
export class CreditorsReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  clickMethod(name: string) {
    if (name == 'example')
    {
      //if(window.confirm("Are you sure you wish to cancel?")) {
       // console.log("Implement delete functionality here");
      //}
      window.alert("Report successfully generated  and printed")
      window.alert("Information not available to generate report")
      window.alert("Error accessing report template")
      window.alert("Report successfully downloaded")
      window.alert("Error printing report")
    }
    
  }

}
