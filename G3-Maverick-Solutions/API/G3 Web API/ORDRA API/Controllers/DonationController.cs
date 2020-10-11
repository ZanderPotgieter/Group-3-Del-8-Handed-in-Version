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
                toReturn.Error = "Something Went Wrong" + error;
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
                toReturn.Error = "Something Went Wrong" + error;
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
                toReturn.Error = "Something Went Wrong" + error;
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
                toReturn.Error = "Something Went Wrong" + error;
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
                    toReturn.Error = "Record Not Found";
                }
                else
                {

                    toReturn = objectDonation;
                }

            }
            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        //searching donation by recipient cell
        [Route("searchDonationsByCell")]
        public object searchDonationsByCell(string cell)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.recipient = new ExpandoObject();
            toReturn.donations = new ExpandoObject();

            try
            {
                var donationRecipient = db.Donation_Recipient.Where((x => x.DrCell == cell)).FirstOrDefault();

                if (donationRecipient != null)
                {
                    dynamic recipientDet = new ExpandoObject();
                    recipientDet.DrName = donationRecipient.DrName;
                    recipientDet.DrSurname = donationRecipient.DrSurname;
                    recipientDet.DrEmail = donationRecipient.DrEmail;
                    recipientDet.DrCell = donationRecipient.DrCell;
                    recipientDet.RecipientID = donationRecipient.RecipientID;

                    toReturn.recipient = recipientDet;

                    List<dynamic> donList = new List<dynamic>();
                    List<Donation> donations = db.Donations.Include(z => z.Donation_Recipient).Include(z => z.Donation_Status).Include(z => z.Donated_Product).Where(z => z.RecipientID == donationRecipient.RecipientID).ToList();
                    // toReturn = donations
                    if (donations != null)
                    {

                        foreach (var obj in donations)
                        {
                            dynamic don = new ExpandoObject();
                            don.DonationID = obj.DonationID;
                            don.RecipientID = obj.RecipientID;
                            don.DonAmount = obj.DonAmount;
                            don.DonDate = obj.DonDate;
                            don.DonDescription = obj.DonDescription;
                            don.DonStatus = obj.Donation_Status.DSDescription;
                            List<dynamic> prodList = new List<dynamic>();

                            foreach (var prodObj in obj.Donated_Product)
                            {
                                dynamic prod = new ExpandoObject();
                                prod.DPQuantity = prodObj.DPQuantity;
                                prod.ProductID = prodObj.ProductID;
                                prod.ProdName = prodObj.Product.ProdName;
                                prodList.Add(prod);
                            }
                            don.Products = prodList;
                            donList.Add(don);
                        }
                        toReturn.donations = donList;
                    }
                    else
                    {
                        toReturn.Error = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Error = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        //searching donation by recipient cell
        [Route("searchDonationsByName")]
        public object searchDonationsByName(string name, string surname)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.recipient = new ExpandoObject();
            toReturn.donations = new ExpandoObject();
            try
            {
                var donationRecipient = db.Donation_Recipient.Where(x => (x.DrName == name) && (x.DrSurname == surname)).FirstOrDefault();

                if (donationRecipient != null)
                {
                    dynamic recipientDet = new ExpandoObject();
                    recipientDet.DrName = donationRecipient.DrName;
                    recipientDet.DrSurname = donationRecipient.DrSurname;
                    recipientDet.DrEmail = donationRecipient.DrEmail;
                    recipientDet.DrCell = donationRecipient.DrCell;
                    recipientDet.RecipientID = donationRecipient.RecipientID;

                    toReturn.recipient = recipientDet;

                    List<dynamic> donList = new List<dynamic>();
                    List<Donation> donations = db.Donations.Include(z => z.Donation_Recipient).Include(z => z.Donation_Status).Include(z => z.Donated_Product).Where(z => z.RecipientID == donationRecipient.RecipientID).ToList();
                    // toReturn = donations
                    if (donations != null)
                    {

                        foreach (var obj in donations)
                        {
                            dynamic don = new ExpandoObject();
                            don.DonationID = obj.DonationID;
                            don.RecipientID = obj.RecipientID;
                            don.DonAmount = obj.DonAmount;
                            don.DonDate = obj.DonDate;
                            don.DonDescription = obj.DonDescription;
                            don.DonStatus = obj.Donation_Status.DSDescription;
                            List<dynamic> prodList = new List<dynamic>();

                            foreach (var prodObj in obj.Donated_Product)
                            {
                                dynamic prod = new ExpandoObject();
                                prod.DPQuantity = prodObj.DPQuantity;
                                prod.ProductID = prodObj.ProductID;
                                prod.ProdName = prodObj.Product.ProdName;
                                prodList.Add(prod);
                            }
                            don.Products = prodList;
                            donList.Add(don);
                        }
                        toReturn.donations = donList;
                    }
                    else
                    {
                        toReturn.Error = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Error = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        //searching donation by ID
        [Route("searchDonationByID")]
        public object searchDonationByID(int ID)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.recipient = new ExpandoObject();
            toReturn.donations = new ExpandoObject();
            try
            {
                var donation = db.Donations.Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Include(z => z.Donated_Product).Where(z => z.DonationID == ID).FirstOrDefault();
                var donationRecipient = db.Donation_Recipient.Where(x => x.RecipientID == donation.RecipientID).FirstOrDefault();

                if (donationRecipient != null)
                {
                    dynamic recipientDet = new ExpandoObject();
                    recipientDet.DrName = donationRecipient.DrName;
                    recipientDet.DrSurname = donationRecipient.DrSurname;
                    recipientDet.DrEmail = donationRecipient.DrEmail;
                    recipientDet.DrCell = donationRecipient.DrCell;
                    recipientDet.RecipientID = donationRecipient.RecipientID;

                    toReturn.recipient = recipientDet;

                    // toReturn = donations
                    if (donation != null)
                    {
                        dynamic don = new ExpandoObject();
                        don.DonationID = donation.DonationID;
                        don.RecipientID = donation.RecipientID;
                        don.DonAmount = donation.DonAmount;
                        don.DonDate = donation.DonDate;
                        don.DonDescription = donation.DonDescription;
                        don.DonStatus = donation.Donation_Status.DSDescription;
                        List<dynamic> prodList = new List<dynamic>();

                        foreach (var prodObj in donation.Donated_Product)
                        {
                            dynamic prod = new ExpandoObject();
                            prod.DPQuantity = prodObj.DPQuantity;
                            prod.ProductID = prodObj.ProductID;
                            prod.ProdName = prodObj.Product.ProdName;
                            prodList.Add(prod);
                        }
                        //don.Products = prodList;


                        toReturn.donation = don;
                        toReturn.products = prodList;
                    }
                    else
                    {
                        toReturn.Error = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Error = "Record Not Found";

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
        [Route("searchDonationRecipientByCell")]
        public object searchDonationRecipientByCell(string cell)
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

                    toReturn.Error = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        //searching donation by recipient name
        [Route("searchDonationRecipientByName")]
        public object searchDonationRecipientByName(string name, string surname)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var donationRecipient = db.Donation_Recipient.Where(x => (x.DrName == name) && (x.DrSurname == surname)).FirstOrDefault();

                if (donationRecipient != null)
                {
                    //List<Donation> donation = db.Donations.Where(z => z.RecipientID == donationRecipient.RecipientID).ToList();
                    toReturn = donationRecipient;
                }
                else
                {

                    toReturn.Error = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong " + error.Message;
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
                toReturn.Error = "Add UnSuccsessful";


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
                toReturn.Error = "Add UnSuccsessful";


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

                    toReturn.Message = "Update Successful";
                }
                else
                {
                    toReturn.Error = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Error = "Update Unsuccessful";

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
                    toReturn.Error = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Error = "Update Unsuccessful";

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
                    toReturn.Error = "Record Not Found";
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
                toReturn.Error = "Something Went Wrong " + error.Message;
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
                    toReturn.Error = "Record Not Found";
                }
                else
                {
                    db.Donations.Remove(objectDonation);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch (Exception )
            {
                toReturn.Message = "Failed to delete the donation" ;
            }

            return toReturn;
        }


        [HttpGet]
        [Route("searchProduct")]
        public object searchProduct(int productID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {

            }
            catch (Exception)
            {
                toReturn.Message = "Failed to add the product";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("addProduct")]
        public object addProduct(int productID )
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                
            }
            catch(Exception)
            {
                toReturn.Message = "Failed to add the product";
            }

            return toReturn;
                 
        }

    }
}
