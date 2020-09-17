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
	SessionID varChar(50) Null,
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
	UserID int,
	EmpStartDate date,
	EmpShiftsCompleted int,
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
	ProdName varchar(50),
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
	ProdBarcode varchar(50),
	ProdName varchar(50),
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
	VATStartDate date,
	VATEndDate date
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
	PriceStartDate date,
	PriceEndDate date,
	CPriceR float(2),
	CONSTRAINT FK_ProductPrice FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID)
)
GO

CREATE TABLE Supplier
(
	SupplierID int Primary Key identity(1,1) Not Null,
	SupName varchar(50),
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

CREATE TABLE Return_Product
(
	ReturnProductID int Primary Key identity(1,1) Not Null,
	ProductID int,
	ContainerID int, 
	Quantity int,
	CONSTRAINT FK_RetProdProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
	CONSTRAINT FK_RPContainer FOREIGN KEY (ContainerID)
    REFERENCES Container(ContainerID),
)
GO

CREATE TABLE Product_Backlog
(
	ProductBackLogID int Primary Key identity(1,1) Not Null,
	CustomerOrderID int, 
	ProductID int, 
	QauntityToOrder int,
	CONSTRAINT FK_PBLogCustomerOrder FOREIGN KEY (CustomerOrderID)
    REFERENCES Customer_Order(CustomerOrderID),
	CONSTRAINT FK_PBLogProduct FOREIGN KEY (ProductID)
    REFERENCES Product(ProductID),
)
GO

use OrdraDB

INSERT INTO User_Type (UTypeDescription)
VALUES ('Manager'), 
	   ('Employee'),
	   ('Admin');

INSERT INTO [User] (UserTypeID,[SessionID], UserPassword, UserName, UserSurname, UserCell, UserEmail)
VALUES ('1', '897589589akje', 'Password!01', 'James', 'Smith', '081234987', 'Jamessmith@gmail.com'),
	   ('1','kleh93yiu', 'WillBrwn90', 'Willow', 'Brown', '0717309827', 'willowbrown@yahoo.com'),
	   ('2','fbewiu3y27', 'CartPat33', 'Patrick', 'Carter', '0629016806', 'patrickcarter@gmail.com');

INSERT INTO [Login] (UserID, LoginTime, LoginDate)
VALUES ('2', '2020-02-11', '06:45:51'),   
	   ('1', '2020-05-23', '13:23:44'),
	   ('3', '2020-08-01', '06:23:12');

INSERT INTO Logout(UserID, LogoutTime, LogoutDate)
VALUES ('2', '2020-02-11', '17:57:44'),   
	   ('1', '2020-05-23', '16:12:19'),
	   ('3', '2020-08-01', '18:07:32');

INSERT INTO Employee (UserID, EmpStartDate, EmpShiftsCompleted)
VALUES ('2', '2019-10-15', '56'),
	   ('1', '2019-03-01', '112'),
	   ('3', '2020-02-28', '25');

INSERT INTO [Shift] ([Date], ShiBegin, ShiEnd)
VALUES ('2020-10-11', '06:25:46', '18:03:32'),
	   ('2020-10-12', '06:45:23', '18:12:34'),
	   ('2020-10-13', '06:33:17', '18:05:12');

INSERT INTO User_Shift (ShiftID, UserID)
VALUES ('1', '3'),
	   ('2', '1'),
	   ('3', '2');

INSERT INTO Stock_Take (EmployeeID, STakeDate, STakeQuantity, ProdCategory, ProdName)
VALUES ('1', '2020-03-01', '12', 'Stationery', 'Bic Orange Fine Ballpoint Pen blue'),
	   ('1', '2020-03-01', '23', 'Stationery', 'Bic Crystal Medium Xtra Life Ballpoint Pens Blue'),
	   ('1', '2020-03-01', '12', 'Stationery', 'Pritt Stick 43g Glue Stick');

INSERT INTO Manager (UserID, ManQualification, ManNationality, ManIDNumber, ManNextOfKeenFName, ManNextOfKeenCell)
VALUES ('2', 'Bcom General degree', 'South African', '6704290231532', 'Joe', '0835522268'),
	   ('1', 'BcomHons Business management', 'South African' , '780129502452', 'Mary' ,'0923513859');

INSERT INTO Container (ConName, ConDescription)
VALUES ('Betha Mamelodi', 'Situated in Mamelodi east'),
	   ('Crispy pools Mamelodi', 'Situated in Mamelodi by crispy pools'),
	   ('Legora Mamelodi', 'Situated in Mamelodi by Legora primary school');

INSERT INTO Manager_Container (ManagerID, ContainerID)
VALUES ('1', '2'),
	   ('2', '1'),
	   ('2', '3');

INSERT INTO Customer_Order_Status (CODescription)
VALUES ('Fulfilled'),
	   ('Awaiting supplier delivery'),
	   ('Placed'),
	   ('Retrieved');

INSERT INTO Sale (UserID, SaleDate)
VALUES ('2', '2020-07-23'),
	   ('3', '2020-01-16'),
	   ('1', '2020-05-12');

INSERT INTO Product_Category (PCatName, PCatDescription)
VALUES ('Stationery', 'writing and other office materials'),
	   ('Blu-tel' , 'airtime and other Communication materials'),
	   ('Electronics', 'Electronic devices and technology');

INSERT INTO Product (ProductCategoryID,ProdBarcode, ProdName, ProdDesciption, ProdReLevel)
VALUES ('1', '6007652013383', 'Treeline 5000 Staples', 'Brand: Treeline, Product: Staples, Colour: Silver, Type: chisel point', '5' ),
	   ('1', ' 8801067431934', 'Onami White eraser', 'Brand: Onami , Product: Eraser, Colour: White, Type: Proffesional', '10'),
	   ('1', '40155000405706', 'Pritt 20ml Correction Fluid', 'Brand: Pritt, Product: Collection fluid, Size: 20 ml', '15'),
	   ('3', '7622300069476', 'Osram LED Bulb 9W', 'Brand: Osram, Product: LED Bulb, Type: 9W', '15'),
	   ('3', '6009801827254', 'Shang Adapter 15/13A', 'Brand: Shang, Product:Adapter, Type: 15/13A', '10'),
	   ('2', '892630118012377413', 'NetOne Micro sim card', 'Brand: NetOne, Product:Sim card, Type: Micro', '5'),
	   ('2', '892630118010969226', 'NetOne Nano sim card', 'Brand: NetOne, Product:Sim card, Type: Nano', '5');
	   


INSERT INTO Product_Sale (ProductID, SaleID, PSQuantity)
VALUES ('1', '3', '3'),
	   ('2', '1', '1'),
	   ('3', '2', '2');

INSERT INTO Payment_Type (PTDescription)
VALUES ('Cash'),
		('Card');

INSERT INTO Customer (CusName, CusSurname, CusCell, CusEmail, CusStreetNr, CusStreet, CusCode, CusSuburb)
VALUES ('Wanda', 'Carmicheal', '0824563214', 'wandacarmicheal@gmail.com', '381', 'Smith Street', '0018', 'Hatfield'),
	   ('Melinda', 'Dube', '0717599838', 'melindadube@yahoo.com', '12', 'Arcadia Street', '0018', 'Arcadia'),
	   ('Carol', 'Carter', '0627893452', 'carolcarter@gmail.com', '56', 'Sisulu Streett', '0012', 'Islington');

INSERT INTO Customer_Order (CustomerID, UserID, CustomerOrderStatusID, CusOrdNumber, CusOrdDate)
VALUES ('1', '2', '4', '2722', '2020-08-02'),
	   ('3', '1', '3', '2726', '2020-08-12'),
	   ('2', '3', '1', '2710', '2020-06-15');

INSERT INTO Payment (PaymentTypeID, SaleID, CustomerOrderID, PayDate, PayAmount)
VALUES ('1', '2', '1', '2020-08-17', '160'),
	   ('1', '3', '3', '2020-06-30', '130');

INSERT INTO Location_Status (LSDescription)
VALUES ('Active'),
	   ('Awaiting approval'),
	   ('Deactivated');

INSERT INTO Province (ProvName)
VALUES ('Gauteng'),
	   ('Kwa-Zulu Natal'),
	   ('North West');

INSERT INTO Area_Status (ASDescription)
VALUES ('Active'),
	   ('Awaiting approval'),
	   ('Deactivated');

INSERT INTO Area (AreaStatusID, ProvinceID, ArName, ArPostalCode)
VALUES ('1', '1', 'Extention 1, Mamelodi', '0122'),
	   ('1', '1', 'Extension 18, Mamelodi', '0122'),
	   ('1', '1', 'Extension 4, Mamelodi', '0122');

INSERT INTO [Location] (ContainerID, LocationStatusID, AreaID, LocName)
VALUES ('1', '1', '3', 'Mamelodi Ext 4'),
	   ('2', '1', '2', 'Mamelodi Ext 18'),
	   ('3', '1', '1', 'Mamelodi Ext 1');

INSERT INTO Container_Product (ContainerID, ProductID, CPQuantity)
VALUES ('1', '3', '34'),
	   ('1', '1', '25'),
	   ('1', '2', '12'),
	   ('2', '3', '13'),
	   ('2', '1', '16'),
	   ('2', '2', '19'),
	   ('3', '3', '24'),
	   ('3', '1', '32'),
	   ('3', '2', '21');

INSERT INTO VAT (VATPerc, VATStartDate)
VALUES ('15', '2018-04-01');

INSERT INTO Product_Order_Line (CustomerOrderID, ProductID, PLQuantity)
VALUES ('2', '1', '50'),
	   ('1', '2', '40'),
	   ('3', '3', '40');

INSERT INTO Price (ProductID, UPriceR, PriceStartDate, PriceEndDate, CPriceR)
VALUES ('1', '10.00', '2020-01-20','2020-12-12' ,'5.50'),
	   ('2', '9.50', '2020-01-02', '2020-12-30' ,'5.00'),
	   ('3', '12.00', '2020-01-12', '2020-12-12' ,'10.00'),
	   ('4', '6.00', '2020-01-12', '2020-12-12' ,'4.00'),
	   ('5', '33.00', '2020-01-12', '2020-12-12' ,'23.00'),
	   ('6', '17.50', '2020-01-12', '2020-12-12' ,'15.00'),
	   ('6', '18.00', '2020-01-12', '2020-12-12' ,'14.00'),
	   ('7', '15.50', '2020-01-12', '2020-12-12' ,'10.00');

INSERT INTO Supplier (SupName, SupCell, SupEmail,SupStreetNr, SupStreet, SupSuburb, SupCode)
VALUES ('Mash Wholesale distributors' , '0123252134', 'mashwholesale@gmail.com', '23', 'Francis Baard street', 'Hatfield' ,'0018'),
	   ('PWA Stationery', '0127521345', 'PWAStationery@yahoo.com', '54', 'Tony Avenue', 'Arcadia', '0018'),
	   ('Makro Mamelodi', '0123471092', 'Makro@gmail.com', '12', 'Tshukulu Road', 'Mamelodi', '0122');

INSERT INTO Creditor (SupplierID, CredAccountBalance)
VALUES ('1', '20120.00'),
	   ('2', '12789.50');

INSERT INTO Creditor_Payment (CreditorID, CredPaymentDate, CredPaymentAmount)
VALUES ('2' , '2020-03-21', '6050.00'),
	   ('1' , '2020-05-30', '12500.00'),
	   ('2', '2020-07-10', '15900.00');

INSERT INTO Product_Supplier (ProductID, SupplierID)
VALUES ('1' , '2'),
	   ('2', '3'),
	   ('3', '1');

INSERT INTO Supplier_Order_Status (SOSDescription)
VALUES ('Placed'),
	   ('Cancelled'),
	   ('Delivered');

INSERT INTO Supplier_Order (SupplierID, SupplierOrderStatusID, SODate)
VALUES ('1', '3', '2020-04-10'),
	   ('3', '2', '2020-02-28'),
	   ('2', '1', '2020-07-12');

INSERT INTO Supplier_Order_Product (ProductID, SupplierOrderID, SOPQuantity)
VALUES ('2', '1', '100'),
	   ('1', '2', '50'),
	   ('3', '3', '90');

INSERT INTO Donation_Recipient (DrName, DrSurname, DrCell, DrEmail, DrStreetNr, DrStreet, DrArea, DrCode)
VALUES ('Julie' , 'Richards', '0128972817', 'julierichards@gmail.com', '34', 'Walter Sisulu Street' , 'Pretoria CBD', '0020'),
	   ('David' , 'Mkhize', '0124782947', 'davidMkhize@yahoo.com', '54', 'Pensilla street' , 'Menlyn', '0023'),
	   ('Mita' , 'Price', '0123451234', 'mitaprice@gmail.com', '23', 'Elaine Avenue' , 'Silverlakes', '0034');

INSERT INTO Donation_Status (DSDescription)
VALUES ('Awaiting Approval'),
	   ('Donated');

INSERT INTO Donation (DonationStatusID, RecipientID, DonAmount, DonDate,DonDescription)
VALUES ('1', '2', '5000.00', '2020-01-29', 'Donated to help less priviledged children get stationery'),
	   ('2', '3' ,'0.00', '2020-04-10', 'Donated to a program that tutors students for free'),
	   ('1', '1', '6000.00' , '2020-05-20', 'Donated to help people affected by COVID 19');

INSERT INTO Donated_Product (ProductID, DonationID, DPQuantity)
VALUES ('1', '1', '20'),
	   ('2', '2', '50'),
	   ('3', '2', '15');

INSERT INTO Marked_Off_Reason (MODescription)
VALUES ('Donated'),
	   ('Damaged'),
	   ('Expired'),
	   ('Stolen');

INSERT INTO Marked_Off (ProductID, ReasonID, MoQuantity, MoDate)
VALUES ('2', '1', '50', '2020-04-10'),
	   ('1', '4', '3', ' 2020-01-15'),
	   ('3', '2', '4', '2020-06-23');

INSERT INTO Return_Product (ProductID, ContainerID, Quantity)
VALUES ('1', '2', '10'),
	   ('3', '1', '15'),
	   ('2', '2', '20');

INSERT INTO Product_Backlog (CustomerOrderID, ProductID, QauntityToOrder)
VALUES ('2', '2', '15'),
	   ('1', '2', '20'),
	   ('2', '1', '50'),
	   ('3', '3', '30');












