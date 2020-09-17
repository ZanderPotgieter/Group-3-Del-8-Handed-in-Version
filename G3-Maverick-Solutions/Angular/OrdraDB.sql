use Master 
go

Create Database OrdraDB
go 

use OrdraDB 
go 

CREATE TABLE User_Type
(
	UserTypeID int Primary Key identity(1,1) Not Null,
	UTypeDescription varchar(255)
)
GO

CREATE TABLE [User]
(
	UserID int Primary Key identity(1,1) Not Null,
	UserTypeID int,
	UserPassword varchar(50),
	UserName varchar(25),
	UserSurname varchar(35),
	UserCell varchar(10),
	UserEmail varchar(75),
	CONSTRAINT FK_UserType FOREIGN KEY (UserTypeID)
    REFERENCES User_Type(UserTypeID)
)
GO

CREATE TABLE [Login]
(
	LoginID int Primary Key identity(1,1) Not Null,
	UserID int,
	LoginTime time,
	LoginDate date,
	CONSTRAINT FK_LoginUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE Logout
(
	LogoutID int Primary Key identity(1,1) Not Null,
	UserID int,
	LogoutTime time,
	LogoutDate date,
	CONSTRAINT FK_LogoutUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE Employee
(
	EmployeeID int Primary Key identity(1,1) Not Null,
	EmpStartDate date,
	EmpShiftsCompleted int,
	UserId int,
	CONSTRAINT FK_EmployeeUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE [Shift]
(
	ShiftID int Primary Key identity(1,1) Not Null,
	[Date] date,
	ShiBegin time,
	ShiEnd time
)
GO

CREATE TABLE User_Shift
(
	ShiftID int,
	UserID int,
	Primary Key (ShiftID, UserID),
	CONSTRAINT FK_USShift FOREIGN KEY (ShiftID)
    REFERENCES [Shift](ShiftID),
	CONSTRAINT FK_USUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE Stock_Take
(
	StockTakeID int Primary Key identity(1,1) Not Null,
	EmployeeID int,
	STakeDate date,
	STakeQuantity int,
	ProdCategory varchar(25),
	ProdName varchar(25),
	CONSTRAINT FK_STakeEmployee FOREIGN KEY (EmployeeID)
    REFERENCES Employee(EmployeeID)
)
GO

CREATE TABLE Manager
(
	ManagerID int Primary Key identity(1,1) Not Null,
	UserID int,
	ManQualification varchar(100),
	ManNationality varchar(35),
	ManIDNumber varchar(13),
	ManNextOfKeenFName varchar(50),
	ManNextOfKeenCell varchar(10),
	CONSTRAINT FK_ManagerUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE Container
(
	ContainerID int Primary Key identity(1,1) Not Null,
	ConName varchar(25),
	ConDescription varchar(255)
)
GO

CREATE TABLE Manager_Container
(
	ManagerID int,
	ContainerID int,
	Primary Key(ManagerID, ContainerID),
	CONSTRAINT FK_MCManager FOREIGN KEY (ManagerID)
    REFERENCES Manager(ManagerID),
	CONSTRAINT FK_MCContainer FOREIGN KEY (ContainerID)
    REFERENCES Container(ContainerID)
)
GO

CREATE TABLE Customer_Order_Status
(
	CustomerOrderStatusID int Primary Key identity(1,1) Not Null,
	CODescription varchar(255)
)
GO

CREATE TABLE Sale
(
	SaleID int Primary Key identity(1,1) Not Null,
	UserID int,
	SaleDate date,
	CONSTRAINT FK_SaleUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID)
)
GO

CREATE TABLE Product_Category
(
	ProductCategoryID int Primary Key identity(1,1) Not Null,
	PCatName varchar(25),
	PCatDescription varchar(255)
)
GO

CREATE TABLE Product
(
	ProductID int Primary Key identity(1,1) Not Null,
	ProductCategoryID int,
	ProdName varchar(25),
	ProdDesciption varchar(255),
	ProdReLevel int,
	CONSTRAINT FK_ProdPCat FOREIGN KEY (ProductCategoryID)
    REFERENCES [Product_Category](ProductCategoryID)

)
GO

CREATE TABLE Product_Sale
(
	ProductID int,
	SaleID int,
	PSQuantity int,
	Primary Key(ProductID, SaleID),
	CONSTRAINT FK_ProdSProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_PSSale FOREIGN KEY (SaleID)
    REFERENCES Sale(SaleID)
)
GO

CREATE TABLE Payment_Type
(
	PaymentTypeID int Primary Key identity(1,1) Not Null,
	PTDescription varchar(255)
)
GO

CREATE TABLE Customer
(
	CustomerID int Primary Key identity(1,1) Not Null,
	CusName varchar(25),
	CusSurname varchar(35),
	CusCell varchar(10),
	CusEmail varchar(75),
	CusStreetNr varchar(10),
	CusStreet varchar(35),
	CusCode varchar(4),
	CusSuburb varchar(35)
)
GO

CREATE TABLE Customer_Order
(
	CustomerOrderID int Primary Key identity(1,1) Not Null,
	CustomerID int,
	UserID int,
	CustomerOrderStatusID int,
	CusOrdNumber varchar(5),
	CusOrdDate date
	CONSTRAINT FK_COCustomer FOREIGN KEY (CustomerID)
    REFERENCES Customer(CustomerID),
	CONSTRAINT FK_COUser FOREIGN KEY (UserID)
    REFERENCES [User](UserID),
	CONSTRAINT FK_COStatus FOREIGN KEY (CustomerOrderStatusID)
    REFERENCES Customer_Order_Status(CustomerOrderStatusID),
)
GO

CREATE TABLE Payment
(
	PaymentID int Primary Key identity(1,1) Not Null,
	PaymentTypeID int,
	SaleID int,
	CustomerOrderID int,
	PayDate date,
	PayAmount float(2),
	CONSTRAINT FK_PCusOrder FOREIGN KEY (CustomerOrderID)
    REFERENCES Customer_Order(CustomerOrderID),
	CONSTRAINT FK_PaymentType FOREIGN KEY (PaymentTypeID)
    REFERENCES Payment_Type(PaymentTypeID),
	CONSTRAINT FK_SalePayment FOREIGN KEY (SaleID)
    REFERENCES Sale(SaleID)
)
GO

CREATE TABLE Location_Status
(
	LocationStatusID int Primary Key identity(1,1) Not Null,
	LSDescription varchar(255)
)
GO

CREATE TABLE Province
(
	ProvinceID int Primary Key identity(1,1) Not Null,
	ProvName varchar(15)
)
GO

CREATE TABLE Area_Status
(
	AreaStatusID int Primary Key identity(1,1) Not Null,
	ASDescription varchar(255)
)
GO

CREATE TABLE Area
(
	AreaID int Primary Key identity(1,1) Not Null,
	AreaStatusID int,
	ProvinceID int,
	ArName varchar(25),
	ArPostalCode varchar(4),
	CONSTRAINT FK_AAreaStatus FOREIGN KEY (AreaStatusID)
    REFERENCES Area_Status(AreaStatusID),
	CONSTRAINT FK_AProvince FOREIGN KEY (ProvinceID)
    REFERENCES Province(ProvinceID)
)
GO

CREATE TABLE [Location]
(
	LocationID int Primary Key identity(1,1) Not Null,
	ContainerID int, 
	LocationStatusID int, 
	AreaID int,
	LocName varchar(25),
	CONSTRAINT FK_LContainer FOREIGN KEY (ContainerID)
    REFERENCES Container(ContainerID),
	CONSTRAINT FK_LLocationStatus FOREIGN KEY (LocationStatusID)
    REFERENCES Location_Status(LocationStatusID),
	CONSTRAINT FK_LArea FOREIGN KEY (AreaID)
    REFERENCES Area(AreaID)
)
GO

CREATE TABLE Container_Product
(
	ContainerID int,
	ProductID int,
	CPQuantity int,
	Primary Key(ContainerID, ProductID),
	CONSTRAINT FK_CPContainer FOREIGN KEY (ContainerID)
    REFERENCES Container(ContainerID),
	CONSTRAINT FK_CPProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID)
)
GO

CREATE TABLE VAT
(
	VATID int Primary Key identity(1,1) Not Null,
	VATPerc float(2),
	VATDate date
)
GO

CREATE TABLE Product_Order_Line 
(
	CustomerOrderID int,
	ProductID int,
	PLQuantity int,
	Primary Key(CustomerOrderID, ProductID),
	CONSTRAINT FK_POLCustomerOrder FOREIGN KEY (CustomerOrderID)
    REFERENCES Customer_Order(CustomerOrderID),
	CONSTRAINT FK_POLProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID)
)
GO

CREATE TABLE Price
(
	PriceID int Primary Key identity(1,1) Not Null,
	ProductID int,
	UPriceR float(2),
	PriceDate date,
	CPriceR float(2)
	CONSTRAINT FK_ProductPrice FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID)
)
GO

CREATE TABLE Supplier
(
	SupplierID int Primary Key identity(1,1) Not Null,
	SupName varchar(25),
	SupCell varchar(10),
	SupEmail varchar(75),
	SupStreetNr varchar(10),
	SupStreet varchar(35),
	SupSuburb varchar(35),
	SupCode varchar(4)
)
GO

CREATE TABLE Creditor
(
	CreditorID int Primary Key identity(1,1) Not Null,
	SupplierID int,
	CredAccountBalance float(2),
	CONSTRAINT FK_CredSupplier FOREIGN KEY (SupplierID)
    REFERENCES Supplier(SupplierID)
	
)
GO

CREATE TABLE Creditor_Payment
(
	PaymentID int Primary Key identity(1,1) Not Null,
	CreditorID int,
	CredPaymentDate date,
	CredPaymentAmount float(2),
	CONSTRAINT FK_CredPayment FOREIGN KEY (CreditorID)
    REFERENCES Creditor(CreditorID)
)
GO

CREATE TABLE Product_Supplier
(
	ProductID int,
	SupplierID int,
	Primary Key (ProductID, SupplierID),
	CONSTRAINT FK_PSProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_PSSupplier FOREIGN KEY (SupplierID)
    REFERENCES Supplier(SupplierID)
)
GO

CREATE TABLE Supplier_Order_Status
(
	SupplierOrderStatusID int Primary Key identity(1,1) Not Null,
	SOSDescription varchar(255)
)
GO

CREATE TABLE Supplier_Order
(
	SupplierOrderID int Primary Key identity(1,1) Not Null,
	SupplierID int,
	SupplierOrderStatusID int,
	SODate date,
	CONSTRAINT FK_SOSupplier FOREIGN KEY (SupplierID)
    REFERENCES Supplier(SupplierID),
	CONSTRAINT FK_SOStatus FOREIGN KEY (SupplierOrderStatusID)
    REFERENCES Supplier_Order_Status(SupplierOrderStatusID)

)
GO

CREATE TABLE Supplier_Order_Product
(
	ProductID int,
	SupplierOrderID int, 
	SOPQuantity int,
	Primary Key (ProductID, SupplierOrderID),
	CONSTRAINT FK_SOPProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_SOPSupplierOrder FOREIGN KEY (SupplierOrderID)
    REFERENCES Supplier_Order(SupplierOrderID)
)
GO

CREATE TABLE Donation_Recipient
(
	RecipientID int Primary Key identity(1,1) Not Null,
	DrName varchar(25),
	DrSurname varchar(35),
	DrCell varchar(10),
	DrEmail varchar(75),
	DrStreetNr varchar(10),
	DrStreet varchar(35),
	DrArea varchar(35),
	DrCode varchar(4)
)
GO

CREATE TABLE Donation_Status
(
	DonationStatusID int Primary Key identity(1,1) Not Null,
	DSDescription varchar(255)
)
GO

CREATE TABLE Donation
(
	DonationID int Primary Key identity(1,1) Not Null,
	DonationStatusID int,
	RecipientID int,
	DonAmount float(2),
	DonDate date,
	DonDescription varchar(255),
	CONSTRAINT FK_DonStatus FOREIGN KEY (DonationStatusID)
    REFERENCES Donation_Status(DonationStatusID),
	CONSTRAINT FK_DonRecipient FOREIGN KEY (RecipientID)
    REFERENCES Donation_Recipient(RecipientID)

)
GO

CREATE TABLE Donated_Product
(
	ProductID int,
	DonationID int,
	DPQuantity int,
	Primary Key(ProductID, DonationID),
	CONSTRAINT FK_DPProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_DPDonation FOREIGN KEY (DonationID)
    REFERENCES Donation(DonationID)
)
GO

CREATE TABLE Marked_Off_Reason
(
	ReasonID int Primary Key identity(1,1) Not Null,
	MODescription varchar(255)
)
GO

CREATE TABLE Marked_Off
(
	MarkedOffID int Primary Key identity(1,1) Not Null,
	ProductID int,
	ReasonID int,
	MoQuantity int,
	MoDate date,
	CONSTRAINT FK_MOProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_MOReason FOREIGN KEY (ReasonID)
    REFERENCES Marked_Off_Reason(ReasonID)

)
GO








