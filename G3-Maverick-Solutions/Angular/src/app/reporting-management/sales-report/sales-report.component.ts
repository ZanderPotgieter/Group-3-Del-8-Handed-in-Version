import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
//import * as jsPDF from 'jspdf';
import {jsPDF } from 'jspdf'
import 'jspdf-autotable';
import { Chart } from 'chart.js';
//import { ThrowStmt } from '@angular/compiler';
//import { max } from 'rxjs/operators';

//var jsPDF: any;

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {

  dateVal = new Date();

  selectedOption: any;
  showErrorMessage: boolean = false;
  //Customers:  object;
  Products:  object;
  Orders: object;
  TableData: object;
  totalBalance: any;

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(): void {
  }

  DownloadPDF()
  {
    this.reportService.getSaleReportData().subscribe ((res) =>
    {
      var doc = new jsPDF();

      //get height and width of pdf doc
      var pageHeight  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      let length = res['TableData'].length;
      let titles = res['TableData']. map(z => z.Details);
      let Totals = res['TableData'].map(z=> z.ProdTot);

      let finalY = 10;

      doc.setFontSize(40);
      doc.text("Customer Order Report", (pageWidth/2)-15,15)
      doc.setFontSize(14);
      for (let i=0; i<length; i++)
      {
        doc.text(titles[i]/*+ "(Account Balance: " + Balances[i]+ "%)"*/, (pageWidth/2) -25, finalY +23)
        //@ts-ignore
        doc.autoTable({startY: finalY +25, html: '#testing}' + i, useCss: true, head: [
          ['No.', 'Product Name', 'Price (R)', 'Quantity', 'Order Date', 'Status', 'Total']]})
          //@ts-ignore
          finalY = doc.autoTable.previous.finalY
      }

      doc.save('Customer_Order_Report.pdf');
    })
  }

  GenerateReport()
  {
    
    this.reportService.getSaleReportData().subscribe((res) =>{
      console.log(res);
      this.TableData= res['TableData'];
      

       let totalTot = res['TableData'].map((z) => z.ProdTot);
      const sum = totalTot.reduce((a,b) => a+b, 0);
      this.totalBalance = sum || 0;
      console.log(this.totalBalance); 
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
