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
import {CustomerOrderStatus} from '../customer-order-status';
@Component({
  selector: 'app-customer-report',
  templateUrl: './customer-report.component.html',
  styleUrls: ['./customer-report.component.scss']
})
export class CustomerReportComponent implements OnInit {
  
 
 stats: CustomerOrderStatus[];
  dateVal = new Date();

  selectedOption: number;
  showErrorMessage: boolean = false;
  Customers:  object;
  Products:  object;
  Orders: object;
  TableData: object;
  totalBalance: any;
  responseMessage: string = "request not submitted";

  options = [
    {id: 1, data: 'Placed'},
    {id: 2, data: 'Fulfilled'},
    {id: 3, data: 'Collected'},
    {id: 4, data: 'Cancelled'},
    {id: 5, data: 'All Statuses'},  
  ];

  constructor(private reportService: ReportService, private router: Router) { }

  ngOnInit(){
    return this.reportService.getAllCustomerOrderStauts().subscribe((res: any)=>{
      console.log(res);
      this.stats = res;
      if (res.Error){
        alert(res.Error);
      }
    })
  }
  setStatus(val: CustomerOrderStatus){
    this.selectedOption= val.CustomerOrderStatusID;
  }
  DownloadPDF()
  {
    this.reportService.getCustomerOrderReportData(this.selectedOption).subscribe ((res) =>
    {
      var doc = new jsPDF();

      //get height and width of pdf doc
      var pageHeight  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      let length = res['Customers'].length;
      let titles = res['Customers']. map(z => z.Details);
      let Totals = res['Customers'].map(z=> z.ProdTot);

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
    if (this.selectedOption == undefined){
     this.showErrorMessage= true;
    }
    else
    {
    this.showErrorMessage =false;
    
    this.reportService.getCustomerOrderReportData(this.selectedOption).subscribe((res:any) =>{
      console.log(res);
      if (res.Error != null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage);
        
      }
      else
      {
        this.Customers = res['Customers'];
        let totalTot = res['Customers'].map((z) => z.ProdTot);
        const sum = totalTot.reduce((a,b) => a+b, 0);
        this.totalBalance = sum || 0;
        console.log(this.totalBalance);
      }
    })
    }
  }

  cancel()
  {
    this.router.navigate(["reporting-management"])
  }

  PrintReport()
  {

  }

}
