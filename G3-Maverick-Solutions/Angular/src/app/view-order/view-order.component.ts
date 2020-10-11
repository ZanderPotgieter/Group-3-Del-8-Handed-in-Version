import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerOrder } from '../customer-order-management/customer-order';
import { CustomerOrderService } from '../customer-order-management/customer-order.service';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss']
})
export class ViewOrderComponent implements OnInit {

  constructor(private api: CustomerOrderService, private router: Router, private fb: FormBuilder, private dialogService: DialogService) { }

  ngOnInit(): void {
  }
  CustomerOrder : CustomerOrder = new CustomerOrder();
CustomerOrderID: number;

  collectOrder(){
    this.dialogService.openConfirmDialog('Confirm the Customer has Collected the order?')
    .afterClosed().subscribe(res => {
      if(res){
    this.api.collectOrder(this.CustomerOrderID).subscribe( (res:any)=> {
      console.log(res);
      if(res.Message){
        this.dialogService.openAlertDialog(res.Message);}
      //this.router.navigate(["customer-management"])
    })
  }
  });
  }
}


