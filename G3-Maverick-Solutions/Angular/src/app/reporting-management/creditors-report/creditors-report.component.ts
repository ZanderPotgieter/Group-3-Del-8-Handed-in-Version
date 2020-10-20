import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';

//import * as jsPDF from 'jspdf';
import {jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart } from 'chart.js';
//import { ThrowStmt } from '@angular/compiler';
//import { max } from 'rxjs/operators';

//var jsPDF: any;

@Component({
  selector: 'app-creditors-report',
  templateUrl: './creditors-report.component.html',
  styleUrls: ['./creditors-report.component.scss']
})
export class CreditorsReportComponent implements OnInit {

  showErrorMessage: boolean = false;
  TableData: object;
  totalBalance: any;
  responseMessage: string =  "Request not submitted";
  ChartData: object;
  chart: Chart ;
  showTable: boolean = false;
  showChart: boolean = false;


  ngOnInit(): void {
  }

  constructor( private reportService: ReportService, private router: Router, ) { }


  openHelp(){
    window.open("hhttps://ghelp.z1.web.core.windows.net/GenerateCreditorsSuppliersReport.html")
  }

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
      doc.text("Creditor Order Report", (pageWidth/2)-15,15)
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
    this.reportService.getCreditorReportData().subscribe((res: any) =>{
      console.log(res);
      if(res.Error!=null)
      {
        this.responseMessage = res.Error;
        alert(this.responseMessage);
      }
      else
      {
        this.TableData = res['TableData'];

        let totalBal = res['TableData'].map((z) => z.Balances);
        const sum = totalBal.reduce((a,b) => a+b, 0);
        this.totalBalance = sum || 0;
        console.log(this.totalBalance);
        this.showTable = true;
        this.showChart = false;
      } 
    })
  }

  GenerateGraph()
  {
    if (this.chart)
   {
      this.chart.destroy();
   }

    this.showChart = true;
    this.showTable = false;
     this.showErrorMessage =false;
     
     this.reportService.getCreditorGraphData().subscribe((res) =>
     {
       console.log(res);
       //this.TableData = res['TableData'];

       let keys = res['ChartData'].map((z)=>z.Name);
       let Vals = res['ChartData'].map((z)=>z.Sum[0]);
       

        let totalTot = res['ChartData'].map((z) => z.Sum[0]);
       const sum = totalTot.reduce((a,b) => a+b, 0);
       this.totalBalance = sum || 0;
       console.log(this.totalBalance);  

       var ctx = document.getElementById('canvas');
       this.chart = new Chart(ctx,{
       type: 'bar',
       data: {
         labels: keys,
         datasets: [
           {
           label:'Creditor account balances in Rands (amounts owed to creditors)',
           data: Vals,
           fill: false,
           barPercentage: 0.70,
           backgroundColor: [
             'rgba(54, 162, 235, 1)',
             'rgba(255, 99, 132, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(190, 204, 102, 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)',
             'rgba(102, 204, 194, 1)',
             'rgba(180, 75, 75, 1)'],
           borderColor: [
             'rgba(54, 162, 235, 1)',
             'rgba(255, 99, 132, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(190, 204, 102, 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)',
             'rgba(102, 204, 194, 1)',
             'rgba(180, 75, 75, 1)' ],
           borderWidth: 1}],
       options:{
           legend:{
             display: false,
           },
           title:{
             text: 'Amount owed to creditor',
             fontSize: 50,
             display: true,
           },
           scales:{
             xAxes: [{
               display: true,
             }],
             yAxes:[{
               display: true,
               ticks:{
               beginAtZero: true,
                 
               }
             }],
           }
         }
       }

     })
   });
  }

  cancel()
  {
    this.router.navigate(["reporting-management"])
  }

  PrintReport()
  {

  }

}
