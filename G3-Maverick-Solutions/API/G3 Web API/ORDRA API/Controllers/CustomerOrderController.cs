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
using System.Security.Permissions;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/CustomerOrder")]
    public class CustomerOrderController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Make Sale
        [HttpPost]
        [Route("initiatePlaceOrder/{customerID}")]
        public object initiatePlaceOrder(int customerID, dynamic session)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.products = new ExpandoObject();
            toReturn.CustomerOrder = new Sale();
            toReturn.Customer = new ExpandoObject();
            toReturn.VAT = new ExpandoObject();


            try
            {
                //get customer details
                Customer customer = new Customer();
                customer = db.Customers.Where(x => x.CustomerID == customerID).FirstOrDefault();
                toReturn.Customer = customer;

                Container con = new Container();
                //get container of current user
                string sessionID = session.token;
                var user = db.Users.Where(x => x.SessionID == sessionID).FirstOrDefault();

                if (user.ContainerID == null)
                {
                    return toReturn.Error = ("Curent Container Not Found");

                }
                con = db.Containers.Where(x => x.ContainerID == user.ContainerID).FirstOrDefault();
                if (con == null)
                {
                    return toReturn.Error = ("Curent Container Not Found");
                }
                //get products in container 
                List<Container_Product> conProd = db.Container_Product.Include(x => x.Product).Where(x => x.CPQuantity < 1 && x.ContainerID == con.ContainerID).ToList();



                //get todays date 
                DateTime CustomerOrderDate = DateTime.Now;

                //get payment types
                toReturn.Customer = db.Payment_Type.ToList();



                if (conProd != null)
                {
                    Customer_Order prevOrder = db.Customer_Order.ToList().LastOrDefault();
                    int prevOrderNo = Convert.ToInt32(prevOrder.CusOrdNumber);
                    int OrderNo = prevOrderNo + 1;

                    //Get List Of products with current price
                    List<Product> productsList = db.Products.ToList();
                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in conProd)
                    {
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == prod.ProductID).ToList().LastOrDefault();
                        if (price != null)
                        {
                            double Price = (double)price.UPriceR;
                            dynamic productDetails = new ExpandoObject();
                            productDetails.ProductCategoryID = prod.Product.ProductCategoryID;
                            productDetails.ProductID = prod.Product.ProductID;
                            productDetails.ProdBarcode = prod.Product.ProdBarcode;
                            productDetails.ProdDescription = prod.Product.ProdDesciption;
                            productDetails.Prodname = prod.Product.ProdName;
                            productDetails.CPQuantity = prod.CPQuantity;
                            productDetails.Quantity = 0;
                            productDetails.Price = Math.Round(Price, 2);
                            productDetails.Subtotal = 0.0;

                            products.Add(productDetails);
                        }
                    }
                    toReturn.products = products;

                    //get VAT
                    toReturn.VAT = db.VATs.Where(x => x.VATStartDate <= DateTime.Now).ToList().LastOrDefault();

                    //set up sale
                    Customer_Order newCustomerOrder = new Customer_Order();
                    newCustomerOrder.CusOrdDate = CustomerOrderDate;
                    newCustomerOrder.CusOrdNumber = Convert.ToString(OrderNo);
                    newCustomerOrder.UserID = user.UserID;
                    newCustomerOrder.User = user;
                    newCustomerOrder.CustomerID = customer.CustomerID;
                    newCustomerOrder.CustomerOrderStatusID = 3;
                    newCustomerOrder.Customer = customer;
                    newCustomerOrder.Container = con;
                    newCustomerOrder.ContainerID = con.ContainerID;
                    db.Customer_Order.Add(newCustomerOrder);
                    db.SaveChanges();

                    //getsale
                    toReturn.CustomerOrder = db.Customer_Order.ToList().LastOrDefault();

                }
                else
                {
                    return toReturn.Message = "All products seem to be in stock.";
                }
            }
            catch
            {
                toReturn.Error = "Please Reload Page to Initiate Order";
            }

            return toReturn;
        }

        [HttpGet]
        [Route("addCustomerOrderProduct")]
        public object addCustomerOrderProduct(int productID, int customerorderID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                if (product != null)
                {
                    Customer_Order customerorder = db.Customer_Order.Where(x => x.CustomerOrderID == customerorderID).FirstOrDefault();
                    if (customerorder != null)
                    {
                        Product_Backlog backlog_Product = db.Product_Backlog.Where(x => x.ContainerID == customerorder.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                        if (backlog_Product != null)
                        {
                            backlog_Product.QuantityToOrder = (backlog_Product.QuantityToOrder + quantity);
                            db.SaveChanges();

                            Product_Order_Line product_Order_Line = db.Product_Order_Line.Where(x => x.ProductID == product.ProductID && x.CustomerOrderID == customerorder.CustomerOrderID).FirstOrDefault();
                            if (product_Order_Line == null)
                            {
                                Product_Order_Line newProduct_Order_Line = new Product_Order_Line();
                                newProduct_Order_Line.ProductID = product.ProductID;
                                newProduct_Order_Line.Product = product;
                                newProduct_Order_Line.CustomerOrderID = customerorder.CustomerOrderID;
                                newProduct_Order_Line.Customer_Order = customerorder;
                                newProduct_Order_Line.PLQuantity = quantity;
                                db.Product_Order_Line.Add(newProduct_Order_Line);
                                db.SaveChanges();

                                toReturn.Product_Order_Line = db.Product_Order_Line.ToList().LastOrDefault();

                            }
                            else
                            {
                                product_Order_Line.PLQuantity = product_Order_Line.PLQuantity + quantity;
                                db.SaveChanges();

                                toReturn.Product_Order_Line = product_Order_Line;
                            }
                        }
                        else
                        {
                            toReturn.Error = "Container Not Found";
                        }
                    }
                    else
                    {
                        toReturn.Error = "Order Not Found";
                    }
                }
                else
                {
                    toReturn.Error = "Product Not Found";
                }

            }
            catch
            {
                toReturn.Error = "Product Add Unsuccessful";
            }

            return toReturn;
        }

        [HttpGet]
        [Route("removeCustomerOrderProduct")]
        public object removeCustomerOrderProduct(int productID, int customerorderID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                if (product != null)
                {
                    Customer_Order customerorder = db.Customer_Order.Where(x => x.CustomerOrderID == customerorderID).FirstOrDefault();
                    if (customerorder != null)
                    {
                        Product_Backlog backlog_Product = db.Product_Backlog.Where(x => x.ContainerID == customerorder.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                        if (backlog_Product != null)
                        {
                            backlog_Product.QuantityToOrder = (backlog_Product.QuantityToOrder - quantity);
                            db.SaveChanges();

                            Product_Order_Line product_Order_Line = db.Product_Order_Line.Where(x => x.ProductID == product.ProductID && x.CustomerOrderID == customerorder.CustomerOrderID).FirstOrDefault();
                            if (product_Order_Line != null)
                            {

                                db.Product_Order_Line.Remove(product_Order_Line);
                                db.SaveChanges();

                                toReturn.Product_Order_Line = product_Order_Line;
                            }
                        }
                        else
                        {
                            toReturn.Error = "Container Not Found";
                        }


                    }
                    else
                    {
                        toReturn.Error = "Order Not Found";
                    }
                }
                else
                {
                    toReturn.Error = "Product Not Found";
                }

            }
            catch
            {
                toReturn.Error = "Product Removal Unsuccessful";
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getAllCustomerOrders")]
        public object getAllCustomerOrders()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                List<Customer_Order> customerorders = db.Customer_Order.ToList();
                List<dynamic> CustomerOrders = new List<dynamic>();

                foreach (Customer_Order customerorder in customerorders)
                {
                    Customer_Order customerorder1 = db.Customer_Order.Where(x => x.CustomerOrderID == customerorder.CustomerOrderID).FirstOrDefault();
                    ///User user = sale1.User;
                    DateTime date = Convert.ToDateTime(customerorder1.CusOrdDate);
                    if (customerorder1 != null)
                    {

                        List<Product_Order_Line> product_Order_Line = db.Product_Order_Line.Where(x => x.CustomerOrderID == customerorder1.CustomerOrderID).ToList();

                        if (product_Order_Line != null)
                        {
                            dynamic searchedCustomerOrder = new ExpandoObject();
                            searchedCustomerOrder.CustomerOrderID = customerorder.CustomerID;
                            // searchedSale.UserName = user.UserName;
                            searchedCustomerOrder.CusOrdDate = date.ToString("yyyy-MM-dd");
                            CustomerOrders.Add(searchedCustomerOrder);
                        }
                    }
                }

                toReturn.CustomerOrders = CustomerOrders;
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;
        }

        // Cancel Order
        [HttpGet]
        [Route("cancelCustomerOrder")]
        public object cancelCustomerOrder(int customerorderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //get sale
                Customer_Order newCustomerOrder = db.Customer_Order.Where(x => x.CustomerOrderID == customerorderID).FirstOrDefault();
                if (newCustomerOrder != null)
                {

                    //get container
                    Container container = db.Containers.Where(x => x.ContainerID == newCustomerOrder.ContainerID).FirstOrDefault();



                    //get list of products in Sale
                    List<Product_Order_Line> product_Order_line = newCustomerOrder.Product_Order_Line.ToList();

                    if (container != null)
                    {
                        if (product_Order_line != null)
                        {
                            foreach (var prod in product_Order_line)
                            {
                                Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();
                                if (product != null)
                                {

                                    Product_Backlog backlog_Product = db.Product_Backlog.Where(x => x.ContainerID == newCustomerOrder.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                                    if (backlog_Product != null)
                                    {
                                        backlog_Product.QuantityToOrder = (backlog_Product.QuantityToOrder + prod.PLQuantity);
                                        db.SaveChanges();

                                        Product_Order_Line product_Order_Line = db.Product_Order_Line.Where(x => x.ProductID == product.ProductID && x.CustomerOrderID == newCustomerOrder.CustomerOrderID).FirstOrDefault();
                                        if (product_Order_Line != null)
                                        {

                                            db.Product_Order_Line.Remove(product_Order_Line);
                                            db.SaveChanges();
                                        }
                                    }

                                }
                                else
                                {
                                    toReturn.Error = "Product Not Found";
                                }


                            }
                         
                            toReturn.Message = "Order Cancelled";
                        }

                    }
                    else
                    {
                        toReturn.Error = "Container Not Found";
                    }
                }


                else
                {
                    toReturn.Error = "Cancel Failed: Order Not Found";
                }
            }
            catch
            {
                toReturn.Error = "Customer Order Cancellation Unsuccessfully Completed";
            }

            return toReturn;
        }

        //to get sale details for a full view using id
        [HttpGet]
        [Route("getCustomerOrder/{id}")]
        public object getCustomerOrder(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            double TotalIncVat = 0.0;
            toReturn.calculatedValues = new ExpandoObject();
            toReturn.customerorderProducts = new List<dynamic>();
            toReturn.customerorderDate = new ExpandoObject();
            DateTime customerorderDate = DateTime.Now;

            try
            {

                Customer_Order searchedCustomerOrder = db.Customer_Order.Include(x => x.Product_Order_Line).Include(x => x.Customer).Include(x => x.User).Where(x => x.CustomerOrderID == id).FirstOrDefault();
                if (searchedCustomerOrder != null)
                {
                    //get list of Products in sale from db
                    List<Product_Order_Line> product_Order_line = db.Product_Order_Line.Include(x => x.Customer_Order).Include(x => x.Product).Where(x => x.CustomerOrderID == searchedCustomerOrder.CustomerOrderID).ToList();


                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in product_Order_line)
                    {

                        //Get Price For Each Product
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= searchedCustomerOrder.CusOrdDate && x.PriceEndDate >= searchedCustomerOrder.CusOrdDate && x.ProductID == prod.ProductID).FirstOrDefault();

                        if (price != null)
                        {

                            //Calculate Product Subtotal
                            double unitPrice = (double)price.UPriceR;
                            double quantity = (double)prod.PLQuantity;
                            double subtotal = unitPrice * quantity;

                            //Create Object And Populate With Product Related Details
                            dynamic productDetails = new ExpandoObject();
                            productDetails.ProductID = prod.ProductID;
                            productDetails.Prodname = prod.Product.ProdName;
                            productDetails.ProdDescription = prod.Product.ProdDesciption;
                            productDetails.Quantity = prod.PLQuantity.ToString();
                            productDetails.Price = price.UPriceR.ToString();
                            productDetails.Subtotal = subtotal.ToString("#.##");

                            TotalIncVat = TotalIncVat + subtotal;

                            products.Add(productDetails);
                        }
                        //set list of products to return object
                        toReturn.saleProducts = products;


                        var vatOnDate = db.VATs.Where(x => x.VATStartDate <= searchedCustomerOrder.CusOrdDate).FirstOrDefault();
                        if (vatOnDate != null)
                        {

                            ///Calculate Sale Amounts 
                            double vatPerc = (double)vatOnDate.VATPerc;
                            double vat = (vatPerc / (vatPerc + 100)) * TotalIncVat;
                            double TotalExcVat = TotalIncVat - vat;


                            //set and Populate With Calculated Details
                            dynamic calculations = new ExpandoObject();
                            calculations.TotalIncVat = TotalIncVat.ToString("#.##");
                            calculations.TotalExcVat = TotalExcVat.ToString("#.##");
                            calculations.Vat = vat.ToString("#.##");
                            toReturn.calculatedValues = calculations;

                            //set Sale date to return object
                            customerorderDate = Convert.ToDateTime(searchedCustomerOrder.CusOrdDate);
                            toReturn.customerorderDate = customerorderDate;

                        }
                        else
                        {
                            toReturn.Message = "Something Went Wrong Price is null";
                        }
                    }
                }
            }

            catch
            {
                toReturn.Message = "Order Search Inturrupted, Retry";
            }

            return toReturn;
        }
    }
}
