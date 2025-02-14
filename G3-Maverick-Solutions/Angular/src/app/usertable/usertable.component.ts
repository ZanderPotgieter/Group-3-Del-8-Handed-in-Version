import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { UsertableDataSource } from './usertable-datasource';
import {Users} from '../adminModels/users';

import {AdminService} from '../admin.service';

@Component({
  selector: 'app-usertable',
  templateUrl: './usertable.component.html',
  styleUrls: ['./usertable.component.scss']
})
export class UsertableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Users>;
  dataSource: UsertableDataSource;

  constructor(private api: AdminService){}
  dataList: Users[] = [];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['UserName', 'UserSurname', 'UserCell', 'UserEmail', 'UserType'];

  ngOnInit() {
    this.api.getAllUsers().subscribe( (res:any)=> {
      console.log(res);
      this.dataSource = res;

    })
    //new UsertableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
