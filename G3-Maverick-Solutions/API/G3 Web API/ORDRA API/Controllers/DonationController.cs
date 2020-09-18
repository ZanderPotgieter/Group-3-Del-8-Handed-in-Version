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

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Donation")]
    public class DonationController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all donations by recipient
        [HttpGet]
        [Route("getAllDonations")]
        public object getAllDonations(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Donations.Where(z => z.Donation_Recipient.RecipientID == id).ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting all donation statuses
        [HttpGet]
        [Route("getDonationStatuses")]
        public object getDonationStatuses()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Donation_Status.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }
            return toReturn;
        }

        //Getting all donation statuses
        [HttpGet]
        [Route("getContainerNames")]
        public object getContainerNames()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Containers.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }
            return toReturn;
        }



        //Getting all donated products
        [HttpGet]
        [Route("getAllDonatedProducts")]
        public object getAllDonatedProducts(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            List<Donated_Product> donProds = new List<Donated_Product>();
            List<dynamic> objList = new List<dynamic>();

            try
            {
                donProds = db.Donated_Product.Where(z => z.DonationID == id).ToList();
                dynamic obj = new ExpandoObject();
                foreach (var item in donProds)
                {
                    obj.ProdName = item.Product.ProdName;
                    obj.ProductID = item.ProductID;
                    obj.DonationID = item.DonationID;
                    obj.Quantity = item.DPQuantity;
                    objList.Add(obj);
                }

                toReturn = objList;
                //toReturn = db.Donated_Product.Where(z => z.DonationID == id).ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting donation by donation id
        [HttpGet]
        [Route("getDonationById/{id}")]

        public object getDonationById(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation objectDonation = new Donation();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectDonation = db.Donations.Find(id);

                if (objectDonation == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectDonation;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        //searching donation by recipient cell
        [Route("searchDonations")]
        public object searchDonations(string cell)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var donationRecipient = db.Donation_Recipient.Where((x => x.DrCell == cell)).FirstOrDefault();

                if (donationRecipient != null)
                {
                    List<Donation> donations = db.Donations.Include(z => z.Donation_Recipient).Include(z => z.Donation_Status).Include(z => z.Donated_Product).Where(z => z.RecipientID == donationRecipient.RecipientID).ToList();
                    //toReturn.Donations = donation;
                    //toReturn.DonationRecipient = donationRecipient;
                    toReturn = donations;
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


        [HttpGet]
        //searching donation by recipient cell
        [Route("searchDonationRecipient")]
        public object searchDonationRecipient(string cell)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var donationRecipient = db.Donation_Recipient.Where((x => x.DrCell == cell)).FirstOrDefault();

                if (donationRecipient != null)
                {
                    //List<Donation> donation = db.Donations.Where(z => z.RecipientID == donationRecipient.RecipientID).ToList();
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

        //add donation 
        [HttpPost]
        [Route("AddDonation")]
        public object AddDonation(Donation newDonation)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Donations.Add(newDonation);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //add donated product
        [HttpPost]
        [Route("AddDonatedProduct")]
        public object AddDonatedProduct(Donation newDonProd)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Donations.Add(newDonProd);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //Update donation 
        [HttpPut]
        [Route("UpdateDonation")]
        public object UpdateDonation(Donation donationUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation objectDonation = new Donation();
            dynamic toReturn = new ExpandoObject();
            var id = donationUpdate.DonationID;

            try
            {
                objectDonation = db.Donations.Where(x => x.DonationID == id).FirstOrDefault();
                if (objectDonation != null)
                {
                    objectDonation.DonAmount = donationUpdate.DonAmount;
                    objectDonation.DonDate = donationUpdate.DonDate;
                    objectDonation.DonDescription = donationUpdate.DonDescription;
                    objectDonation.DonationStatusID = donationUpdate.DonationStatusID;
                    //objectDonation.Donated_Product = donationUpdate.Donated_Product;
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

        //Update donated Product
        [HttpPut]
        [Route("UpdateDonatedProduct")]
        public object UpdateDonatedProduct(Donated_Product donProdUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donated_Product objectDonProd = new Donated_Product();
            dynamic toReturn = new ExpandoObject();
            var ProdId = donProdUpdate.ProductID;
            var DonId = donProdUpdate.DonationID;

            try
            {
                objectDonProd = db.Donated_Product.Where(x => (x.DonationID == DonId) && (x.ProductID == ProdId)).FirstOrDefault();
                if (objectDonProd != null)
                {
                    objectDonProd.DPQuantity = donProdUpdate.DPQuantity;

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

        //Delete donation
        [HttpDelete]
        [Route("DeleteDonation")]
        public object DeleteDonation(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation objectDonation = new Donation();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectDonation = db.Donations.Find(id);

                if (objectDonation == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Donations.Remove(objectDonation);
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


        //Delete donated product
        [HttpDelete]
        [Route("DeleteDonatedProduct")]
        public object DeleteDonatedProduct(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Donation objectDonation = new Donation();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectDonation = db.Donations.Find(id);

                if (objectDonation == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Donations.Remove(objectDonation);
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
