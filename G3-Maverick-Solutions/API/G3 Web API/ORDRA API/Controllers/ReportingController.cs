using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using ORDRA_API.Models;
using System.Data.Entity;
using System.Globalization;
using System.Web.Http.Cors;
using System.Data.Entity.Infrastructure;
using System.Threading.Tasks;
using System.Web.Http.Description;


namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Reporting")]
    public class ReportingController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        [HttpGet]
        [Route("getCreditorReportData")]
        public dynamic getCreditorReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            try
            {
                List<Creditor_Payment> credPayments = new List<Creditor_Payment>();
                credPayments = db.Creditor_Payment.Include(z => z.Creditor).Include(z => z.Creditor.Supplier).Where(z => z.Creditor.CredAccountBalance > 0).ToList();
                if (credPayments != null)
                {
                    //table data
                    var suppliers = credPayments.GroupBy(z => z.Creditor.Supplier.SupName);
                    List<dynamic> supplierGroups = new List<dynamic>();
                    foreach (var item in suppliers)
                    {
                        dynamic supplier = new ExpandoObject();
                        supplier.SupName = item.Key;            //table title
                                                                //var balance = db.Creditors.Where(z=>z.SupplierID == )
                        supplier.Balance = item.Select(c => c.Creditor.CredAccountBalance).FirstOrDefault();
                        List<dynamic> payments = new List<dynamic>();
                        foreach (var paymentItem in item)
                        {
                            dynamic paymentObject = new ExpandoObject();
                            DateTime credDate = Convert.ToDateTime(paymentItem.CredPaymentDate);
                            paymentObject.CredPaymentDate = credDate.Date;
                            paymentObject.CredPaymentAmount = paymentItem.CredPaymentAmount;
                            payments.Add(paymentObject);
                        }

                        supplier.Payments = payments;
                        supplierGroups.Add(supplier);
                    }

                    toReturn.TableData = supplierGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }

            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getSalesReportData")]
        public dynamic getSalesReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            toReturn.ChartData = null;
            try
            {
                List<Product_Sale> prodSale = new List<Product_Sale>();
                prodSale = db.Product_Sale.Include(z => z.Product).Include(z => z.Sale).ToList();
                if (prodSale != null)
                {
                    //chart data 
                    var catList = prodSale.GroupBy(z => z.Product.Product_Category.PCatName);
                    List<dynamic> pCategories = new List<dynamic>();
                    foreach (var item in catList)
                    {
                        dynamic category = new ExpandoObject();
                        category.Name = item.Key;
                        var rev = Convert.ToInt32(item.Average(z => z.PSQuantity), CultureInfo.InvariantCulture);
                        category.Average = rev;
                        pCategories.Add(category);

                    }

                    toReturn.ChartData = pCategories;

                    //table data
                    var categories = prodSale.GroupBy(z => z.Product.Product_Category.PCatName);
                    List<dynamic> catGroups = new List<dynamic>();
                    foreach (var item in categories)
                    {
                        dynamic category = new ExpandoObject();
                        category.PCatName = item.Key;

                        List<dynamic> products = new List<dynamic>();
                        foreach (var prodItem in item)
                        {
                            dynamic productObject = new ExpandoObject();
                            productObject.Name = prodItem.Product.ProdName;
                            productObject.Price = prodItem.Product.Prices.Select(z => z.UPriceR);
                            productObject.Quantity = prodItem.PSQuantity;
                            productObject.Total = productObject.Price * productObject.Quantity;
                            products.Add(productObject);
                        }

                        category.Products = products;
                        catGroups.Add(category);
                    }

                    toReturn.TableData = catGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }

            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getCustomerOrderReportData")]
        public dynamic getCustomerOrderReportData(int selectedOptionID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Customer_Order> orders = new List<Customer_Order>();
            try
            {
                switch (selectedOptionID)
                {
                    case 1: //placed
                        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Placed")).ToList();
                        break;
                    case 2: //fulfilled
                        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Fulfilled")).ToList();
                        break;
                    case 3: //Collected
                        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Collected")).ToList();
                        break;
                    case 4: //Cancelled
                        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Cancelled")).ToList();
                        break;
                    case 5: //all
                        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).ToList();
                        break;
                    default:
                        break;
                }

            }
            catch (Exception)
            {
                throw;
            }

            return getCustomerOrderReportObject(orders);
        }

        public dynamic getCustomerOrderReportObject(List<Customer_Order> orders)
        {

            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            toReturn.Orders = null;
            toReturn.Customers = null;
            toReturn.Products = null;
            try
            {
                if (orders != null)
                {
                    //table data
                    //group by the customer
                    var customers = orders.GroupBy(z => new { z.Customer.CusName, z.Customer.CusSurname, z.Customer.CusEmail });

                    //getting the customer details 
                    List<dynamic> customerGroups = new List<dynamic>();
                    foreach (var item in customers)
                    {
                        dynamic customer = new ExpandoObject();
                        customer.Details = item.Key;

                        //getting the order details
                        List<dynamic> cusOrders = new List<dynamic>();
                        foreach (var cusItem in item)
                        {

                            List<Product_Order_Line> prodOrderLine = db.Product_Order_Line.Where(z => z.CustomerOrderID == cusItem.CustomerOrderID).ToList();
                            //getting the product details
                            List<dynamic> orderProds = new List<dynamic>();
                            foreach (var prod in prodOrderLine)
                            {
                                List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                                var prodID = prod.ProductID.ToString();
                                var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                                dynamic productObject = new ExpandoObject();
                                productObject.Name = prod.Product.ProdName;
                                productObject.Price = price.UPriceR;
                                productObject.Quantity = prod.PLQuantity;
                                productObject.ProdTot = Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.PLQuantity);
                                orderProds.Add(productObject);
                            }
                            //toReturn.Products = orderProds;


                            dynamic orderObject = new ExpandoObject();
                            orderObject.OrderNum = cusItem.CusOrdNumber;
                            orderObject.Product = orderProds;
                            orderObject.Date = cusItem.CusOrdDate;
                            orderObject.Status = cusItem.Customer_Order_Status.CODescription;
                            cusOrders.Add(orderObject);

                            //toReturn.Orders = cusOrders;
                        }
                        customer.Orders = cusOrders;
                        customerGroups.Add(customer);



                    }
                    toReturn.Customers = customerGroups;
                    // toReturn.TableData = customerGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getSupplierOrderReportData")]
        public dynamic getSupplierOrderReportData(int selectedOptionID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Supplier_Order> orders = new List<Supplier_Order>();
            try
            {
                switch (selectedOptionID)
                {
                    case 1: //placed
                        orders = db.Supplier_Order.Include(z => z.Supplier).Include(z => z.Supplier_Order_Status).Include(z => z.Supplier_Order_Product).Where(z => z.Supplier_Order_Status.SOSDescription == "Placed").ToList();

                        break;
                    case 2: //Delivered
                        orders = db.Supplier_Order.Include(z => z.Supplier).Include(z => z.Supplier_Order_Status).Include(z => z.Supplier_Order_Product).Where(z => z.Supplier_Order_Status.SOSDescription == "Delivered").ToList();
                        break;
                    case 3: //Cancelled
                        orders = db.Supplier_Order.Include(z => z.Supplier).Include(z => z.Supplier_Order_Status).Include(z => z.Supplier_Order_Product).Where(z => z.Supplier_Order_Status.SOSDescription == "Cancelled").ToList();
                        break;
                    case 4: //all
                        orders = db.Supplier_Order.Include(z => z.Supplier).Include(z => z.Supplier_Order_Status).Include(z => z.Supplier_Order_Product).ToList();
                        break;
                    default:
                        break;
                }

            }
            catch (Exception)
            {
                throw;
            }

            return getSupplierOrderReportObject(orders);
        }

        public dynamic getSupplierOrderReportObject(List<Supplier_Order> orders)
        {
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            try
            {
                if (orders != null)
                {
                    //table data
                    //group by the suppliers
                    var suppliers = orders.GroupBy(z => z.Supplier.SupName);
                    List<dynamic> supplierGroups = new List<dynamic>();
                    foreach (var item in suppliers)
                    {
                        dynamic supplier = new ExpandoObject();
                        supplier.Name = item.Key;

                        List<dynamic> supOrders = new List<dynamic>();
                        foreach (var supItem in item)
                        {
                            /*//get product details 
                            //var date = DateTime.Now;
                            var prodID = supItem.Supplier_Order_Product.Select(z => z.ProductID).FirstOrDefault().ToString();
                            List<Product> products = db.Products.Include(z => z.Supplier_Order_Product).Include(z => z.Prices).ToList();
                            List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                            var product = products.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                            var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                            var quantity = supItem.Supplier_Order_Product.Select(z => z.SOPQuantity);
                            //var total = price * Convert.ToDouble(quantity);*/

                            List<Supplier_Order_Product> supOrderProd = db.Supplier_Order_Product.Where(z => z.SupplierOrderID == supItem.SupplierOrderID).ToList();
                            //getting the product details
                            List<dynamic> orderProds = new List<dynamic>();
                            foreach (var prod in supOrderProd)
                            {
                                List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                                var prodID = prod.ProductID.ToString();
                                var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                                dynamic productObject = new ExpandoObject();
                                productObject.Name = prod.Product.ProdName;
                                productObject.Price = price.UPriceR;
                                productObject.Quantity = prod.SOPQuantity;
                                productObject.ProdTot = Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.SOPQuantity);
                                orderProds.Add(productObject);
                            }

                            //create order object 
                            dynamic orderObject = new ExpandoObject();
                            orderObject.OrderNum = supItem.SupplierOrderID;
                            orderObject.Product = orderProds;
                            orderObject.Date = supItem.SODate;
                            orderObject.Status = supItem.Supplier_Order_Status.SOSDescription;
                            //orderObject.Total = 
                            supOrders.Add(orderObject);
                        }
                        supplier.Orders = supOrders;
                        supplierGroups.Add(supplier);
                    }

                    toReturn.TableData = supplierGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getMarkedOffProductReportData")]
        public dynamic getMarkedOffProductReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Marked_Off> markedProducts = new List<Marked_Off>();
            List<Product> products = new List<Product>();
            try
            {

                markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).ToList();
                /* switch (selectedOptionID)
                 {
                     case 1: //Donated
                         markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).Where(z => z.Marked_Off_Reason.MODescription == "Donated").ToList();
                         break;
                     case 2: //Stolen
                         markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).Where(z => z.Marked_Off_Reason.MODescription == "Stolen").ToList();
                         break;
                     case 3: //Expired
                         markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).Where(z => z.Marked_Off_Reason.MODescription == "Expired").ToList();
                         break;
                     case 4: //Damaged
                         markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).Where(z => z.Marked_Off_Reason.MODescription == "Damaged").ToList();
                         break;
                     case 5: //all
                         markedProducts = db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).ToList();
                         break;
                     default:
                         break;
                 }*/

            }
            catch (Exception)
            {
                throw;
            }

            return getMarkedOffProductReportObject(markedProducts);
        }
        public dynamic getMarkedOffProductReportObject(List<Marked_Off> markedProducts)
        {
            dynamic toReturn = new ExpandoObject();
            //toReturn.TableData = null;
            toReturn.ChartData = null;
            try
            {

                if (markedProducts != null)
                {
                    //chart data

                    var catList = markedProducts.GroupBy(z => z.Marked_Off_Reason.MODescription);
                    List<dynamic> categories = new List<dynamic>();


                    foreach (var item in catList)
                    {
                        dynamic category = new ExpandoObject();
                        category.Name = item.Key;



                        var sum = Convert.ToInt32(item.Sum(z => z.MoQuantity), CultureInfo.InvariantCulture);
                        category.Sum = sum;

                        categories.Add(category);
                    }

                    toReturn.ChartData = categories;

                    //table data
                    //group by the product categories
                    var products = markedProducts.GroupBy(z => z.Product.ProdName);
                    List<dynamic> productGroups = new List<dynamic>();
                    foreach (var item in products)
                    {
                        dynamic product = new ExpandoObject();
                        product.Name = item.Key;

                        List<dynamic> markProducts = new List<dynamic>();
                        foreach (var markItem in item)
                        {

                            List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                            var prodID = markItem.ProductID.ToString();
                            var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                            dynamic prodObject = new ExpandoObject();
                            // prodObject.OrderNum = markItem.MarkedOffID;
                            prodObject.Product = markItem.Product.ProdName;   // .Select(x => x.Product.ProdName);
                            prodObject.Price = price.UPriceR;
                            prodObject.Quantity = markItem.MoQuantity;
                            prodObject.Date = markItem.MoDate;
                            prodObject.Reason = markItem.Marked_Off_Reason.MODescription;
                            prodObject.ProdTot = Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(markItem.MoQuantity);
                            markProducts.Add(prodObject);
                        }
                        product.Marked = markProducts;
                        productGroups.Add(product);
                    }

                    toReturn.TableData = productGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getProductReportData")]
        public dynamic getProductReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.ChartData = null;

            try
            {
                DateTime now = DateTime.Now;
                List<Product_Sale> products = new List<Product_Sale>();
                products = db.Product_Sale.Include(z => z.Product).Include(z => z.Sale).ToList();
                List<dynamic> categories = new List<dynamic>();
                // db.Products.Include(z => z.ProductCategoryID).Include(z => z.Prices).Include(z => z.Product_Sale).ToList();
                if (products != null)
                {
                    //chart data
                    var prodList = products.GroupBy(z => z.Product.ProductCategoryID);    ///Product.Product_Category.PCatName);

                    foreach (var item in prodList)
                    {
                        dynamic category = new ExpandoObject();
                        category.name = item.Key;
                        var rev = Convert.ToDouble(item.Sum(z => z.PSQuantity), CultureInfo.InvariantCulture);
                        category.Sum = Math.Round(rev, 2);

                        categories.Add(category);
                    }

                    toReturn.ChartData = categories;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getDonationReportData")]
        public dynamic getDonationReportData(int selectedOptionID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Donation> donations = new List<Donation>();
            try
            {
                switch (selectedOptionID)
                {
                    case 1: //Donated
                        donations = db.Donations.Include(z => z.Donated_Product).Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Where(z => z.Donation_Status.DSDescription == "Donated").ToList();
                        break;
                    case 2: //Awaiting approval
                        donations = db.Donations.Include(z => z.Donated_Product).Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Where(z => z.Donation_Status.DSDescription == "Awaiting Approval").ToList();
                        break;
                    case 3: //Awaiting stock
                        donations = db.Donations.Include(z => z.Donated_Product).Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Where(z => z.Donation_Status.DSDescription == "Awaiting Stock").ToList();
                        break;
                    case 4: //Cancelled
                        donations = db.Donations.Include(z => z.Donated_Product).Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).Where(z => z.Donation_Status.DSDescription == "Cancelled").ToList();
                        break;
                    case 5: //All
                        donations = db.Donations.Include(z => z.Donated_Product).Include(z => z.Donation_Status).Include(z => z.Donation_Recipient).ToList();
                        break;
                    default:
                        break;
                }

            }
            catch (Exception)
            {
                throw;
            }

            return getDonationReportObject(donations);
        }

        public dynamic getDonationReportObject(List<Donation> donations)
        {
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            try
            {
                if (donations != null)
                {
                    //table data
                    //group by the donation recipients 
                    var recipients = donations.GroupBy(z => z.RecipientID);
                    List<dynamic> recipGroups = new List<dynamic>();
                    foreach (var item in recipients)
                    {
                        dynamic recipient = new ExpandoObject();
                        recipient.Details = item.Key;

                        List<dynamic> recipDonations = new List<dynamic>();
                        foreach (var recipItem in item)
                        {
                            dynamic donationObject = new ExpandoObject();
                            List<Donated_Product> donOrderProd = db.Donated_Product.Where(z => z.DonationID == recipItem.DonationID).ToList();
                            //getting the product details

                            if (donOrderProd != null)
                            {
                                List<dynamic> orderProds = new List<dynamic>();
                                foreach (var prod in donOrderProd)
                                {
                                    List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                                    var prodID = prod.ProductID.ToString();
                                    var product = db.Products.Where(z => Convert.ToString(z.ProductID) == prodID);

                                    var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                                    dynamic productObject = new ExpandoObject();
                                    //productObject.Name = p
                                    productObject.Price = price.UPriceR;
                                    productObject.Quantity = prod.DPQuantity;
                                    productObject.ProdTot = Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.DPQuantity);
                                    orderProds.Add(productObject);
                                }
                                donationObject.Product = orderProds;
                            }

                            donationObject.DonationNum = recipItem.DonationID;
                            donationObject.Amount = recipItem.DonAmount;
                            donationObject.Status = recipItem.Donation_Status.DSDescription;
                            // donationObject.ProductTotal = donationObject.Quantity * recipItem.Donated_Product.Select(z=>z.Product.Prices.Select(x=>x.UPriceR));
                            recipDonations.Add(donationObject);
                        }
                        recipient.Donations = recipDonations;
                        // recipient.Amount = item.Sum(z => z.DonAmount);
                        // recipient.TotalDonation = item.Sum(z=>z.)

                        recipGroups.Add(recipient);
                    }

                    toReturn.TableData = recipGroups;
                }
                else
                {
                    toReturn.message = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.message = "Something went wrong " + error;
            }
            return toReturn;
        }

        //Getting all Employees
        [HttpGet]
        [Route("getUserReportData")]
        public object getUserReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;

            try
            {
                List<User> users = db.Users.ToList();
                List<dynamic> userList = new List<dynamic>();
                if (users == null)
                {
                    toReturn.Error = "There are no registered system users";
                }
                else
                {
                    int count = 0;
                    foreach(var item in users)
                    {
                        dynamic userObj = new ExpandoObject();
                        userObj.Name = item.UserName;
                        userObj.Surname = item.UserSurname;
                        User_Type type = db.User_Type.Where(z => z.UserTypeID == item.UserTypeID).FirstOrDefault();
                        if (type !=null)
                        {
                            userObj.UserType = type.UTypeDescription;
                        }
                        else
                        {
                            userObj.UserType = "User";
                        }
                        userList.Add(userObj);
                        count++;
                    }

                    toReturn.TableData = userList;
                    toReturn.Count = count;
                }
            }
            catch (Exception)
            {
                toReturn.Error = "Report failed to generate" ;
            }

            return toReturn;

        }

    }
}
