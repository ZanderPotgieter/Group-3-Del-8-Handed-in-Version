﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using System.Data.Entity;
using System.Web.Http.Cors;
using ORDRA_API.Models;

namespace ORDRA_API.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/Customer")]
    public class CustomerController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all Customers
        [HttpGet]
        [Route("getAllCustomers")]
        public object getAllCustomers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Customers.ToList();
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }
           
                return toReturn;
            
        }

        //Getting Customer by id
        [HttpGet]
        [Route("getCustomer/{id}")]

        public object getCustomer(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Customer objectCustomer = new Customer();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectCustomer = db.Customers.Find(id);

                if (objectCustomer == null)
                {
                    toReturn.Message = "Customer Not Found";
                }
                else
                {

                    toReturn = objectCustomer;
                }

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;


        }

        //searching customer by name and surname
        [HttpGet]
        [Route("searchCustomer")]
        public object searchCustomer(string name, string surname)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search Customer in database
                var customer = db.Customers.Where((x => (x.CusName == name && x.CusSurname == surname))).FirstOrDefault();

                if (customer != null)
                {

                    toReturn = customer;
                }
                else
                {
                    
                    toReturn.Message = "The customer was not found. Please check the search criteria.";
                    
                }
            }

            catch 
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;


        }

        [HttpPost]
        [Route("addCustomer")]
        public object addCustomer(Customer newcustomer)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            dynamic foundCustomer = new ExpandoObject();

            try
            {
                var customer = db.Customers.Where((x => (x.CusName == newcustomer.CusName && x.CusSurname == newcustomer.CusSurname))).FirstOrDefault();

                if (customer == null)
                {

                    db.Customers.Add(newcustomer);
                    db.SaveChanges();
                    toReturn.Message = newcustomer.CusName + " " + newcustomer.CusSurname + " has been added successfully.";
                }
                else
                {
                    toReturn.Message = "Customer Already Exists";
                }
            }
            catch
            {
                toReturn.Message = "Add UnSuccessful";
               
            }

            return toReturn;


        }

        //Update Customer
        [HttpPut]
        [Route("updateCustomer")]
        public object updateCustomer(Customer customerUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Customer objectCustomer = new Customer();
            dynamic toReturn = new ExpandoObject();
            var id = customerUpdate.CustomerID;

            try
            {
                objectCustomer = db.Customers.Where(x => x.CustomerID == id).FirstOrDefault();
                if (objectCustomer != null)
                {
                    objectCustomer.CusName = customerUpdate.CusName;
                    objectCustomer.CusSurname = customerUpdate.CusSurname;
                    objectCustomer.CusCell = customerUpdate.CusCell;
                    objectCustomer.CusEmail = customerUpdate.CusEmail;
                    objectCustomer.CusStreetNr = customerUpdate.CusStreetNr;
                    objectCustomer.CusStreet = customerUpdate.CusStreet;
                    objectCustomer.CusCode = customerUpdate.CusCode;
                    objectCustomer.CusSuburb = customerUpdate.CusSuburb;

                    db.SaveChanges();

                    toReturn.Message = customerUpdate.CusName + " " + customerUpdate.CusSurname + " has successfully been updated.";
                }
                else
                {
                    toReturn.Message = "Customer Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Oops! The customer has not been updated.";
               
            }


            return toReturn;
        }

        //Delete Customer
        [HttpDelete]
        [Route("deleteCustomer")]
        public object deleteCustomer(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Customer objectCustomer = new Customer();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectCustomer = db.Customers.Find(id);

                if (objectCustomer == null)
                {
                    toReturn.Message = "Customer Not Found";
                }
                else
                {
                    List<Customer_Order> orders = db.Customer_Order.Where(x => x.CustomerID == id).ToList();
                    if( orders.Count == 0)
                    {
                        db.Customers.Remove(objectCustomer);
                        db.SaveChanges();
                        toReturn.Message = "The customer has successfully been Deleted.";
                    }
                    else
                    {

                        toReturn.Message = " Customer Delete Restricted";
                    }

                   
                }

            }
            catch
            {
                toReturn.Error = "Delete Unsuccessful";
            }

            return toReturn;
        }
 

    }






    
}
