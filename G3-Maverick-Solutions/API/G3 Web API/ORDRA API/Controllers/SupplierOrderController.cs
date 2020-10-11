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

                    //check to see if the supplier order was already created today in the current container
                    Supplier_Order supplier_Order = db.Supplier_Order.Where(x => x.SupplierID == supplierID && x.SODate == DateTime.Now && x.SupplierOrderStatusID == 1 && x.ContainerID == containerID).FirstOrDefault();
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

                        //retrive the placed order
                        Supplier_Order order = db.Supplier_Order.Where(x => x.SupplierID == supplierID && x.SODate == DateTime.Now && x.SupplierOrderStatusID == 1 && x.ContainerID == containerID).ToList().LastOrDefault();

                        if (order != null)
                        {
                            //add the product to the created order
                            Supplier_Order_Product addProd = new Supplier_Order_Product();
                            addProd.ProductID = productID;
                            addProd.SupplierOrderID = order.SupplierOrderID;
                            addProd.SOPQuantityOrdered = quantity;
                            addProd.SOPQuantityRecieved =0;
                            db.Supplier_Order_Product.Add(addProd);
                            db.SaveChanges();

                            //returning the product so you can see it in the console
                            toReturn.product = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == order.SupplierOrderID).FirstOrDefault();
                        }
                        else
                        {

                            toReturn.Error = "Adding Product To Supplier Order Unsuccessful";
                        }
                    }
                    else{ 
                        
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
                toReturn.Error = "Search Interrupted. Retry";
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
                List<Supplier_Order> supplier_Orders = db.Supplier_Order.Where(x => x.ContainerID == containerID && x.SupplierOrderStatusID == 1 && x.SODate == DateTime.Now).ToList();
                List<object> orders = new List<object>();
                if(supplier_Orders.Count != 0)
                {
                    foreach(Supplier_Order order in supplier_Orders)
                    {
                        //get supplier linked to 
                        Supplier supplier = db.Suppliers.Where(x => x.SupplierID == order.SupplierID).FirstOrDefault();
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == order.SupplierOrderStatusID).FirstOrDefault();


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


                        //set dynamic object to display in list
                        dynamic Order = new ExpandoObject();
                        Order.SupplierOrderID = order.SupplierOrderID;
                        Order.SupplierID = order.SupplierID;
                        Order.ContainerID = order.ContainerID;
                        Order.SupEmail = supplier.SupEmail;
                        Order.Status = status.SOSDescription;
                        Order.SupName = supplier.SupName;
                        Order.SODate = order.SODate;
                        orders.Add(Order);

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
                            //add back the quantity
                            backlog.QuantityToOrder = backlog.QuantityToOrder - prod.SOPQuantityOrdered;
                            backlog.DateModified = DateTime.Now;
                            db.SaveChanges();
                        }
                       


                    }


                    toReturn.Message = "Supplier Order Successfuly Placed";

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
                    
                    
                    Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == 2).FirstOrDefault();
                    order.SupplierOrderStatusID = status.SupplierOrderStatusID;
                    db.SaveChanges();

                    List<Supplier_Order_Product> order_Products = db.Supplier_Order_Product.Where(x => x.SupplierOrderID == id).ToList();
                    foreach( Supplier_Order_Product prod in order_Products)
                    {
                        //get product details
                        Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();

                        //get the backlog details of the product so we can add back the quantity
                        Product_Backlog backlog = db.Product_Backlog.Where(x => x.ProductID == product.ProductID && x.ContainerID == order.ContainerID).FirstOrDefault();
                        if(backlog != null)
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
                            backlog.DateModified = DateTime.Now;
                            backlog.ContainerID = order.ContainerID;
                            db.Product_Backlog.Add(backlog1);
                            db.SaveChanges();
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


        //Screen 1
        //Add a product to the suppliers order
        [HttpGet]
        [Route("receiveProductStock")]
        public object receiveProductStock(int containerID, int supplierID, int productID, int quantity)
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

                    //check to see if the supplier order was already created today in the current container
                    Supplier_Order supplier_Order = db.Supplier_Order.Where(x => x.SupplierID == supplierID && x.SODate == DateTime.Now && x.SupplierOrderStatusID == 1 && x.ContainerID == containerID).FirstOrDefault();
                    if (supplier_Order == null)
                    {
                        //get the "Placed" order status
                        Supplier_Order_Status status = db.Supplier_Order_Status.Where(x => x.SOSDescription == "Delivered").FirstOrDefault();


                        //add product to existing Order
                        Supplier_Order_Product addProd = new Supplier_Order_Product();
                        addProd.ProductID = productID;
                        addProd.SupplierOrderID = supplier_Order.SupplierOrderID;
                        addProd.SOPQuantityRecieved = quantity;
                        db.Supplier_Order_Product.Add(addProd);
                        db.SaveChanges();

                        //returning the product so you can see it in the console if you want
                        toReturn.product = db.Supplier_Order_Product.Where(x => x.ProductID == productID && x.SupplierOrderID == supplier_Order.SupplierOrderID).FirstOrDefault();

                        toReturn.Message = "Product Quantity Saved";
                        //adjust quantity on hand in container
                        Container con = db.Containers.Where(x => x.ContainerID == containerID).FirstOrDefault();
                        if(con != null)
                        {
                            Container_Product conProd = db.Container_Product.Where(x => x.ContainerID == con.ContainerID && x.ProductID == productID).FirstOrDefault();
                            if(conProd != null)
                            {
                                conProd.CPQuantity = conProd.CPQuantity + quantity;
                                toReturn.Message = "Container's Product Quantity Updated";
                            }
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



    }
}
