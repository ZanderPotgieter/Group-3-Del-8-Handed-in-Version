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


                if (creditor != null)
                {

                    toReturn = creditor;
                }
                else
                {

                    toReturn.Message = "The creditor was not found. Please check the search criteria.";

                }


            }
            catch (Exception)
            {
                toReturn.Message = "Record Not Found";
                toReturn = "Something Went Wrong ";
            }

            return toReturn;


        }

        [HttpPost]
        [Route("AddCreditor")]
        public object AddCreditor(Creditor creditor)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            //try
            //{
                //get supplier
              //Supplier sup = db.Suppliers.Where(x => x.SupplierID == creditor.Supplier.SupplierID).FirstOrDefault();
                //if (sup != null)
                //{


                    //save new creditor
                    Creditor addCred = new Creditor();
                    addCred.CredBank = creditor.CredBank;
                    addCred.CredAccount = creditor.CredAccount;
                    addCred.CredType = creditor.CredType;
                    addCred.CredBranch = creditor.CredBranch;
                    addCred.CredAccountBalance = creditor.CredAccountBalance;
                    addCred.SupplierID = creditor.SupplierID;
                    //addCred.Supplier = sup;
                    db.Creditors.Add(addCred);
                    db.SaveChanges();

                    toReturn.Message = "The creditor has been added successfully.";
               // }
                //else
                //{
                   // toReturn.Message = "Add Creditor Unsuccsessful: Supplier already a creditor.";
                //}

            //}
            //catch (Exception)
            //{
                //toReturn.Message = "Add Creditor unsuccessful";

            //}
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
                    objectCreditor.CredBank = creditorUpdate.CredBank;
                    objectCreditor.CredBranch = creditorUpdate.CredBranch;
                    objectCreditor.CredAccount = creditorUpdate.CredAccount;
                    objectCreditor.CredType = creditorUpdate.CredType;
                    db.SaveChanges();
                    toReturn.Message =  "Creditor has successfully been updated.";
                }
                else
                {
                    toReturn.Message = "Creditor Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Please check input fields. Update failed.";

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
                    toReturn.Message = "Creditor Not Found";
                }
                else
                {
                    List<Creditor_Payment> payments = db.Creditor_Payment.Where(x => x.CreditorID == id).ToList();
                    if(payments.Count == 0)
                    {
                        db.Creditors.Remove(objectCreditor);
                        db.SaveChanges();
                        toReturn.Message = "Creditor has successfully been removed.";

                    }
                    else
                    {
                        toReturn.Message = "Removing Creditor Restricted";
                    }
                     
                    
                }

            }
            catch 
            {
                toReturn.Message = "Removing Creditor Unssucessful";


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
                toReturn = "Creditor not Found. Please check the search criteria.";
            }

            return toReturn;


        }

    }
}
