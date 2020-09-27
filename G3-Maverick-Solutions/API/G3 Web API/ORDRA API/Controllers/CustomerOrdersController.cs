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

    [RoutePrefix("Api/CustomerOrders")]
    public class CustomerOrdersController : ApiController
    {

        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Search Order By Cell
        [HttpGet]
        [Route("searchByCell")]
        public object searchByCell(string cell)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                List<Customer_Order> customerOrders = db.Customer_Order.Include(x => x.Customer).Include(x => x.Customer_Order_Status).Where(x => x.Customer.CusCell == cell).ToList();
                if (customerOrders != null)
                {
                    List<dynamic> orders = new List<dynamic>();
                    foreach (var ord in customerOrders)
                    {
                        DateTime ordDate = Convert.ToDateTime(ord.CusOrdDate);
                        dynamic order = new ExpandoObject();
                        order.CustomerOrderID = ord.CustomerOrderID;
                        order.CusName = ord.Customer.CusName;
                        order.CusSurname = ord.Customer.CusSurname;
                        order.CusOrdNumber = ord.CusOrdNumber;
                        order.CusOrdDate = ordDate.ToString("yyyy-MM-dd");
                        order.CusOrdStatus = ord.Customer_Order_Status.CODescription;
                        orders.Add(order);
                    }
                    toReturn = orders;
                }
                else
                {
                    toReturn.Message = "Order(s) Not Found";
                }
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error.Message;
            }
            return toReturn;
        }

        //Retrieve all orders
        [HttpGet]
        [Route("searchAll")]
        public object searchAll()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                List<Customer_Order> customerOrders = db.Customer_Order.Include(x => x.Customer).Include(x => x.Customer_Order_Status).ToList();
                if (customerOrders != null)
                {
                    List<dynamic> orders = new List<dynamic>();
                    foreach (var ord in customerOrders)
                    {
                        DateTime ordDate = Convert.ToDateTime(ord.CusOrdDate);
                        dynamic order = new ExpandoObject();
                        order.CustomerOrderID = ord.CustomerOrderID;
                        order.CusName = ord.Customer.CusName;
                        order.CusSurname = ord.Customer.CusSurname;
                        order.CusOrdNumber = ord.CusOrdNumber;
                        order.CusOrdDate = ordDate.ToString("yyyy-MM-dd");
                        order.CusOrdStatus = ord.Customer_Order_Status.CODescription;
                        orders.Add(order);
                    }
                    toReturn = orders;
                }
                else
                {
                    toReturn.Message = "No orders have been placed";
                }
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error.Message;
            }
            return toReturn;
        }


        //Search Order By OrderNo
        [HttpGet]
        [Route("searchByOrderNo")]
        public object searchByOrderNo(string orderNo)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.orderDetails = new ExpandoObject();
            toReturn.customerDetails = new ExpandoObject();
            toReturn.calculatedValues = new ExpandoObject();
            toReturn.orderProducts = new List<dynamic>();
            double TotalIncVat = 0.0;
            DateTime orderDate = DateTime.Now;


            try
            {
                //Get Customer Order Details From Db
                Customer_Order order = db.Customer_Order.Include(x => x.Customer).Include(x => x.Customer_Order_Status).Where(x => x.CusOrdNumber == orderNo).FirstOrDefault();

                if (order != null)
                {
                    //Get List Of Products In Customer Order From Db
                    List<Product_Order_Line> orderProduct = db.Product_Order_Line.Include(x => x.Customer_Order).Include(x => x.Product).Where(x => x.Customer_Order.CusOrdNumber == orderNo).ToList();


                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in orderProduct)
                    {

                        //Get Price For Each Product
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= order.CusOrdDate && x.PriceEndDate >= order.CusOrdDate && x.ProductID == prod.ProductID).FirstOrDefault();

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
                        else
                        {
                            toReturn.Message = "Something Went Wrong Price is null";

                        }
                    }


                    var vatOnDate = db.VATs.Where(x => x.VATStartDate <= order.CusOrdDate).FirstOrDefault();
                    if (vatOnDate != null)
                    {

                        ///Calculate Order Amounts 
                        double vatPerc = (double)vatOnDate.VATPerc;
                        double vat = (vatPerc / (vatPerc + 100)) * TotalIncVat;
                        double TotalExcVat = TotalIncVat - vat;
                        orderDate = Convert.ToDateTime(order.CusOrdDate);

                        //Create objects to store the seperated details 
                        dynamic cusOrder = new ExpandoObject();
                        dynamic cusdetails = new ExpandoObject();
                        dynamic calculations = new ExpandoObject();

                        //Populate With Customer Order Details
                        cusOrder.CustomerOrderID = order.CustomerOrderID;
                        cusOrder.OrderNo = order.CusOrdNumber;
                        cusOrder.OrderDate = orderDate.ToString("yyyy-MM-dd");

                        //Populate With  Customer Details
                        cusdetails.CustomerID = order.CustomerID;
                        cusdetails.CusName = order.Customer.CusName;
                        cusdetails.CusSurname = order.Customer.CusSurname;
                        cusdetails.CusCell = order.Customer.CusCell;
                        cusdetails.CusEmail = order.Customer.CusEmail;

                        //Populate With Calculated Details
                        calculations.TotalIncVat = TotalIncVat.ToString("#.##");
                        calculations.TotalExcVat = TotalExcVat.ToString("#.##");
                        calculations.Vat = vat.ToString("#.##");


                        //set objects to return
                        toReturn.orderDetails = cusOrder;
                        toReturn.customerDetails = cusdetails;
                        toReturn.calculatedValues = calculations;
                        toReturn.orderProducts = products;

                    }
                    else
                    {
                        toReturn.Message = "Something Went Wrong VAT is null";

                    }
                }
                else
                {
                    toReturn.Message = "Order(s) Not Found";
                }
            }
            catch (Exception error)
            {
                toReturn.Message = "Something Went Wrong: " + error.Message;
            }


            return toReturn;


        }



        //Function called on load of place order screen
        [HttpGet]
        [Route("initiatePlaceOrder/{customerID}")]
        public object initiatePlaceOrder(int customerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.customer = new ExpandoObject();
            toReturn.orderInfo = new ExpandoObject();
            toReturn.productCategories = new List<Product_Category>();
            toReturn.products = new ExpandoObject();


            try
            {
                //get customer details
                Customer customer = new Customer();
                customer = db.Customers.Where(x => x.CustomerID == customerID).FirstOrDefault();
                toReturn.customer = customer;


                if (customer != null)
                {
                    //Get Order No 
                    Customer_Order prevOrder = db.Customer_Order.ToList().LastOrDefault();
                    int prevOrderNo = Convert.ToInt32(prevOrder.CusOrdNumber);
                    int OrderNo = prevOrderNo + 1;

                    //Get Todays date
                    var orderDate = DateTime.Now.ToString("yyyy-MM-dd");

                    //Get Vat
                    var vatOnDate = db.VATs.Where(x => x.VATStartDate <= DateTime.Now).FirstOrDefault();

                    //Set Order No And Order Date In Dynamic Object
                    dynamic orderInfo = new ExpandoObject();
                    orderInfo.OrderNo = OrderNo;
                    orderInfo.OrderDate = orderDate;
                    orderInfo.VatPerc = vatOnDate;

                    toReturn.orderInfo = orderInfo;

                    //Get List Of Product Categories 
                    List<Product_Category> categories = db.Product_Category.Include(x => x.Products).ToList();
                    toReturn.productCategories = categories;

                    //Get List Of products with current price
                    List<Container_Product> containerprods = db.Container_Product.Include(x => x.Product).Where(x => x.CPQuantity < 1).ToList();
                    List<Product> productsList = db.Products.ToList();
                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in containerprods)
                    {
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == prod.ProductID).FirstOrDefault();
                        if (price != null)
                        {
                            double Price = (double)price.UPriceR;
                            dynamic productDetails = new ExpandoObject();
                            productDetails.ProductCategoryID = prod.Product.ProductCategoryID;
                            productDetails.ProductID = prod.ProductID;
                            productDetails.ProdDescription = prod.Product.ProdDesciption;
                            productDetails.Prodname = prod.Product.ProdName;
                            productDetails.Quantity = 0;
                            productDetails.Price = Math.Round(Price, 2);
                            productDetails.Subtotal = 0.0;

                            products.Add(productDetails);
                        }
                        else
                        {
                            toReturn.Message = "Product not found";
                        }
                    }
                    toReturn.products = products;


                }
                else
                {
                    toReturn.Message = " Customer Not Found";
                }
            }

            catch (Exception error)
            {
                toReturn.Message = error.Message;
            }

            return toReturn;

        }


        //Place Order Function
        [HttpPost]
        [Route("placeOrder")]
        public dynamic placeOrder(Customer_Order order)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.newOrder = new ExpandoObject();
            string newOrderNo = "";

            try
            {
                //Get Product Order Line Details from order
                List<Product_Order_Line> productList = order.Product_Order_Line.ToList();

                if (order != null && productList != null)
                {
                    Customer customer = db.Customers.Where(x => x.CustomerID == order.CustomerID).FirstOrDefault();
                    User user = db.Users.Where(x => x.UserID == order.UserID).FirstOrDefault();
                    Customer_Order_Status order_Status = db.Customer_Order_Status.Where(x => x.CODescription == "placed").FirstOrDefault();

                    //save customer order details
                    Customer_Order customerOrder = new Customer_Order();
                    customerOrder.Customer = customer;
                    customerOrder.Customer_Order_Status = order_Status;
                    customerOrder.User = user;
                    customerOrder.CusOrdNumber = order.CusOrdNumber;
                    customerOrder.CusOrdDate = DateTime.Now;
                    //customerOrder.Product_Order_Line = 

                    ;

                    db.Customer_Order.Add(customerOrder);
                    db.SaveChanges();

                    //Get The Saved Order details form the db
                    Customer_Order placedOrder = db.Customer_Order.ToList().LastOrDefault();

                    if (placedOrder != null)
                    {
                        //Add the Product_Order_Line Records for each product
                        foreach (var prod in productList)
                        {
                            Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();
                            Product_Order_Line orderProd = new Product_Order_Line();
                            orderProd.Customer_Order = placedOrder;
                            orderProd.Product = product;
                            orderProd.PLQuantity = prod.PLQuantity;

                            db.Product_Order_Line.Add(orderProd);
                            db.SaveChanges();

                            Product_Backlog product_Backlog = new Product_Backlog();
                            product_Backlog.Customer_Order = placedOrder;
                            product_Backlog.Product = product;
                            product_Backlog.QauntityToOrder = prod.PLQuantity;

                            db.Product_Backlog.Add(product_Backlog);
                            db.SaveChanges();

                        }

                        //Get the placed Orders Order Number
                        newOrderNo = placedOrder.CusOrdNumber;
                    }

                    else
                    {
                        toReturn.Message = "Error adding Products";
                    }

                    //Set the return Objects
                    toReturn.newOrder = searchByOrderNo(newOrderNo);
                    toReturn.Message = "Order Succesfully Placed";

                }
                else
                {
                    toReturn.Message = " Null Parameters Received";
                }
            }

            catch (Exception error)
            {
                toReturn.Message = error.Message;
            }

            return toReturn;
        }

        //collect Order Function
        [HttpPost]
        [Route("collectOrder")]
        public dynamic collectOrder(int CustomerOrderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Get the Order from the db
                Customer_Order cus_order = db.Customer_Order.Include(x => x.Customer_Order_Status).Where(x => x.CustomerOrderID == CustomerOrderID).FirstOrDefault();

                //get the collected customer order status
                Customer_Order_Status order_Status = db.Customer_Order_Status.Where(x => x.CODescription == "collected").FirstOrDefault();

                //set order status to collected
                cus_order.Customer_Order_Status = order_Status;

                db.SaveChanges();

            }
            catch (Exception error)
            {
                toReturn = error.Message;
            }

            return toReturn;
        }


        //collect Order Function
        [HttpPost]
        [Route("cancelOrder")]
        public dynamic cancelOrder(int CustomerOrderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Get the Order from the db
                Customer_Order cus_order = db.Customer_Order.Include(x => x.Customer_Order_Status).Where(x => x.CustomerOrderID == CustomerOrderID).FirstOrDefault();

                //check if order is collected
                if (cus_order.Customer_Order_Status.CODescription == "collected")
                {
                    toReturn.Message = "Collected Orders Can Not Be Cancelled";
                }
                else
                {
                    //get the cancelled customer order status
                    Customer_Order_Status order_Status = db.Customer_Order_Status.Where(x => x.CODescription == "cancelled").FirstOrDefault();


                    //set order status to cancelled
                    cus_order.Customer_Order_Status = order_Status;

                    db.SaveChanges();


                    //get products in order

                    List<Product_Order_Line> orderProduct = db.Product_Order_Line.Include(x => x.Customer_Order).Include(x => x.Product).Where(x => x.Customer_Order.CustomerOrderID == cus_order.CustomerOrderID).ToList();
                    foreach (var prod in orderProduct)
                    {
                        Return_Product return_Product = new Return_Product();
                        return_Product.Product = prod.Product;
                        return_Product.Quantity = prod.PLQuantity;

                        db.Return_Product.Add(return_Product);

                    }
                }

            }
            catch (Exception error)
            {
                toReturn = error.Message;
            }

            return toReturn;
        }

        [HttpGet]
        [Route("getOrdersByStatus/{status}")]

        public dynamic getOrdersByStatus(string status)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {

                List<Customer_Order> customerOrders = db.Customer_Order.Include(x => x.Customer).Include(x => x.Customer_Order_Status).Where(x => x.Customer_Order_Status.CODescription == status).ToList();
                if (customerOrders != null)
                {
                    toReturn = customerOrders;
                }
                else
                {
                    toReturn.Message = "Order(s) Not Found";
                }
            }
            catch (Exception error)
            {
                toReturn = error.Message;
            }

            return toReturn;

        }

        [HttpPost]
        [Route("sendNotification")]
        public dynamic SendNotification(List<Customer_Order> orders)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                foreach (var order in orders)
                {

                    toReturn.Message = "Notification Sent Successfully";

                }
            }
            catch (Exception error)
            {
                toReturn = error.Message;
            }

            return toReturn;

        }



    }
}