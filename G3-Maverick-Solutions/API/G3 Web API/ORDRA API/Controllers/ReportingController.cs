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

                    if (suppliers != null)
                    {
                        foreach (var item in suppliers)
                        {
                            if (item != null && item.Key !=null )
                            {
                                dynamic supplier = new ExpandoObject();
                                supplier.SupName = item.Key;            //table title
                                                                        //var balance = db.Creditors.Where(z=>z.SupplierID == )
                                supplier.Balance = item.Select(c => c.Creditor.CredAccountBalance).FirstOrDefault();
                                List<dynamic> payments = new List<dynamic>();
                                foreach (var paymentItem in item )
                                {
                                    if (paymentItem != null && paymentItem.CredPaymentAmount != null && paymentItem.CredPaymentDate != null)
                                    {
                                        dynamic paymentObject = new ExpandoObject();
                                        DateTime credDate = Convert.ToDateTime(paymentItem.CredPaymentDate);
                                        paymentObject.CredPaymentDate = credDate.Date;
                                        paymentObject.CredPaymentAmount = paymentItem.CredPaymentAmount;
                                        payments.Add(paymentObject);
                                    }
                                    else
                                    {
                                        toReturn.Error = "Creditor payment information not available to add in the report";
                                    }
                                }

                                supplier.Payments = payments;
                                supplierGroups.Add(supplier);
                            }
                            else
                            {
                                toReturn.Error = "Supplier Information not available to add in the report";
                            }
                        }
                    }
                    else
                    {
                        toReturn.Error = "Supplier Information not available to add in the report";
                    }


                    toReturn.TableData = supplierGroups;
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }

            }
            catch (Exception)
            {
                toReturn.Error = "Failed to generate report ";
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
                    if (catList!=null)
                    {
                        foreach (var item in catList)
                        {
                            if (item!=null && item.Key !=null)
                            {
                                dynamic category = new ExpandoObject();
                                category.Name = item.Key;
                                var sum = Convert.ToInt32(item.Sum(z => z.PSQuantity), CultureInfo.InvariantCulture);
                                category.Sum = sum;
                                categories.Add(category);
                            }
                            else
                            {
                                toReturn.Error = "Sale information not available to add in report";
                            }
                        }
                        toReturn.ChartData = categories;
                    }
                    else
                    {
                        toReturn.Error = "Product category information not available to add in report";
                    }
 
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception)
            {
                toReturn.Error = "Failed to generate the report";
            }
            return toReturn;
        }

        //get customer order status details
        [HttpGet]
        [Route("GetAllCustomerOrderStauts")]
        public object GetAllCustomerOrderStauts()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Customer_Order_Status.ToList();
            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
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

                orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CustomerOrderStatusID == selectedOptionID).ToList();
                //switch (selectedOptionID)
                //{
                //    case 1: //placed
                //        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Placed")).ToList();
                //        break;
                //    case 2: //fulfilled
                //        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Fulfilled")).ToList();
                //        break;
                //    case 3: //Collected
                //        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Collected")).ToList();
                //        break;
                //    case 4: //Cancelled
                //        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).Where(z => z.Customer_Order_Status.CODescription.Equals("Cancelled")).ToList();
                //        break;
                //    case 5: //all
                //        orders = db.Customer_Order.Include(z => z.Customer).Include(z => z.Customer_Order_Status).Include(z => z.Product_Order_Line).ToList();
                //        break;
                //    default:
                //        break;
                //}

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

                   if(customers!=null)
                   {
                        //getting the customer details 
                        List<dynamic> customerGroups = new List<dynamic>();
                        foreach (var item in customers)
                        {
                            if (item != null)
                            {
                                dynamic customer = new ExpandoObject();
                                customer.Details = item.Key;
                                decimal Grouptot = 0;

                                //getting the order details
                                List<dynamic> cusOrders = new List<dynamic>();
                                foreach (var cusItem in item)
                                {
                                    List<Product_Order_Line> prodOrderLine = db.Product_Order_Line.Where(z => z.CustomerOrderID == cusItem.CustomerOrderID).ToList();
                                    if (cusItem != null && cusItem.CusOrdDate != null && cusItem.CusOrdNumber != null && cusItem.Customer_Order_Status.CODescription != null && prodOrderLine!=null )
                                    {
                                       
                                        //getting the product details
                                        List<dynamic> orderProds = new List<dynamic>();
                                        decimal total = 0;
                                        foreach (var prod in prodOrderLine)
                                        {
                                            if (prod != null && prod.PLQuantity != null)
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
                                            else
                                            {
                                                toReturn.Error = "Product information not available to add to the report";
                                            }
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
                                    else
                                    {
                                        toReturn.Error = "Customer order information not available to add to the report";
                                    }
                                }

                                if (cusOrders!=null)
                                {
                                    customer.Orders = cusOrders;
                                    customer.Total = Grouptot;
                                    customerGroups.Add(customer);
                                }
                            }
                            else
                            {
                                toReturn.Error = "Customer information not available to add to the report";
                            }
                        }
                        toReturn.Customers = customerGroups;
                        // toReturn.TableData = customerGroups;
                   }
                   else
                   {
                        toReturn.Error = "Customer order information not available to add to the report";
                   }
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception)
            {
                toReturn.Error = "Failed to generate report" ;
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
                    //group by the category
                    var categories = sales.GroupBy(z => z.ContainerID);

                    //getting the customer details 
                    List<dynamic> catGroups = new List<dynamic>();
                    foreach (var item in categories)
                    {
                        if (item!=null)
                        {
                            dynamic category = new ExpandoObject();
                            category.ID = item.Key;


                            List<dynamic> catSale = new List<dynamic>();
                            decimal conTotal = 0;
                            foreach (var catItem in item)
                            {

                                if (catItem != null || catItem.SaleID.ToString() != null || catItem.ContainerID != null || catItem.SaleDate != null)
                                {
                                    List<Product_Sale> prodSale = db.Product_Sale.Where(z => z.SaleID == catItem.SaleID).ToList();
                                    //getting the product details
                                    if (prodSale != null)
                                    {
                                        decimal saleTotal = 0;
                                        List<dynamic> prodList = new List<dynamic>();
                                        foreach (var prod in prodSale)
                                        {
                                            if (prod != null && prod.PSQuantity != null)
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

                                                saleTotal = saleTotal + Convert.ToDecimal(price.UPriceR) * Convert.ToDecimal(prod.PSQuantity);
                                            }
                                            else
                                            {
                                                toReturn.Error = "Sale product information not available to add to the report";
                                            }
                                        }
                                        //toReturn.Products = orderProds;


                                        dynamic saleObject = new ExpandoObject();
                                        saleObject.SaleID = catItem.SaleID;
                                        saleObject.Product = prodList;
                                        saleObject.Date = catItem.SaleDate;
                                        saleObject.Total = saleTotal;
                                        //saleObject.Status = cusItem.Customer_Order_Status.CODescription;
                                        catSale.Add(saleObject);
                                        conTotal = conTotal + saleTotal;
                                    }
                                    else
                                    {
                                        toReturn.Error = "Container information not available to add to the report";
                                    }

                                    //toReturn.Orders = cusOrders;
                                }
                                else
                                {
                                    toReturn.Error = "Sale information not available to add to the report";
                                }

                            }

                            if (catSale!=null)
                            {
                                category.Sales = catSale;
                                category.ConTotal = conTotal;
                                catGroups.Add(category);
                            }
                            
                        }
                        else
                        {
                            toReturn.Error = "Sale information not available to add to the report";
                        }
                    }
                    toReturn.TableData = catGroups;
                    // toReturn.TableData = customerGroups;
                }
                else
                {
                    toReturn.Error = "Information not available to generate report";
                }
            }
            catch (Exception )
            {
                toReturn.Error = "Failed to generate report" ;
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
                    toReturn.Error = "Sale product information not available to generate report";
                }
                else
                {
                    int count = 0;
                    foreach (var item in suppliers)
                    {
                       if (item!=null && item.SupName!=null && item.SupEmail!=null && item.SupCell!=null && item.SupSuburb!=null)
                        {
                            dynamic supObj = new ExpandoObject();
                            supObj.Name = item.SupName;      
                            supObj.Cell = item.SupCell;
                            supObj.Email = item.SupEmail;
                            supObj.Surburb = item.SupSuburb;

                            supplierList.Add(supObj);
                            count++;
                        }
                        else
                        {
                            toReturn.Error = "Supplier information not available to add to the report";
                        }
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

                            if (markItem!=null)
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
                            else
                            {
                                toReturn.Error = "Marked off product information not available to add to the report";
                            }
                        }
                        if (markedProducts!=null)
                        {
                            product.Marked = markProducts;
                            productGroups.Add(product);
                        }
                        
                    }

                    toReturn.TableData = productGroups;
                }
                else
                {
                    toReturn.Error = "Marked off products information not available to generate report";
                }
            }
            catch (Exception)
            {
                toReturn.Error = "Failed to generate report" ;
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
            catch (Exception)
            {
                toReturn.Error = "Failed to generate" ;
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
                List<Product> products = db.Products.Include(z=>z.Prices).Include(z=>z.Product_Category).ToList();
                if (products != null)
                {
                    //Table data
                    var prodList = products.GroupBy(z => z.Product_Category.PCatName);    ///Product.Product_Category.PCatName);
                    List<dynamic> catGroup = new List<dynamic>();
                    int count = 0;

                    foreach (var item in prodList)
                    {
                        dynamic cat = new ExpandoObject();
                        cat.Name = item.Key;
                        List<dynamic> catList = new List<dynamic>();

                        foreach (var prodItem in item)
                        {
                            if (prodItem!=null && prodItem.ProdName!=null && prodItem.ProdReLevel!=null && prodItem.ProductID.ToString()!=null)
                            {
                                dynamic prodObj = new ExpandoObject();
                                prodObj.ProdName = prodItem.ProdName;
                                prodObj.ProdReLevel = prodItem.ProdReLevel;
                                var price = db.Prices.Where(z => (z.ProductID == prodItem.ProductID)).ToList().LastOrDefault();
                                prodObj.ProdUnit = price.UPriceR;
                                prodObj.ProdCost = price.CPriceR;

                                catList.Add(prodObj);
                                count++;
                            }
                            else
                            {
                                toReturn.Error = "Product information not available to add to the report";
                            }
                        }

                        //check if product list is not empty before adding it
                        if (catList!=null)
                        {
                            cat.Products = catList;
                            catGroup.Add(cat);
                        }
                        
                    }
                 

                    toReturn.TableData = catGroup;
                    toReturn.Count = count;

                    /*
                    foreach(var item in roles)
                    {
                        dynamic role = new ExpandoObject();
                        role.Name = item.Key;
                        List<dynamic> userList = new List<dynamic>();
                        foreach (var userItem in item)
                        {
                            dynamic user = new ExpandoObject();
                            user.UserName = userItem.UserName;
                            user.UserSurname = userItem.UserSurname;
                            user.UserEmail = userItem.UserEmail;
                            userList.Add(user);
                            count++;
                        }
                        role.Users = userList;
                        roleGroups.Add(role);
                        
                    }*/
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
            catch (Exception)
            {
                toReturn.Error = "Failed to generate report ";
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

            /*try
            {*/
                List<User> users = db.Users.Include(z=>z.User_Type).ToList();
               
                if (users == null)
                {
                    toReturn.Error = "There are no registered system users";
                }
                else
                {
                    var roles = users.GroupBy(z => z.User_Type.UTypeDescription);
                    int count = 0;
                    List<dynamic> roleGroups = new List<dynamic>();
                    foreach(var item in roles)
                    {
                        if(item!=null)
                        {
                            dynamic role = new ExpandoObject();
                            role.Name = item.Key;
                            List<dynamic> userList = new List<dynamic>();
                            foreach (var userItem in item)
                            {
                                if (userItem != null && userItem.UserName!=null && userItem.UserSurname!=null && userItem.UserEmail!=null)
                                {
                                    dynamic user = new ExpandoObject();
                                    user.UserName = userItem.UserName;
                                    user.UserSurname = userItem.UserSurname;
                                    user.UserEmail = userItem.UserEmail;
                                    userList.Add(user);
                                    count++;
                                }
                                else
                                {
                                    toReturn.Error = "User information not available to add to the report";
                                }
                            }
                            role.Users = userList;
                            roleGroups.Add(role);
                        }
                        else
                        {
                            toReturn.Error = "User typle information not available to add to the report";
                        }   
                        
                    }

                    toReturn.TableData = roleGroups;
                    toReturn.Count = count;

                }
            /*}
            catch (Exception)
            {
                toReturn.Error = "Report failed to generate" ;
            }*/

            return toReturn;

        }

    }
}
