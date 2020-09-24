import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

/*run npm i ngx-toastr */
import { ToastrModule } from 'ngx-toastr';
/*run npm i @angular/material - npm i @material/dialog*/
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';
import { ContainerManagementComponent } from './container-management/container-management.component';
import { ManagerManagementComponent } from './manager-management/manager-management.component';
import { GPSManagementComponent } from './gps-management/gps-management.component';
import { SalesManagementComponent } from './sales-management/sales-management.component';
import { CustomerManagementComponent } from './customer-management/customer-management.component';
import { CustomerOrderManagementComponent } from './customer-order-management/customer-order-management.component';
import { SupplierManagementComponent } from './supplier-management/supplier-management.component';
import { SupplierOrderManagementComponent } from './supplier-order-management/supplier-order-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { DonationManagementComponent } from './donation-management/donation-management.component';
import { CreditorManagementComponent } from './creditor-management/creditor-management.component';
import { ReportingManagementComponent } from './reporting-management/reporting-management.component';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './login-subsystem/user/user.component';
import { RegisterComponent } from './login-subsystem/user/register/register.component';
import { LoginComponent } from './login-subsystem/user/login/login.component'
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { ViewCustomerComponent } from './view-customer/view-customer.component';

import { LocationComponent } from './location/location.component';
import { CreateLocationComponent } from './location/create-location/create-location.component';
import { SearchLocationComponent } from './location/search-location/search-location.component';
import { AddSupplierComponent } from './add-supplier/add-supplier.component';
import { ViewSupplierComponent } from './view-supplier/view-supplier.component';
import { ResetpasswordComponent } from './login-subsystem/user/resetpassword/resetpassword.component';
import { CreateareaComponent } from './gps-management/createarea/createarea.component';
import { SearchareaComponent } from './gps-management/searcharea/searcharea.component';
import { AreadetailsComponent } from './gps-management/areadetails/areadetails.component';
import { UpdateareaComponent } from './gps-management/updatearea/updatearea.component';
import { CreateemployeeComponent } from './employee-management/createemployee/createemployee.component';
import { UpdateemployeeComponent } from './employee-management/updateemployee/updateemployee.component';
import { SearchemployeeComponent } from './employee-management/searchemployee/searchemployee.component';
import { CreateManagerComponent } from './create-manager/create-manager.component';
import { SearchManagerComponent } from './search-manager/search-manager.component';
import { UpdateManagerComponent } from './update-manager/update-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from '@angular/material/list';
import { UpdateLocationComponent } from './location/update-location/update-location.component';
import { MakeSaleComponent } from './sales-management/make-sale/make-sale.component';
import { PaymentSelectComponent } from './sales-management/payment-select/payment-select.component';
import { SearchSaleComponent } from './sales-management/search-sale/search-sale.component';
import { PlaceSupplierOrderComponent } from './supplier-order-management/place-supplier-order/place-supplier-order.component';
import { SearchSupplierOrderComponent } from './supplier-order-management/search-supplier-order/search-supplier-order.component';
import { SupplierDetailsComponent } from './supplier-order-management/supplier-details/supplier-details.component';
import { PlaceOrderComponent } from './place-order/place-order.component';
import { SendNotificationComponent } from './send-notification/send-notification.component';
import { SearchOrderComponent } from './search-order/search-order.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { CreateContainerComponent } from './create-container/create-container.component';
import { SearchContainerComponent } from './search-container/search-container.component';
import { DonationRecipientComponent } from './donation-management/donation-recipient/donation-recipient.component';
import { AddDonationRecipientComponent } from './donation-management/donation-recipient/add-donation-recipient/add-donation-recipient.component';
import { SearchDonationRecipientComponent } from './donation-management/donation-recipient/search-donation-recipient/search-donation-recipient.component';
import { ProductCategoryComponent } from './product-management/product-category/product-category.component';
import { AddProductCategoryComponent } from './product-management/product-category/add-product-category/add-product-category.component';
import { SearchProductCategoryComponent } from './product-management/product-category/search-product-category/search-product-category.component';
import { ProductComponent } from './product-management/product/product.component';
import { AddProductComponent } from './product-management/product/add-product/add-product.component';
import { SearchProductComponent } from './product-management/product/search-product/search-product.component';
import { SearchedProductDetailsComponent } from './product-management/product/searched-product-details/searched-product-details.component';
import { StockTakeComponent } from './product-management/product/stock-take/stock-take.component';

