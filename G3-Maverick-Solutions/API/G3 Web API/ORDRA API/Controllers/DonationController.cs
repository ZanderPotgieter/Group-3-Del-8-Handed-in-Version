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
            catch (Exception)
            {
                toReturn.Message = "Failed to get all Donations" ;
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
            catch (Exception)
            {
                toReturn.Message = "Failed to get statuses" ;
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
            catch (Exception)
            {
                toReturn.Message = "Failed to get containers";
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
            catch
            {
                toReturn.Message = "Failed to get donated products";
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
            catch
            {
                toReturn.Message = "Failed to get donation";
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
                                prod.ContainerID = prodObj.ContainerID;
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
                        toReturn.Message = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Message = "Record Not Found";

                }
            }

            catch 
            {
                toReturn.Message = "Failed to get donation";
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
                                prod.ConatinerID = prodObj.Container;
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
                        toReturn.Message = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Message = "Donation Record Not Found";

                }
            }

            catch
            {
                toReturn.Message = "Failed to get donation";
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
                            prod.ContainerID = prodObj.Container;
                            prod.ProdName = prodObj.Product.ProdName;
                            prodList.Add(prod);
                        }
                        //don.Products = prodList;


                        toReturn.donation = don;
                        toReturn.products = prodList;
                    }
                    else
                    {
                        toReturn.Message = "Donation records not found";
                    }
                }
                else
                {

                    toReturn.Message = "Donation Record Not Found";

                }
            }

            catch 
            {
                toReturn.Message = "Failed to get Donation";
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

                    toReturn.Message = "Donation Record Not Found";

                }
            }

            catch
            {
                toReturn.Message = "Failed to get donation recipient";
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

                    toReturn.Message = "Donation Record Not Found";

                }
            }

            catch
            {
                toReturn.Message = "Failed to get donation recipient";
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
                toReturn.Message = "Donation Add Successful";
            }
            catch (Exception)
            {
                toReturn.Message = "Donation Add Unsuccessful";
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
                toReturn.Message = "Donated Product Add Successful";
            }
            catch (Exception)
            {
                toReturn.Error = "Donated Product Add Unsuccessful";
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

                    toReturn.Message = "Donation Update Successful";
                }
                else
                {
                    toReturn.Message = "DOnation Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Donation Update Unsuccessful";

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

                    toReturn.Message = "Donated product Update Successful";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Donated product Update Unsuccessful";

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
                    toReturn.Message = "Donation Not Found";
                }
                else
                { 

                    db.Donations.Remove(objectDonation);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch
            {
                toReturn.Message = "Delete Unsuccesful" ;
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
                    toReturn.Message = "Donation Record Not Found";
                }
                else
                {
                    db.Donations.Remove(objectDonation);
                    db.SaveChanges();
                    toReturn.Message = "Donated Product Deleted Successfully";
                }

            }
            catch (Exception )
            {
                toReturn.Message = "Donated Product Delete Unsuccessful";
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
        [Route("addDonatedProduct")]
        public object addDonatedProduct(int prodID, int contID, int donID ,int quantity )
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                //check quantity of container
                Container_Product conProd = db.Container_Product.Where(z => (z.ProductID == prodID) && (z.ContainerID == contID)).FirstOrDefault();
                Donated_Product donProdObj = db.Donated_Product.Where(z => (z.DonationID == donID) && (z.ProductID == prodID) ).FirstOrDefault();   //to check if product has already been added
         
                if (conProd.CPQuantity >= quantity)
                {
                    if(donProdObj == null)
                    {
                        Donated_Product donProd = new Donated_Product();
                        donProd.ProductID = prodID;
                        donProd.DonationID = donID;
                        donProd.DPQuantity = quantity;
                        donProd.ContainerID = contID;
                        db.Donated_Product.Add(donProd);
                        conProd.CPQuantity = conProd.CPQuantity - quantity;
                        db.SaveChanges();
                        toReturn.Message = "Donated Products Added Successfully";
                    }
                    else
                    {
                        donProdObj.DPQuantity = donProdObj.DPQuantity + quantity;
                        conProd.CPQuantity = conProd.CPQuantity - quantity;
                        db.SaveChanges();
                        toReturn.Message = "Donated Products Added Successfully";
                    }

                    

                    toReturn.DonatedProducts = db.Donated_Product.Where(z => z.DonationID == donID).ToList();

                }
                else
                {
                    toReturn.Message = "Not enough stock on hand. Available qunatity = " + conProd.CPQuantity;
                }
            }
            catch(Exception)
            {
                toReturn.Message = "Failed to add the product";
            }

            return toReturn;
                 
        }

        [HttpGet]
        [Route("getAllContainerProducts")]
        public object getAllContainerProducts(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                //List<dynamic> products = new List<dynamic>();
                List<Container_Product> containerProducts = db.Container_Product.Where(z => z.ContainerID == containerID).ToList();
                List<Product> products = new List<Product>();

                if (containerProducts.Count!=0)
                {
                    foreach(var item in containerProducts)
                    {
                        dynamic product = new ExpandoObject();
                        product = db.Products.Where(z => z.ProductID == item.ProductID).FirstOrDefault();
                        products.Add(product);

                    }
                }

                toReturn.ContainerProducts = containerProducts;
                toReturn.Products = products;
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get all product";
            }

            return toReturn;
        }

        [HttpGet]
        [Route("getAllContainers")]
        public object getAllContainers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                toReturn = db.Containers.ToList();
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get all containers";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getAddedDonation")]
        public object getAddedDonation(string cell)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Donation_Recipient donationRecipient = db.Donation_Recipient.Where(z => z.DrCell == cell).FirstOrDefault();
                Donation donation = db.Donations.Where(z => z.RecipientID == donationRecipient.RecipientID).ToList().LastOrDefault();
                //toReturn.Donation = searchDonationByID(donation.DonationID);
                //var donation = db.Donations.Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Include(z => z.Donated_Product).Where(z => z.DonationID == ID).FirstOrDefault();
                //var donationRecipient = db.Donation_Recipient.Where(x => x.RecipientID == donation.RecipientID).FirstOrDefault();

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
                        don.DonationStatusID = donation.DonationStatusID;
                        //don.DonStatus = donation.Donation_Status.DSDescription;
                        toReturn.donation = don;
                        toReturn.donationID = donation.DonationID;

                    }


                    
                }
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get donation";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getDonatedProducts")]
        public object getDonatedProducts(int donID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                List<dynamic> donList = new List<dynamic>();
                List<Donated_Product> donated = db.Donated_Product.Where(z => z.DonationID == donID).ToList();
                if (donated != null)
                {
                    foreach(var item in donated)
                    {
                        dynamic donObj = new ExpandoObject();
                        donObj.DonationID = donID;
                        donObj.ProductID = item.ProductID;
                        donObj.ContainerID = item.ContainerID;
                        donObj.DPQuantity = item.DPQuantity;

                        //donObj.ProdName = item.Product.ProdName;
                        //donObj.ConName = item.Container.ConName;

                        donList.Add(donObj);
                    }

                    toReturn.donatedProducts = donList;
                }
                else
                {
                    toReturn.Message = "No donated products found";
                }
            }
            catch
            {
                toReturn.Message = "Failed to get donated products";
            }

            return toReturn;
        }
    }
}
