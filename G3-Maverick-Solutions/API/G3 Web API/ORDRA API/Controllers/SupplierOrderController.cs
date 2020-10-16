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
using System.IO;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Net.Mail;
using System.Web.UI.WebControls;
using HtmlAgilityPack;
using System.Collections.Specialized;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("API/SupplierOrder")]
    public class SupplierOrderController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Get all products
        [HttpGet]
        [Route("getProducts")]
        public object getProducts()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {

                List<Product> products = db.Products.Include(x => x.Container_Product).Include(x => x.Product_Backlog).ToList();
                if (products != null)
                {
                    toReturn = products;
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

        //Get all products
        [HttpGet]
        [Route("getSupplierOrderStatuses")]
        public object getSupplierOrderStatuses()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {

                List<Supplier_Order_Status> statuses = db.Supplier_Order_Status.ToList();
                if (statuses != null)
                {
                    toReturn.Statuses = statuses;
                }
                else
                {
                    toReturn.Message = "Supplier Order Stauses Not Found";
                }

            }

            catch 
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;



        }




        //Sreeen 1:
        //Get List of products with the backlog quantities in the container
        [HttpGet]
        [Route("getBacklogProducts")]
        public object getBacklogProducts(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.products = new ExpandoObject();


            try
            {

                List<Product_Backlog> product_Backlogs = db.Product_Backlog.Include(x => x.Product).Where(x => x.ContainerID == containerID).ToList();
                List<dynamic> products = new List<dynamic>();

                if (product_Backlogs != null)
                {
                    foreach(Product_Backlog product_Backlog in product_Backlogs)
                    {
                        Product prod = db.Products.Where(x => x.ProductID == product_Backlog.ProductID).FirstOrDefault();
                        if(prod != null)
                        {
                            dynamic product = new ExpandoObject();
                            product.ProductID = product_Backlog.ProductID;
                            product.SupplierID = prod.SupplierID;
                            product.ProdName = prod.ProdName;
                            product.ProdDescription = prod.ProdDesciption;
                            product.QuantityToOrder = product_Backlog.QuantityToOrder;

                            products.Add(product);


                        }
                        
                    }

                    toReturn.products = products;
                }
                else
                {
                    toReturn.Message = "No Prodcuts In Backlog";
                }

            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //Screen 1
        //Add a product to the suppliers order
        [HttpGet]
        [Route("addProductToOrder")]
        public object addProductToOrder(int containerID, int supplierID, int productID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.product = new ExpandoObject();


            try
            {
                //search for the supplier and product in the database
                Supplier supplier = db.Suppliers.Where(X => X.SupplierID == supplierID).FirstOrDefault();
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();

                if (supplier != null && product != null)
                {
                    DateTime date = DateTime.Now;
                    string date_ = date.ToString("yyyy-MM-dd");
                    date = Convert.ToDateTime(date_);
                    //check to see if the supplier order was already created today in the current container
                    Supplier_Order supplier_Order = db.Supplier_Order.Where(x => x.SupplierID == supplierID && x.SODate == date && x.SupplierOrderStatusID == 1 && x.ContainerID == containerID).FirstOrDefault();
                if (supplier_Order == null)
                {
                    //get the "Placed" order status
                    Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 1).FirstOrDefault();

                    //create new supplier order
                    Supplier_Order newOrder = new Supplier_Order();
                    newOrder.SupplierID = supplierID;
                    newOrder.SODate = DateTime.Now;
                    newOrder.ContainerID = containerID;
                    newOrder.SupplierOrderStatusID = status.SupplierOrderStatusID;
                    db.Supplier_Order.Add(newOrder);
                    db.SaveChanges();
                    //retrive the placed order
                    Supplier_Order order = db.Supplier_Order.ToList().LastOrDefault();

                    if (order != null)
                    {
                        //add the product to the created order
                        Supplier_Order_Product addProd = new Supplier_Order_Product();
                        addProd.ProductID = productID;
                        addProd.SupplierOrderID = order.SupplierOrderID;
                        addProd.SOPQuantityOrdered = quantity;
                        addProd.SOPQuantityRecieved = 0;
                        db.Supplier_Order_Product.Add(addProd);
                        db.SaveChanges();

                        //returning the product so you can see it in the console
                        toReturn.product = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == order.SupplierOrderID).FirstOrDefault();
                    }
                }
                else
                {

                    //add product to existing Order
                    Supplier_Order_Product addProd = new Supplier_Order_Product();
                    addProd.ProductID = productID;
                    addProd.SupplierOrderID = supplier_Order.SupplierOrderID;
                    addProd.SOPQuantityOrdered = quantity;
                    addProd.SOPQuantityRecieved = 0;
                    db.Supplier_Order_Product.Add(addProd);
                    db.SaveChanges();

                    //returning the product so you can see it in the console if you want
                    toReturn.product = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == supplier_Order.SupplierOrderID).FirstOrDefault();
                }

                    toReturn.Message = "Product Added To  Order";

                   
                    

                }
                else
                {
                    toReturn.Error = "Supplier Or Product Details Not Found";
                }



        }

            catch
            {
                toReturn.Error = "Product Already Ordered. Awaiting Supplier Order Deliery";
            }

            return toReturn;

        }


        //Screen 2
        //get a list of the orders placed today in the current container thet we now need to send an email to the supplier
        [HttpGet]
        [Route("getTodaysSupplierOrders")]
        public object getTodaysSupplierOrders(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                DateTime date = DateTime.Now;
                string date_ = date.ToString("yyyy-MM-dd");
                date = Convert.ToDateTime(date_);
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.ContainerID == containerID && x.SupplierOrderStatusID == 1 && x.SODate == date).ToList();
                List<object> orders = new List<object>();
                if(supplier_Orders.Count != 0)
                {
                    foreach(Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();
                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if(prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                        

                    }

                    toReturn.supplierOrders = orders;
                }
                

            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }


        //get supplier orders in a container
        [HttpGet]
        [Route("getSupplierOrdersByContainer")]
        public object getSupplierOrdersByContainer(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.ContainerID == containerID).ToList();
                List<object> orders = new List<object>();
                if (supplier_Orders.Count != 0)
                {
                    foreach (Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();
                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if (prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                    }

                    toReturn.supplierOrders = orders;
                }


            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get supplier orders
        [HttpGet]
        [Route("getAllSupplierOrders")]
        public object getAllSupplierOrders()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.ToList();
                List<object> orders = new List<object>();
                if (supplier_Orders.Count != 0)
                {
                    foreach (Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();

                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if (prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                    }

                    toReturn.supplierOrders = orders;
                }


            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get supplier orders on date
        [HttpGet]
        [Route("getSupplierOrdersByDate")]
        public object getSupplierOrdersByContainer(DateTime date)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.SODate == date).ToList();
                List<object> orders = new List<object>();
                if (supplier_Orders.Count != 0)
                {
                    foreach (Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();
                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if (prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                    }

                    toReturn.supplierOrders = orders;
                }


            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get supplier orders by status
        [HttpGet]
        [Route("getSupplierOrdersByStatus")]
        public object getSupplierOrdersByStatus(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.SupplierOrderStatusID == id).ToList();
                List<object> orders = new List<object>();
                if (supplier_Orders.Count != 0)
                {
                    foreach (Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();

                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if (prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                    }

                    toReturn.supplierOrders = orders;
                }


            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get supplier orders on date
        [HttpGet]
        [Route("getPlacedSupplierOrdersInContainer")]
        public object getPlacedSupplierOrdersInContainer(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrders = new ExpandoObject();


            try
            {
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.SupplierOrderStatusID == 1 && x.ContainerID == containerID).ToList();
                List<object> orders = new List<object>();
                if (supplier_Orders.Count != 0)
                {
                    foreach (Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();
                        List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                        if (prods.Count != 0)
                        {
                            //set dynamic object to display in list
                            dynamic Order = new ExpandoObject();
                            Order.SupplierOrderID = order.SupplierOrderID;
                            Order.SupplierID = order.SupplierID;
                            Order.ContainerID = order.ContainerID;
                            Order.SupEmail = supplier.SupEmail;
                            Order.SupName = supplier.SupName;
                            Order.Status = status.SOSDescription;
                            Order.SODate = order.SODate;
                            orders.Add(Order);
                        }

                    }

                    List<Supplier_Order> backordered = db.Supplier_Order.Where(x => x.SupplierOrderStatusID == 4 && x.ContainerID == containerID).ToList();
                    
                    if (backordered.Count != 0)
                    {
                        foreach (Supplier_Order order in backordered)
                        {
                            //get supplier linked to 
                            Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                            Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();
                            List<Supplier_Order_Product> prods = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                            if (prods.Count != 0)
                            {
                                //set dynamic object to display in list
                                dynamic Order = new ExpandoObject();
                                Order.SupplierOrderID = order.SupplierOrderID;
                                Order.SupplierID = order.SupplierID;
                                Order.ContainerID = order.ContainerID;
                                Order.SupEmail = supplier.SupEmail;
                                Order.SupName = supplier.SupName;
                                Order.Status = status.SOSDescription;
                                Order.SODate = order.SODate;
                                orders.Add(Order);
                            }
                        }
                    }






                        toReturn.supplierOrders = orders;
                }


            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get full supplier Order details
        [HttpGet]
        [Route("getSupplierOrdersByID")]
        public object getSupplierOrdersByID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrder = new ExpandoObject();


            try
            {
                Supplier_Order order = db.Supplier_Order.Where(x => x.SupplierOrderID == id).FirstOrDefault();
                
                if (order != null)
                {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();


                        //set dynamic object for the supplier order details
                        dynamic Order = new ExpandoObject();
                        Order.SupplierOrderID = order.SupplierOrderID;
                        Order.SupplierID = order.SupplierID;
                        Order.SupName = supplier.SupName;
                        Order.ContainerID = order.ContainerID;
                        Order.SupEmail = supplier.SupEmail;
                        Order.SODate = order.SODate;
                        Order.Status = status.SOSDescription;

                        toReturn.supplierOrder = Order;

                    //set the list of products
                    List<Supplier_Order_Product> order_Products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == order.SupplierOrderID).ToList();
                    List<dynamic> products = new List<dynamic>();

                    if (order_Products != null)
                    {
                        foreach (Supplier_Order_Product product1 in order_Products)
                        {
                            Product prod = db.Products.Where(x => x.ProductID == product1.ProductID).FirstOrDefault();
                            if (prod != null)
                            {
                                dynamic product = new ExpandoObject();
                                product.ProductID = product1.ProductID;
                                product.SupplierID = prod.SupplierID;
                                product.ProdName = prod.ProdName;
                                product.ProdDescription = prod.ProdDesciption;
                                product.SOPQuantityOrdered = product1.SOPQuantityOrdered;
                                product.SOPQuantityRecieved = product1.SOPQuantityRecieved;

                                products.Add(product);


                            }

                        }

                        toReturn.products = products;
                    }
                    else
                    {
                        toReturn.Error= "No Prodcuts In Supplier Order";
                    }

                }
                else
                {
                    toReturn.Error= "Supplier Order Not Found";
                }


            }

            catch
            {
                toReturn = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //place supplier order
        [HttpGet]
        [Route("placeSupplierOrder")]
        public object placeSupplierOrder(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrder = new ExpandoObject();


            try
            {
                Supplier_Order order = db.Supplier_Order.Where(x => x.SupplierOrderID == id).FirstOrDefault();

                if (order != null)
                {


                    Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 1).FirstOrDefault();
                    order.SupplierOrderStatusID = status.SupplierOrderStatusID;
                    db.SaveChanges();

                    List<Supplier_Order_Product> order_Products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == id).ToList();
                    foreach (Supplier_Order_Product prod in order_Products)
                    {
                        //get product details
                        Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();

                        //get the backlog details of the product so we can add back the quantity
                        Product_Backlog backlog = db.Product_Backlog.Where(x => x.ProductID == product.ProductID && x.ContainerID == order.ContainerID).FirstOrDefault();
                        if (backlog != null)
                        {
                            //remove back the quantity
                            if(backlog.QuantityToOrder < prod.SOPQuantityOrdered)
                            {
                                backlog.QuantityToOrder = 0;
                                backlog.DateModified = DateTime.Now;
                                db.SaveChanges();
                            }
                            else
                            {
                                backlog.QuantityToOrder = backlog.QuantityToOrder - prod.SOPQuantityOrdered;
                                backlog.DateModified = DateTime.Now;
                                db.SaveChanges();
                            }
                            
                        }
                       


                    }

                   

                   toReturn.Message =  this.sendEmail(id);

                }
                else
                {
                    toReturn.Error = "Supplier Order Details Not Found";
                }

            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }


        //get full supplier Order details
        [HttpGet]
        [Route("cancelSupplierOrder")]
        public object cancelSupplierOrder(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.supplierOrder = new ExpandoObject();


            try
            {
                Supplier_Order order = db.Supplier_Order.Where(x => x.SupplierOrderID == id).FirstOrDefault();

                if (order != null)
                {
                    if(order.SupplierOrderStatusID == 2)
                    {
                        toReturn.Message = "Supplier Order Was Already Cancelled";
                        return toReturn;
                    }

                    if(order.SupplierOrderStatusID == 3 || order.SupplierOrderStatusID == 4)
                    {
                        toReturn.Message = "Delivered BackOrderd Orders Cannot Be Cancel";
                    }
                    else { 
                    
                    
                    Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 2).FirstOrDefault();
                    order.SupplierOrderStatusID = status.SupplierOrderStatusID;
                    order.Supplier_Order_Status = status;
                    db.SaveChanges();

                    List<Supplier_Order_Product> order_Products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == id).ToList();
                        foreach (Supplier_Order_Product prod in order_Products)
                        {
                            //get product details
                            Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();

                            //get the backlog details of the product so we can add back the quantity
                            Product_Backlog backlog = db.Product_Backlog.Where(x => x.ProductID == product.ProductID && x.ContainerID == order.ContainerID).FirstOrDefault();
                            if (backlog != null)
                            {
                                //add back the quantity
                                backlog.QuantityToOrder = backlog.QuantityToOrder + prod.SOPQuantityOrdered;
                                backlog.DateModified = DateTime.Now;
                                db.SaveChanges();
                            }
                            else
                            {
                                //if no backlog record exits, create a new 
                                Product_Backlog backlog1 = new Product_Backlog();
                                backlog1.ProductID = product.ProductID;
                                backlog1.QuantityToOrder = prod.SOPQuantityOrdered;
                                backlog1.DateModified = DateTime.Now;
                                backlog1.ContainerID = order.ContainerID;
                                db.Product_Backlog.Add(backlog1);
                                db.SaveChanges();
                            }

                        }

                    }


                    toReturn.Message = "Supplier Order Successfuly Cancelled";

                }
                else
                {
                    toReturn.Error= "Supplier Order Not Found";
                }

            }

            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }


        //update orders quantity recieved
        [HttpGet]
        [Route("receiveProductStock")]
        public object receiveProductStock( int supplierOrderID, int productID, int quantity, int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.product = new ExpandoObject();


            try
            {
                //search for the supplier and product in the database
                // Supplier supplier = db.Suppliers.Where(X => X.SupplierID == supplierID).FirstOrDefault();
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();

                if ( product != null)
                {

                    //check to see if the supplier order was already created today in the current container
                    Supplier_Order supplier_Order = db.Supplier_Order.Where(x => x.SupplierOrderID  == supplierOrderID).FirstOrDefault();
                    if (supplier_Order != null)
                    {
                        //get Product
                        Supplier_Order_Product prod = db.Supplier_Order_Product.Where(x => x.ProductID == product.ProductID && x.SupplierOrderID == supplier_Order.SupplierOrderID).FirstOrDefault();

                        if (prod != null)
                        {
                            prod.SOPQuantityRecieved = quantity;
                            db.SaveChanges();


                            //returning the product so you can see it in the console if you want
                            toReturn.product = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == supplier_Order.SupplierOrderID).FirstOrDefault();

                            toReturn.Message = "Product Quantity Saved";

                            //adjust quantity on hand in container
                            Container con = db.Containers.Where(x => x.ContainerID == containerID).FirstOrDefault();
                            if (con != null)
                            {
                                Container_Product conProd = db.Container_Product.Where(x => x.ContainerID == con.ContainerID && x.ProductID == productID).FirstOrDefault();
                                if (conProd != null)
                                {
                                    conProd.CPQuantity = conProd.CPQuantity + quantity;
                                    db.SaveChanges();
                                    toReturn.Message = "Container's Product Quantity Updated";
                                }
                            }


                        }
                        else
                        {
                            toReturn.Error = "Product Not Found";
                        }
                       

                    }


                }
        }
            catch
            {
                toReturn.Error = "Receiving Stock Failed";
            }

            return toReturn;

        }

        private string PrepareHtmlContent(List<Supplier_Order_Product> dataTable)
        {

            var htmlDocument = new HtmlDocument();
            var html = Properties.Resources.SupplierOrder; 
            htmlDocument.LoadHtml(html);
            var recordsContainerNode = htmlDocument.GetElementbyId("dataTable");

            if (recordsContainerNode != null)
            {
                var innerHtml = "";


                foreach (var item in dataTable)
                {
                    Product prod = db.Products.Where(x => x.ProductID == item.ProductID).FirstOrDefault();
                    if (prod != null)
                    {
                        innerHtml += "<tr>";
                        innerHtml += "<td>" + prod.ProdName + "</td> ";
                        innerHtml += "<td> " + item.SOPQuantityOrdered + "</td> ";
                        innerHtml += "</tr>";
                    }


                }


                recordsContainerNode.InnerHtml = innerHtml;
            }

            using (var stringWriter = new StringWriter())
            {
                htmlDocument.Save(stringWriter);
                return stringWriter.GetStringBuilder().ToString();
            }
        }


        //send email
        [Route("sendEmail")]
        [HttpPost]
        public object sendEmail(int supplierOrderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {


                Supplier_Order order = db.Supplier_Order.Where(z => z.SupplierOrderID == supplierOrderID).FirstOrDefault();


                if (order != null)
                {
                    Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();

                    if (supplier != null)
                    {
                        List<Supplier_Order_Product> products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == supplierOrderID).ToList();
                        if (products.Count != 0)
                        {

                            using (MailMessage mail = new MailMessage())
                            {
                                mail.From = new MailAddress("ordrasa@gmail.com");
                                mail.To.Add(supplier.SupEmail);
                                mail.Subject = "Ordra Products Order";
                                mail.Body =  PrepareHtmlContent(products);
                                mail.IsBodyHtml = true;

                                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                                {
                                    toReturn.Message = "Supplier Order Email Sent";
                                    smtp.Credentials = new System.Net.NetworkCredential("ordrasa@gmail.com", "Ordra@444");
                                    smtp.EnableSsl = true;
                                    smtp.Send(mail);
                                    
                                }
                            }
                        }
                        else
                        {
                            toReturn.Error = "No Products In Order";
                        }
                    }
                    else
                    {
                        toReturn.Error = "Supplier Not Found";
                    }
                }
                else
                {
                    toReturn.Error = "Supplier Order Not Found";
                }

                
            }
            catch
            {
                toReturn.Error = "Mail unsuccessfully sent";
            }

            return toReturn;
        }



        [Route("receiveOrderProduct")]
        [HttpGet]
        public object receiveOrderProduct(int supplierOrderID, int productID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            { 

            Supplier_Order_Product prod = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == supplierOrderID).FirstOrDefault();
            if (prod != null)
            {
                prod.SOPQuantityRecieved = quantity;
                db.SaveChanges();
                toReturn.Message = "Product Quantity Saved";
            }
            }
            catch
            {
                toReturn.Error = "Adding Product Qauntity Unsuccessful";
            }

            return toReturn;
        }

        [Route("updateCustomerOrder")]
        [HttpGet]
        public object updateCustomerOrder(int containerID, int supplierOrderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
             bool fulfilled = false;

            try
            { 
                Supplier_Order_Status delivered = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 3).FirstOrDefault();
                Supplier_Order suporder = db.Supplier_Order.Where(x => x.SupplierOrderID == supplierOrderID).FirstOrDefault();
                    if(suporder != null && delivered != null)
                    {
                        suporder.SupplierOrderStatusID =delivered.SupplierOrderStatusID;
                        suporder.Supplier_Order_Status = delivered;
                        db.SaveChanges();
                    }


                Customer_Order_Status status = db.Customer_Order_Status.Where(x => x.CustomerOrderStatusID == 2).FirstOrDefault();
                List<Customer_Order> orders = db.Customer_Order.Where(x => x.CustomerOrderStatusID == 1 && x.ContainerID == containerID).ToList();
                if(orders.Count != 0)
                {
                    foreach(Customer_Order order in orders)
                    {
                        List<Product_Order_Line> product_Orders = db.Product_Order_Line.Where(x => x.CustomerOrderID == order.CustomerOrderID).ToList();
                        if(product_Orders.Count != 0)
                        {
                            foreach (Product_Order_Line product in product_Orders)
                            {
                                Container_Product prod = db.Container_Product.Where(x => x.ProductID == product.ProductID && x.ContainerID == containerID).FirstOrDefault();
                                if (prod != null) 
                                { 
                                        if (product.PLQuantity <= prod.CPQuantity)
                                        {
                                            fulfilled = true;

                                        }
                                        else
                                        {
                                            fulfilled = false;
                                        }
                                }
                            }

                        }

                        if(fulfilled == true)
                        {
                            order.CustomerOrderStatusID = status.CustomerOrderStatusID;
                            order.Customer_Order_Status = status;
                            db.SaveChanges();
                        }

                    }
                }

                toReturn.Message = "Stock Received And Recorded Successfuly";
            }
            catch
            {
                toReturn.Error = "No Orders Found";
            }

            return toReturn;
        }


        private string PrepareHtml(List<Supplier_Order_Product> dataTable)
        {

            var htmlDocument = new HtmlDocument();
            var html = Properties.Resources.SupplierBackOrder;
            htmlDocument.LoadHtml(html);
            var recordsContainerNode = htmlDocument.GetElementbyId("dataTable");

            if (recordsContainerNode != null)
            {
                var innerHtml = "";


                foreach (var item in dataTable)
                {
                    Product prod = db.Products.Where(x => x.ProductID == item.ProductID).FirstOrDefault();
                    if (prod != null)
                    {
                        innerHtml += "<tr>";
                        innerHtml += "<td>" + prod.ProdName + "</td> ";
                        innerHtml += "<td> " + (item.SOPQuantityOrdered - item.SOPQuantityRecieved) + "</td> ";
                        innerHtml += "</tr>";
                    }


                }


                recordsContainerNode.InnerHtml = innerHtml;
            }

            using (var stringWriter = new StringWriter())
            {
                htmlDocument.Save(stringWriter);
                return stringWriter.GetStringBuilder().ToString();
            }
        }


        //send email
        [Route("sendBackOrderEmail")]
        [HttpPost]
        public object sendBackOrderEmail(int supplierOrderID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {


                Supplier_Order order = db.Supplier_Order.Where(z => z.SupplierOrderID == supplierOrderID).FirstOrDefault();
                Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 4).FirstOrDefault();


                if (order != null)
                {
                    Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();

                    if (supplier != null)
                    {
                        List<Supplier_Order_Product> products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == supplierOrderID).ToList();



                        if (products.Count != 0)
                        {
                            List<Supplier_Order_Product> backProducts = new List<Supplier_Order_Product>();
                            foreach (Supplier_Order_Product back in products)
                            {
                                if (back.SOPQuantityOrdered > back.SOPQuantityRecieved)
                                {
                                    backProducts.Add(back);
                                }
                            }

                            if (backProducts.Count != 0) {
                                if (order != null && status != null)
                                {
                                    order.SupplierOrderStatusID = status.SupplierOrderStatusID;
                                    order.Supplier_Order_Status = status;
                                    db.SaveChanges();
                                }

                                using (MailMessage mail = new MailMessage())
                            {
                                mail.From = new MailAddress("ordrasa@gmail.com");
                                mail.To.Add(supplier.SupEmail);
                                mail.Subject = "Ordra Products Back Order";
                                mail.Body = PrepareHtml(backProducts);
                                mail.IsBodyHtml = true;

                                using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                                {
                                    smtp.Credentials = new System.Net.NetworkCredential("ordrasa@gmail.com", "Ordra@444");
                                    smtp.EnableSsl = true;
                                    smtp.Send(mail);
                                    toReturn.Message = "Supplier BackOrder Email Sent";

                                      

                                }
                            }
                            }
                            else
                            {
                                toReturn.Error = "No Products In Order For BackOrder";
                            }
                        }
                        else
                        {
                            
                            toReturn.Error = "No Products In Order";
                        }
                    }
                    else
                    {
                        toReturn.Error = "Supplier Not Found";
                    }
                }
                else
                {
                    toReturn.Error = "Supplier Order Not Found";
                }


            }
            catch
            {
                toReturn.Error = "Mail unsuccessfully sent";
            }

            return toReturn;
        }


    }
}
