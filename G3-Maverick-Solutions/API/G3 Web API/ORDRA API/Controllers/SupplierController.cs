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

    [RoutePrefix("API/Supplier")]
    public class SupplierController : ApiController
    {

        
        
            //DATABASE INITIALIZING
            OrdraDBEntities db = new OrdraDBEntities();

            //Getting all Suppliers
            [HttpGet]
            [Route("getAllSuppliers")]
            public object getAllSuppliers()
            {
                db.Configuration.ProxyCreationEnabled = false;
                dynamic toReturn = new ExpandoObject();

                try
                {
                    toReturn = db.Suppliers.ToList();
                }
                catch (Exception error)
                {
                    toReturn = "Something Went Wrong" + error;
                }

                return toReturn;

            }

            //Getting Supplier by id
            [HttpGet]
            [Route("getSupplier/{id}")]

            public object getSupplier(int id)
            {
                db.Configuration.ProxyCreationEnabled = false;

                Supplier objectSupplier = new Supplier();
                dynamic toReturn = new ExpandoObject();

                try
                {
                    objectSupplier = db.Suppliers.Find(id);

                    if (objectSupplier == null)
                    {
                        toReturn.Message = "Record Not Found";
                    }
                    else
                    {

                        toReturn = objectSupplier;
                    }

                }
                catch (Exception error)
                {
                    toReturn = "Something Went Wrong: " + error.Message;
                }

                return toReturn;


            }

            //searching Supplier by name and surname
            [HttpGet]
            [Route("searchSupplier")]
            public object searchSupplier(string name)
            {

                db.Configuration.ProxyCreationEnabled = false;
                dynamic toReturn = new ExpandoObject();

                try
                {
                    //Search Supplier in database
                    var Supplier = db.Suppliers.Where(x => x.SupName == name ).FirstOrDefault();

                    if (Supplier != null)
                    {

                        toReturn = Supplier;
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
            [Route("addSupplier")]
            public object addSupplier(Supplier newSupplier)
            {

                db.Configuration.ProxyCreationEnabled = false;
                dynamic toReturn = new ExpandoObject();
                dynamic foundSupplier = new ExpandoObject();

            try
            {
                foundSupplier = searchSupplier(newSupplier.SupName);

                if ( foundSupplier.Message == null)
                {
                    db.Suppliers.Add(newSupplier);
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

            //Update Supplier
            [HttpPut]
            [Route("updateSupplier")]
            public object updateSupplier(Supplier SupplierUpdate)
            {
                db.Configuration.ProxyCreationEnabled = false;

                Supplier objectSupplier = new Supplier();
                dynamic toReturn = new ExpandoObject();
                var id = SupplierUpdate.SupplierID;

                try
                {
                    objectSupplier = db.Suppliers.Where(x => x.SupplierID == id).FirstOrDefault();
                    if (objectSupplier != null)
                    {
                        objectSupplier.SupName = SupplierUpdate.SupName;
                        objectSupplier.SupCell = SupplierUpdate.SupCell;
                        objectSupplier.SupEmail = SupplierUpdate.SupEmail;
                        objectSupplier.SupStreetNr = SupplierUpdate.SupStreetNr;
                        objectSupplier.SupStreet = SupplierUpdate.SupStreet;
                        objectSupplier.SupCode = SupplierUpdate.SupCode;
                        objectSupplier.SupSuburb = SupplierUpdate.SupSuburb;

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

            //Delete Supplier
            [HttpDelete]
            [Route("deleteSupplier")]
            public object deleteSupplier(int id)
            {
                db.Configuration.ProxyCreationEnabled = false;

                Supplier objectSupplier = new Supplier();
                dynamic toReturn = new ExpandoObject();

                try
                {
                    objectSupplier = db.Suppliers.Find(id);

                    if (objectSupplier == null)
                    {
                        toReturn.Message = "Record Not Found";
                    }
                    else
                    {
                        db.Suppliers.Remove(objectSupplier);
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
