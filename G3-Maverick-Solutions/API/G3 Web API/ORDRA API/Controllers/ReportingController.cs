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
                    toReturn.Error = "Information not available to generate report";
                }

            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
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
                DateTime today = DateTime.Now;
                // List<Sale> sales = db.Sales.Include(z => z.Container).Include(z => z.Product_Sale).ToList();
                List<Product_Sale> sales = db.Product_Sale.Include(z => z.Product).Include(z => z.Sale).ToList();

                    if (sales != null)
                    {
                        //chart data

                        var catList = sales.GroupBy(z => z.Product.ProductCategoryID);
                        List<dynamic> categories = new List<dynamic>();


                        foreach (var item in catList)
                        {
                            dynamic category = new ExpandoObject();
                            category.Name = item.Key;



                            var sum = Convert.ToInt32(item.Sum(z => z.PSQuantity), CultureInfo.InvariantCulture);
                            category.Sum = sum;

                            categories.Add(category);
                        }
                        toReturn.ChartData = categories;
                    }
                    else
                    {
                        toReturn.Error = "Information not available to generate report";
                    }
                        




                        /*//table data
                        var categories = prodSale.GroupBy(z => z.ContainerID);
                        List<dynamic> catGroups = new List<dynamic>();
                        foreach (var item in categories)
                        {
                            dynamic category = new ExpandoObject();
                            category.ID = item.Key;

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

                        toReturn.TableData = catGroups;*/
                    
                

            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
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
                        decimal Grouptot = 0;

                        //getting the order details
                        List<dynamic> cusOrders = new List<dynamic>();
                        foreach (var cusItem in item)
                        {

                            List<Product_Order_Line> prodOrderLine = db.Product_Order_Line.Where(z => z.CustomerOrderID == cusItem.CustomerOrderID).ToList();
                            //getting the product details
                            List<dynamic> orderProds = new List<dynamic>();
                            decimal total = 0;
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
                                total = total + Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.PLQuantity);
                                orderProds.Add(productObject);
                            }
                            //toReturn.Products = orderProds;


                            dynamic orderObject = new ExpandoObject();
                            orderObject.OrderNum = cusItem.CusOrdNumber;
                            orderObject.Product = orderProds;
                            orderObject.Date = cusItem.CusOrdDate;
                            orderObject.Status = cusItem.Customer_Order_Status.CODescription;
                            orderObject.Total = total;
                            cusOrders.Add(orderObject);
                            Grouptot = Grouptot + total;

                            //toReturn.Orders = cusOrders;
                        }
                        customer.Orders = cusOrders;
                        customer.Total = Grouptot;
                        customerGroups.Add(customer);



                    }
                    toReturn.Customers = customerGroups;
                    // toReturn.TableData = customerGroups;
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getSaleReportData")]
        public dynamic getSaleReportData()
        {
            List<Sale> sales = db.Sales.Include(z => z.Container).Include(z => z.Product_Sale).ToList();
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;
            toReturn.Sale = null;
            //toReturn.Customers = null;
            toReturn.Products = null;
            try
            {
                if (sales != null)
                {
                    //table data
                    //group by the customer
                    var categories = sales.GroupBy(z => z.ContainerID);

                    //getting the customer details 
                    List<dynamic> catGroups = new List<dynamic>();
                    foreach (var item in categories)
                    {
                        dynamic category = new ExpandoObject();
                        category.ID = item.Key;

                        /*List<Container> containers = db.Containers.ToList();
                        var id = item.Key;
                        var con = containers.Where(z => z.ContainerID == id).FirstOrDefault();
                        category.Name = con.ConName;*/

                        //var CatName = "";
                        //category.Name = item.Select(z => z.Container.ConName).FirstOrDefault();
                        //getting the sale details
                        List<dynamic> catSale = new List<dynamic>();
                        foreach (var catItem in item)
                        {
                            /*List < Container >  containers = db.Containers.ToList();
                            var id = catItem.ContainerID.ToString();
                            var con = containers.Where(z => Convert.ToString(z.ContainerID) == id).FirstOrDefault();
                            category.Name = con.ConName;*/
                            List<Product_Sale> prodSale = db.Product_Sale.Where(z => z.SaleID == catItem.SaleID).ToList();
                            //getting the product details

                            List<dynamic> prodList = new List<dynamic>();
                            foreach (var prod in prodSale)
                            {
                                List<Price> prices = db.Prices.Include(z => z.Product).ToList();
                                var prodID = prod.ProductID.ToString();
                                var price = prices.Where(z => Convert.ToString(z.ProductID) == prodID).FirstOrDefault();
                                dynamic productObject = new ExpandoObject();
                                productObject.Name = prod.Product.ProdName;
                                productObject.Price = price.UPriceR;
                                productObject.Quantity = prod.PSQuantity;
                                productObject.ProdTot = Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.PSQuantity);
                                prodList.Add(productObject);
                            }
                            //toReturn.Products = orderProds;


                            dynamic saleObject = new ExpandoObject();
                            saleObject.SaleID = catItem.SaleID;
                            saleObject.Product = prodList;
                            saleObject.Date = catItem.SaleDate;
                            //saleObject.Status = cusItem.Customer_Order_Status.CODescription;
                            catSale.Add(saleObject);

                            //toReturn.Orders = cusOrders;
                        }
                        category.Sales = catSale;
                        catGroups.Add(category);



                    }
                    toReturn.TableData = catGroups;
                    // toReturn.TableData = customerGroups;
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getSupplierReportData")]
        public dynamic getSupplierReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;

            try
            {
                List<dynamic> supplierList = new List<dynamic>();
                List<Supplier> suppliers = db.Suppliers.ToList();
                if (suppliers == null)
                {
                    toReturn.Error = "There are no suppliers";
                }
                else
                {
                    int count = 0;
                    foreach (var item in suppliers)
                    {
                        dynamic supObj = new ExpandoObject();
                        supObj.Name = item.SupName;
                        supObj.Cell = item.SupCell;
                        supObj.Email = item.SupEmail;
                        supObj.Surburb = item.SupSuburb;
                       
                        supplierList.Add(supObj);
                        count++;
                    }

                    toReturn.TableData = supplierList;
                    toReturn.Count = count;
                }

            }
            catch (Exception )
            {
                toReturn.Error = "Failed to generate report" ;
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
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getCustomerChartData")]
        public dynamic getCustomerChartData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.ChartData = null;
            List<Customer_Order> orders = new List<Customer_Order>();
            orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).ToList();

            try
            {

                if (orders != null)
                {
                    //chart data

                    var statusList = orders.GroupBy(z => z.Customer_Order_Status.CODescription);
                    List<dynamic> statuses = new List<dynamic>();
                    //dynamic status = new ExpandoObject();

                    foreach (var item in statusList)
                    {
                        dynamic stat = new ExpandoObject();
                        stat.Name = item.Key;
                        //dynamic status = new ExpandoObject();
                        int count = 0;
                        foreach(var ord in item)
                        {
                            count++;
                        }
                        //List<Customer_Order> ord = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z=>z.Customer_Order_Status.CODescription == status).ToList();


                        //var sum = Convert.ToInt32(item.Sum(z => z.), CultureInfo.InvariantCulture);
                        //var sum = Convert.ToInt32(item.Count(z=>z.CustomerOrd), CultureInfo.InvariantCulture);
                        //stat.Sum = sum;
                        stat.Count = count;
                        statuses.Add(stat);
                    }

                    toReturn.ChartData = statuses;
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getProductReportData")]
        public dynamic getProductReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.TableData = null;

            try
            {
                List<dynamic> prodList = new List<dynamic>();
                List<Product> products = db.Products.Include(z=>z.Prices).Include(z=>z.Product_Category).ToList();
                // db.Products.Include(z => z.ProductCategoryID).Include(z => z.Prices).Include(z => z.Product_Sale).ToList();
                if (products != null)
                {
                    //Table data
                    // var prodList = products.GroupBy(z => z.Product.ProductCategoryID);    ///Product.Product_Category.PCatName);
                    //List<dynamic> catGroup = products.GroupBy(z=>z.P)
                    int count = 0;
                    foreach (var item in products)
                    {
                        dynamic prodObj = new ExpandoObject();
                        prodObj.Name = item.ProdName;
                        prodObj.ReLevel = item.ProdReLevel;
                        var price = db.Prices.Where(z => (z.ProductID == item.ProductID)).ToList().LastOrDefault();
                        prodObj.Unit = price.UPriceR;
                        prodObj.Cost = price.CPriceR;

                        prodList.Add(prodObj);
                        count++;
                    }

                    toReturn.TableData = prodList;
                    toReturn.Count = count;
                }
                else
                {
                    toReturn.Error = "TThere are no products";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Report failed to generate " + error;
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
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something went wrong " + error;
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
