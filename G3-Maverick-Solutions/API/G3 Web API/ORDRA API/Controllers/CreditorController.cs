using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using ORDRA_API.Models;
using System.Data.Entity;
using System.Web.Http.Cors;
using ORDRA_API.Controllers;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Creditor")]
    public class CreditorController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();


        //Getting all Creditors
        [HttpGet]
        [Route("getAllCreditors")]
        public object getAllCreditors()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Creditors.Include(s => s.Supplier).ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;
        }

        //Getting Creditor by id
        [HttpGet]
        [Route("getCreditorByID/{id}")]

        public object getCreditorByID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Creditor objectCreditor = new Creditor();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectCreditor = db.Creditors.Find(id);

                if (objectCreditor == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectCreditor;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        //searching Creditor by supplier name 
        [HttpGet]
        [Route("searchCreditor")]
        public object searchCreditor(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search for creditor by supplier name 
                dynamic creditor = new ExpandoObject();
                dynamic sup = db.Suppliers.Where(z => z.SupName.Equals(name)).FirstOrDefault();
                int id = db.Suppliers.Where(x => x.SupName.Equals(name)).Select(z => z.SupplierID).FirstOrDefault();

                creditor = db.Creditors.Include(s => s.Supplier).Where(s => s.SupplierID == id).FirstOrDefault();


                toReturn = creditor;


            }
            catch (Exception)
            {
                toReturn.Message = "Record Not Found";
                //toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;


        }

        //adding a new creditor
        [HttpPost]
        [Route("addCreditor")]
        public object addCreditor(Creditor creditor)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var searchedCred = db.Suppliers.Where(z => z.SupplierID == creditor.SupplierID).Any();
                // searchCreditor(newCreditor.Supplier.SupName);
                //db.Creditors.Include(s => s.Supplier).Where(x => x.CreditorID == newCreditor.CreditorID).FirstOrDefault();
                // var supplier = db.Suppliers.Where(s => s.SupName == name).FirstOrDefault();
                var id = creditor.SupplierID;
                var check = false;
                List<Supplier> suppliers = db.Suppliers.ToList();
                foreach (var item in suppliers)
                {
                    if (item.SupplierID == id)
                    {
                        check = true;
                    }
                }

                if (check == true)
                {
                    toReturn.Message = "Duplicate record";
                }
                else if (check == false)
                {
                    db.Creditors.Add(creditor);
                    db.SaveChanges();
                    toReturn.Message = "Add Succsessful";
                }


                /*if (searchedCred == false) // check if the supplier is already a creditor
                {
                     
                }
                 else
                 {
                     toReturn.Message = "Duplicate record";
                 }*/


            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";
            }
            return toReturn;
        }


        //Update creditor
        [HttpPut]
        [Route("updateCreditor")]
        public object updateCreditor(Creditor creditorUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Creditor objectCreditor = new Creditor();
            dynamic toReturn = new ExpandoObject();
            var id = creditorUpdate.CreditorID;

            try
            {
                objectCreditor = db.Creditors.Where(x => x.CreditorID == id).FirstOrDefault();
                if (objectCreditor != null)
                {
                    objectCreditor.CredAccountBalance = creditorUpdate.CredAccountBalance;
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
                toReturn.Message = "Update Unsuccessful";

            }


            return toReturn;
        }


        //Deleting a Creditor
        [HttpDelete]
        [Route("removeCreditor")]
        public object removeCreditor(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Creditor objectCreditor = new Creditor();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectCreditor = db.Creditors.Find(id);

                if (objectCreditor == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Creditors.Remove(objectCreditor);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.InnerException.ToString();


            }

            return toReturn;
        }


        //searching supplier by supplier name 
        [HttpGet]
        [Route("searchSupplier")]
        public object searchSupplier(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search for creditor by supplier name 
                dynamic supplier = new ExpandoObject();
                dynamic sup = db.Suppliers.Where(z => z.SupName.Equals(name)).FirstOrDefault();
                int id = db.Suppliers.Where(x => x.SupName.Equals(name)).Select(z => z.SupplierID).FirstOrDefault();

                supplier = db.Suppliers.Where(s => s.SupplierID == id).FirstOrDefault();

                toReturn.Message = "search successful";

                toReturn = supplier;
            }
            catch (Exception)
            {
                toReturn.Message = "Record Not Found";
                //toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;


        }

    }
}
