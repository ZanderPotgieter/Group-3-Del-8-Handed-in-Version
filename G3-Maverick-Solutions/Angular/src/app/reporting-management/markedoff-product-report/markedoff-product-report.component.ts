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
  selector: 'app-markedoff-product-report',
  templateUrl: './markedoff-product-report.component.html',
  styleUrls: ['./markedoff-product-report.component.scss']
})
export class MarkedoffProductReportComponent implements OnInit {

  dateVal = new Date();

  constructor( private reportService: ReportService, private router: Router) { }

  selectedOption: any;
  showErrorMessage: boolean = false;
  chart: CharacterData;
  TableData: object;
  totalBalance: any;

 /* options = [
    {id: 1, data: 'Donated'},
    {id: 2, data: 'Stolen'},
    {id: 3, data: 'Expired'},
    {id: 4, data: 'Damaged'},
    {id: 5, data: 'All reasons'},  
  ];
 */

 DownloadPDF()
 {
   this.reportService.getMarkedOffProductReportData().subscribe ((res) =>
   {
     var doc = new jsPDF();

     //get height and width of pdf doc
     var pageHeight  = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
     var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // let length = res['TableData'].length;
    // let titles = res['TableData']. map(z => z.Name);
    // let Totals = res['TableData'].map(z=> z.ProdTot);

     let finalY = 160;
     var newCanvas =<HTMLCanvasElement>document.querySelector('#canvas');

     //create image from canvas
     var newCanvasImg = newCanvas.toDataURL("image/png",1.0);

     //create pdf from image
     doc.setFontSize(40);
     doc.text("Marked off product Report", (pageWidth/2)-30,15)
     doc.addImage(newCanvasImg, 'PNG', 25.,25,160,150);
     /* doc.setFontSize(14);
     for (let i=0; i<length; i++)
     {
       doc.text(titles[i]/*+ "(Account Balance: " + Balances[i]+ "%)", (pageWidth/2) -25, finalY +23)
       //@ts-ignore
       doc.autoTable({startY: finalY +25, html: '#testing}' + i, useCss: true, head: [
         ['Date', 'Product Name', 'Price (R)', 'Quantity','Reason', 'Total']]})
         //@ts-ignore
         finalY = doc.autoTable.previous.finalY
     } */

     doc.save('Marked_Off_Product_Report.pdf');
   }) 
 }

  ngOnInit(): void {
  }

  GenerateReport()
 {

   if (this.chart)
   {
     //this.chart.destroy();
   }

 
     this.showErrorMessage =false;
     
     this.reportService.getMarkedOffProductReportData().subscribe((res) =>
     {
       console.log(res);
       //this.TableData = res['TableData'];

       let keys = res['ChartData'].map((z)=>z.Name);
       let Vals = res['ChartData'].map((z)=>z.Sum);
       

        let totalTot = res['ChartData'].map((z) => z.Sum);
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
           label:'Quantity of Marked off products per mark off reason ',
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
             'rgba(180, 75, 75, 1)'
               

           ],
           borderColor: [
             
             'rgba(54, 162, 235, 1)',
             'rgba(255, 99, 132, 1)',
             'rgba(255, 206, 86, 1)',
             'rgba(190, 204, 102, 1)',
             'rgba(153, 102, 255, 1)',
             'rgba(255, 159, 64, 1)',
             'rgba(102, 204, 194, 1)',
             'rgba(180, 75, 75, 1)'
           ],
           borderWidth: 1
         }],
         options:{
           legend:{
             display: false,
           },
           title:{
             text: "Quantity marked off By mark off reason",
             fontSize: 50,
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

 


  

 

 
