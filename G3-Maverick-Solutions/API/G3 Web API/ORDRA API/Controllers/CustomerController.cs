using System;
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
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error.Message;
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
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectCustomer;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
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
                    
                    toReturn.Message = "Record Not Found";
                    
                }
            }

            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
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
                foundCustomer = searchCustomer(newcustomer.CusName, newcustomer.CusName);

                if (foundCustomer.Message == null)
                {

                    db.Customers.Add(newcustomer);
                    db.SaveChanges();
                    toReturn.Message = "Add Successful";
                }
                else
                {
                    toReturn.Message = "Duplicate Record Found";
                }
            }
            catch (Exception)
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

                    toReturn.Message = "Update Successful";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update UnSuccessful";
               
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
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Customers.Remove(objectCustomer);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }
 

    }






    
}
