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

    [RoutePrefix("API/DonationRecipient")]
    public class DonationRecipientController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all donation recipients
        [HttpGet]
        [Route("GetAllDonationRecipients")]
        public object GetAllDonationRecipients()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Donation_Recipient.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting donation recipient by id
        [HttpGet]
        [Route("GetDonationRecipient/{id}")]

        public object GetDonationRecipient(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation_Recipient objectDonationRecipient = new Donation_Recipient();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectDonationRecipient = db.Donation_Recipient.Find(id);

                if (objectDonationRecipient == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectDonationRecipient;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        //searching donation recipient by name and surname
        [Route("searchDonationRecipient")]
        public object searchDonationRecipient(string name, string surname)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var donationRecipient = db.Donation_Recipient.Where((x => (x.DrName == name && x.DrSurname == surname))).FirstOrDefault();

                if (donationRecipient != null)
                {

                    toReturn = donationRecipient;
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

        //add donation recipient
        [HttpPost]
        [Route("AddDonationRecipient")]
        public object AddDonationRecipient(Donation_Recipient newDonationRecipient)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Donation_Recipient.Add(newDonationRecipient);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //Update donation recipient
        [HttpPut]
        [Route("UpdateDonationRecipient")]
        public object UpdateDonationRecipient(Donation_Recipient donationRecipientUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation_Recipient objectDonationRecipient = new Donation_Recipient();
            dynamic toReturn = new ExpandoObject();
            var id = donationRecipientUpdate.RecipientID;

            try
            {
                objectDonationRecipient = db.Donation_Recipient.Where(x => x.RecipientID == id).FirstOrDefault();
                if (objectDonationRecipient != null)
                {
                    objectDonationRecipient.DrName = donationRecipientUpdate.DrName;
                    objectDonationRecipient.DrSurname = donationRecipientUpdate.DrSurname;
                    objectDonationRecipient.DrCell = donationRecipientUpdate.DrCell;
                    objectDonationRecipient.DrEmail = donationRecipientUpdate.DrEmail;
                    objectDonationRecipient.DrStreetNr = donationRecipientUpdate.DrStreetNr;
                    objectDonationRecipient.DrStreet = donationRecipientUpdate.DrStreet;
                    objectDonationRecipient.DrCode = donationRecipientUpdate.DrCode;
                    objectDonationRecipient.DrArea = donationRecipientUpdate.DrArea;

                    db.SaveChanges();

                    toReturn.Message = "Update Successfull";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update UnSuccessfull";

            }
            return toReturn;
        }

        //Delete donation recipient
        [HttpDelete]
        [Route("DeleteDonationRecipient")]
        public object DeleteDonationRecipient(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation_Recipient objectDonationRecipient = new Donation_Recipient();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectDonationRecipient = db.Donation_Recipient.Find(id);

                if (objectDonationRecipient == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Donation_Recipient.Remove(objectDonationRecipient);
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
