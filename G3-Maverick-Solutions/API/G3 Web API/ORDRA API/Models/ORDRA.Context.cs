﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ORDRA_API.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class OrdraDBEntities : DbContext
    {
        public OrdraDBEntities()
            : base("name=OrdraDBEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Access> Accesses { get; set; }
        public virtual DbSet<Area> Areas { get; set; }
        public virtual DbSet<Area_Status> Area_Status { get; set; }
        public virtual DbSet<Container> Containers { get; set; }
        public virtual DbSet<Container_Product> Container_Product { get; set; }
        public virtual DbSet<Creditor> Creditors { get; set; }
        public virtual DbSet<Creditor_Payment> Creditor_Payment { get; set; }
        public virtual DbSet<Customer> Customers { get; set; }
        public virtual DbSet<Customer_Order> Customer_Order { get; set; }
        public virtual DbSet<Customer_Order_Status> Customer_Order_Status { get; set; }
        public virtual DbSet<Donated_Product> Donated_Product { get; set; }
        public virtual DbSet<Donation> Donations { get; set; }
        public virtual DbSet<Donation_Recipient> Donation_Recipient { get; set; }
        public virtual DbSet<Donation_Status> Donation_Status { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<EmployeeCV> EmployeeCVs { get; set; }
        public virtual DbSet<EmployeePicture> EmployeePictures { get; set; }
        public virtual DbSet<Location> Locations { get; set; }
        public virtual DbSet<Location_Status> Location_Status { get; set; }
        public virtual DbSet<Login> Logins { get; set; }
        public virtual DbSet<Logout> Logouts { get; set; }
        public virtual DbSet<Manager> Managers { get; set; }
        public virtual DbSet<Marked_Off> Marked_Off { get; set; }
        public virtual DbSet<Marked_Off_Reason> Marked_Off_Reason { get; set; }
        public virtual DbSet<One_Time_Pin> One_Time_Pin { get; set; }
        public virtual DbSet<Payment> Payments { get; set; }
        public virtual DbSet<Payment_Type> Payment_Type { get; set; }
        public virtual DbSet<Price> Prices { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<Product_Backlog> Product_Backlog { get; set; }
        public virtual DbSet<Product_Category> Product_Category { get; set; }
        public virtual DbSet<Product_Order_Line> Product_Order_Line { get; set; }
        public virtual DbSet<Product_Sale> Product_Sale { get; set; }
        public virtual DbSet<Province> Provinces { get; set; }
        public virtual DbSet<Return_Product> Return_Product { get; set; }
        public virtual DbSet<Sale> Sales { get; set; }
        public virtual DbSet<Shift> Shifts { get; set; }
        public virtual DbSet<Stock_Take> Stock_Take { get; set; }
        public virtual DbSet<Supplier> Suppliers { get; set; }
        public virtual DbSet<Supplier_Order> Supplier_Order { get; set; }
        public virtual DbSet<Supplier_Order_Product> Supplier_Order_Product { get; set; }
        public virtual DbSet<Supplier_Order_Status> Supplier_Order_Status { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<User_Type> User_Type { get; set; }
        public virtual DbSet<User_Type_Access> User_Type_Access { get; set; }
        public virtual DbSet<VAT> VATs { get; set; }
    }
}
