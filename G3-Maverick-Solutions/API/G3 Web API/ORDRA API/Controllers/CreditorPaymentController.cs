using ORDRA_API.Models;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/CreditorPayment")]
    public class CreditorPaymentController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all Payments
        [HttpGet]
        [Route("getAllCreditorPayments")]
        public object getAllCreditorPayments()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Creditor_Payment.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Get all creditors
        [HttpGet]
        [Route("GetAllCreditors")]
        public object GetAllCreditors()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                toReturn = db.Suppliers.ToList();
            }
            catch (Exception)
            catch
            {
                toReturn.Message = "Search Interrupted.Retry";
            }
            return toReturn;
        }

        //Getting Payment by id
        [HttpGet]
        [Route("getCreditorPayment/{id}")]

        public object getCreditorPayment(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Creditor_Payment objectCreditorPayment = new Creditor_Payment();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectCreditorPayment = db.Creditor_Payment.Find(id);
                
                if (objectCreditorPayment == null)
                {
                    toReturn.Message = "Creditor Payment Not Found";
                }
                else
                {

                    toReturn = objectCreditorPayment;
                }

            }
            catch
            {
                toReturn.Message = "Search Interrupted.Retry" ;
            }

            return toReturn;
        }

        //searching Payment by creditor name
        [HttpGet]
        [Route("searchCreditorPayment")]
        public object searchCreditorPayment()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Creditor_Payment.ToList();
            }
            catch 
            {
                toReturn.Message = "Search Interrupted.Retry";
            }

            return toReturn;

        }



        [HttpPost]
        [Route("addCreditorPayment")]
        public object addCreditorPayment(Creditor_Payment newCreditorPayment)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Creditor_Payment.Add(newCreditorPayment);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

    }
}