import { AddProvinceComponent } from './Province/add-province/add-province.component';
import { SearchProvinceComponent } from './Province/search-province/search-province.component';
import { AddCreditorComponent } from './creditor-management/add-creditor/add-creditor.component';
import { SearchCreditorComponent } from './creditor-management/search-creditor/search-creditor.component';
import { CreditorsReportComponent } from './reporting-management/creditors-report/creditors-report.component';
import { CustomerReportComponent } from './reporting-management/customer-report/customer-report.component';
import { MarkedoffProductReportComponent } from './reporting-management/markedoff-product-report/markedoff-product-report.component';
import { DonationReportComponent } from './reporting-management/donation-report/donation-report.component';
import { SalesReportComponent } from './reporting-management/sales-report/sales-report.component';
import { SupplierReportComponent } from './reporting-management/supplier-report/supplier-report.component';
import { ProductReportComponent } from './reporting-management/product-report/product-report.component';
import { CreateDonationComponent } from './donation-management/create-donation/create-donation.component';
import { SearchDonatedProductComponent } from './donation-management/search-donated-product/search-donated-product.component';
import { SearchDonationComponent } from './donation-management/search-donation/search-donation.component';
import { SearchedDonationDetailsComponent } from './donation-management/searched-donation-details/searched-donation-details.component';
import { UpdateDonationComponent } from './donation-management/update-donation/update-donation.component';
import { AddPaymentComponent } from './creditor-management/add-payment/add-payment.component';
import { SearchPaymentComponent } from './creditor-management/search-payment/search-payment.component';

import { HttpClientModule, HttpClient } from '@angular/common/http'; 
import { ProductCategoryService } from './product-management/product-category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';  
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { VatComponent } from './product-management/vat/vat.component';
import { AddVatComponent } from './product-management/vat/add-vat/add-vat.component';
import { UpdateVatComponent } from './product-management/vat/update-vat/update-vat.component';
import { SupplierDetailComponent } from './supplier-order-management/supplier-detail/supplier-detail.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTreeModule } from '@angular/material/tree';
import { AdminComponent } from './admin/admin.component';
import { UsertableComponent } from './usertable/usertable.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { StatusManagementComponent } from './status-management/status-management.component';
import { GenerateOTPComponent } from './login-subsystem/user/generate-otp/generate-otp.component';
import { UsersComponent } from './adminModels/statuses/users.component';
import {ViewStatusesComponent} from './adminModels/view-statuses/view-statuses.component';
import {MatRadioModule} from '@angular/material/radio';
import { UserTreeComponent } from './user-tree/user-tree.component';


@NgModule({
  declarations: [
    AppComponent,
    EmployeeManagementComponent,
    ContainerManagementComponent,
    ManagerManagementComponent,
    GPSManagementComponent,
    SalesManagementComponent,
    CustomerManagementComponent,
    CustomerOrderManagementComponent,
    SupplierManagementComponent,
    SupplierOrderManagementComponent,
    ProductManagementComponent,
    DonationManagementComponent,
    CreditorManagementComponent,
    ReportingManagementComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    AddCustomerComponent,
    ViewCustomerComponent,
   
    LocationComponent,
    CreateLocationComponent,
    SearchLocationComponent,
    AddSupplierComponent,
    ViewSupplierComponent,
    ResetpasswordComponent,
    CreateareaComponent,
    SearchareaComponent,
    AreadetailsComponent,
    UpdateareaComponent,
    CreateemployeeComponent,
    UpdateemployeeComponent,
    SearchemployeeComponent,
    AddProvinceComponent,
    SearchProvinceComponent,
    AddCreditorComponent,
    CreateManagerComponent,
    SearchManagerComponent,
    UpdateManagerComponent,
    UpdateLocationComponent,
    MakeSaleComponent,
    PaymentSelectComponent,
    SearchSaleComponent,
    PlaceSupplierOrderComponent,
    SearchSupplierOrderComponent,
    SupplierDetailsComponent,
    PlaceOrderComponent,
    SendNotificationComponent,
    SearchOrderComponent,
    ViewOrderComponent,
    CreateContainerComponent,
    SearchContainerComponent,
    DonationRecipientComponent,
    AddDonationRecipientComponent,
    SearchDonationRecipientComponent,
    ProductCategoryComponent,
    AddProductCategoryComponent,
    SearchProductCategoryComponent,
    ProductComponent,
    AddProductComponent,
    SearchProductComponent,
    SearchedProductDetailsComponent,
    StockTakeComponent,
    
    
    SearchCreditorComponent,
    CreditorsReportComponent,
    CustomerReportComponent,
    MarkedoffProductReportComponent,
    DonationReportComponent,
    SalesReportComponent,
    SupplierReportComponent,
    ProductReportComponent,
    CreateDonationComponent,
    SearchDonatedProductComponent,
    SearchDonationComponent,
    SearchedDonationDetailsComponent,
    UpdateDonationComponent,
    AddPaymentComponent,
    SearchPaymentComponent,
    VatComponent,
    AddVatComponent,
    UpdateVatComponent,
    SupplierDetailComponent,
    AdminDashboardComponent,
    AdminComponent,
    UsertableComponent,
    StatusManagementComponent,
    GenerateOTPComponent,
    UsersComponent,
    ViewStatusesComponent,
    UserTreeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatListModule,
    HttpClientModule,
    FormsModule,  
    ToastrModule.forRoot({
      progressBar: true
    }),
    MatRadioModule,
    ReactiveFormsModule, MatGridListModule, MatCardModule, MatMenuModule, MatIconModule, MatButtonModule, LayoutModule, MatTreeModule, MatTableModule, MatPaginatorModule, MatSortModule
  ],
  providers: [HttpClientModule, ProductCategoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }

