import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [DatePipe],
  styleUrls: ['./app.component.scss']
})




export class AppComponent {
  title = 'ORDRA';
  dateVal = new Date();
}
