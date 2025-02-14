import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { formatDate} from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DashboardService } from './dashboard.service';

//import * as jsPDF from 'jspdf';
import {jsPDF } from 'jspdf'
import 'jspdf-autotable';
import { Chart } from 'chart.js';
//import { ThrowStmt } from '@angular/compiler';
//import { max } from 'rxjs/operators';

//var jsPDF: any;


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  providers: [DatePipe],
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  dateVal = new Date();
  selectedOption: any;
  showErrorMessage: boolean = false;
  chart: Chart;
  TableData: object;
  totalBalance: any;
  pieChart: Chart; 
  date: string;

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver, private dashboardService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.GenerateReport();
    this.GeneratePieChart();
  }


  GenerateReport()
  {
 
    if (this.chart)
    {
       this.chart.destroy();
    }
 
  
      this.showErrorMessage =false;
      
      this.dashboardService.getSaleReportData().subscribe((res) =>
      {
        console.log(res);
        //this.TableData = res['TableData'];
 
        let keys = res['ChartData'].map((z)=>z.Name);
        let Vals = res['ChartData'].map((z)=>z.Sum);
        let today = res['Today'];

        /* var datePipe = new DatePipe('en-US');
        this.date = datePipe.transform(today, 'dd/MM/yyyy'); */
        
 
         let totalTot = res['ChartData'].map((z) => z.Sum);
        const sum = totalTot.reduce((a,b) => a+b, 0);
        this.totalBalance = sum || 0;
        console.log(this.totalBalance);  
 
        var ctx = document.getElementById('canvas');
        this.chart = new Chart('bar',{
        type: 'bar',
        data: {
          labels: keys,
          datasets: [
            {
              label:'Sales Revenue (in Rands) per container for current day',
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
                'rgba(180, 75, 75, 1)'],
              borderWidth: 1
            }],
         },
        options:{
            legend:{
              display: false,
            },
            title:{
              text: 'Sales Revenue (in Rands) per container for current day' ,
              fontSize: 15, 
              display: true,
            },
            scales:{
              xAxes: [{
                display: true,
                label: 'Revenue',
              }],
              yAxes:[{
                display: true,
                label: 'Containers',
                ticks:{
                beginAtZero: true,
                }
              }],
            }
          }
      })
    });
 }

 GeneratePieChart()
  {
 
    if (this.pieChart)
    {
       this.pieChart.destroy();
    }
 
  
      this.showErrorMessage =false;
      
      this.dashboardService.getSalePieChartData().subscribe((res) =>
      {
        console.log(res);
        //this.TableData = res['TableData'];
 
        let keys = res['ChartData'].map((z)=>z.Name);
        let Vals = res['ChartData'].map((z)=>z.Sum);
        let year = res['Year'];
        
 
         let totalTot = res['ChartData'].map((z) => z.Sum);
        const sum = totalTot.reduce((a,b) => a+b, 0);
        this.totalBalance = sum || 0;
        console.log(this.totalBalance);  
 
        var ctx = document.getElementById('canvas');
        this.pieChart = new Chart('pie',{
        type: 'pie',
        data: {
          labels: keys,
          datasets: [
            {
              label:'Sales Revenue (in Rands) per container for current year: ' + year,
              data: Vals, 
              fill: false,
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
                'rgba(180, 75, 75, 1)'],
              borderWidth: 1
          }],
        },
        options:{
            legend:{
              position: 'bottom',
              display: true,},
            title:{
              text: "Sales Revenue (in Rands) per container for current year: " + year,
              display: true,
              position: 'top',
              fontSize: 15,},
            animation: {
              animateScale: true,
              animateRotate: true,},
          }
      })
    });
 }

 
}
