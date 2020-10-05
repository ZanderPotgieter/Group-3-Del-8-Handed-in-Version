import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';

//import * as jsPDF from 'jspdf';
import {jsPDF } from 'jspdf';
import 'jspdf-autotable';
//import { Chart } from 'chart.js';
//import { ThrowStmt } from '@angular/compiler';
//import { max } from 'rxjs/operators';

//var jsPDF: any;

@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit {

  showErrorMessage: boolean = false;
  TableData: object;
  totalBalance: any;
  Count: any;
  responseMessage: string = "Request not submitted";


  ngOnInit(): void {
  }

  constructor( private reportService: ReportService, private router: Router, ) { }



  DownloadPDF()
  {
    this.reportService.getCreditorReportData().subscribe ((res) =>
    {
      var doc = new jsPDF();

      //get height and width of pdf doc
      var pageHeight  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      let length = res['TableData'].lenght;
      let titles = res['TableData']. map(z => z.SupName);
      let Balances = res['TableData'].map(z=> z.Balance);

      let finalY = 10;

      doc.setFontSize(40);
      doc.text("User Report", (pageWidth/2)-15,15)
      doc.setFontSize(14);
      for (let i=0; i<length; i++)
      {
        doc.text(titles[i]+ "(Account Balance: " + Balances[i]+ "%)", (pageWidth/2) -25, finalY +23)
        //@ts-ignore
        doc.autoTable({startY: finalY +25, html: '#testing}' + i, useCss: true, head: [
          ['Payment Date', 'Payment Amount']]})
          //@ts-ignore
          finalY = doc.autoTable.previous.finalY
      }

      doc.save('Creditor_Order_Report.pdf');
    })
  }

  GenerateReport()
  {
    this.reportService.getUserReportData().subscribe((res: any ) =>{
      console.log(res);
      if (res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage);
      }
      else
      {
        this.TableData = res['TableData'];
        this.Count = res['Count'];
        /* let totalBal = res['TableData'].map((z) => z.Balances);
        const sum = totalBal.reduce((a,b) => a+b, 0);
        this.totalBalance = sum || 0;
        console.log(this.totalBalance);  */
      }
    })
  }

  cancel()
  {
    this.router.navigate(["reporting-management"])
  }

  PrintReport()
  {

  }

}
