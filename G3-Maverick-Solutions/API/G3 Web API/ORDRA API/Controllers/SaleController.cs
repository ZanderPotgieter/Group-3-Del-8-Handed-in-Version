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

    [RoutePrefix("API/Sale")]
    public class SaleController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Make Sale
        [HttpPost]
        [Route("initiateMakeSale")]
        public object initiateMakeSale(dynamic session)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.products = new ExpandoObject();
            toReturn.Sale = new Sale();
            toReturn.paymetTypes = new ExpandoObject();
            toReturn.VAT = new ExpandoObject();


           try
            {
                Container con = new Container();
                //get container of current user
                string sessionID = session.token;
                var user = db.Users.Where(x => x.SessionID == sessionID).FirstOrDefault();
                
                if ( user.ContainerID == null)
                {
                    return toReturn.Error = ("Curent Container Not Found");
                    
                }
                con = db.Containers.Where(x => x.ContainerID == user.ContainerID).FirstOrDefault();
                if(con == null)
            {
                return toReturn.Error = ("Curent Container Not Found");
            }
                //get products in container 
                List<Container_Product> conProd = db.Container_Product.Include(x => x.Product).Where(x => x.CPQuantity > 0 && x.ContainerID == con.ContainerID).ToList();



                //get todays date 
                DateTime SaleDate = DateTime.Now;

                //get payment types
                toReturn.paymentTypes = db.Payment_Type.ToList();

                

            if (conProd != null)
            {
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
                    Sale newSale = new Sale();
                    newSale.SaleDate = SaleDate;
                    newSale.UserID = user.UserID;
                    newSale.User = user;
                    newSale.Container = con;
                    newSale.ContainerID = con.ContainerID;
                    db.Sales.Add(newSale);
                    db.SaveChanges();

                    //getsale
                    toReturn.Sale = db.Sales.ToList().LastOrDefault();

                }
            else
            {
                return toReturn.Message = "There are no products in stock for the operating Container";
            }




            }
            catch 
            {
                toReturn.Error = "Please Reload Page to Initiate Sale";
            }

            return toReturn;


        }

        [HttpGet]
        [Route("addSaleProduct")]
        public object addSaleProduct(int productID, int saleID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                if (product != null)
                {
                    Sale sale = db.Sales.Where(x => x.SaleID == saleID).FirstOrDefault();
                    if(sale != null)
                    {
                        Container_Product container_Product = db.Container_Product.Where(x => x.ContainerID == sale.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                        if (container_Product != null)
                        {
                            container_Product.CPQuantity = (container_Product.CPQuantity - quantity);
                            db.SaveChanges();

                            Product_Sale product_Sale = db.Product_Sale.Where(x => x.ProductID == product.ProductID && x.SaleID == sale.SaleID).FirstOrDefault();
                            if (product_Sale == null)
                            {
                                Product_Sale newProduct_Sale = new Product_Sale();
                                newProduct_Sale.ProductID = product.ProductID;
                                newProduct_Sale.Product = product;
                                newProduct_Sale.SaleID = sale.SaleID;
                                newProduct_Sale.Sale = sale;
                                newProduct_Sale.PSQuantity = quantity;
                                db.Product_Sale.Add(newProduct_Sale);
                                db.SaveChanges();

                                toReturn.Product_Sale = db.Product_Sale.ToList().LastOrDefault();

                            }
                            else
                            {
                                product_Sale.PSQuantity = product_Sale.PSQuantity + quantity;
                                db.SaveChanges();

                                toReturn.Product_Sale = product_Sale;
                            }
                        }
                        else
                        {
                            toReturn.Error = "Container Not Found";
                        }


                    }
                    else
                    {
                        toReturn.Error = "Sale Not Found";
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
        [Route("removeSaleProduct")]
        public object removeSaleProduct(int productID, int saleID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                if (product != null)
                {
                    Sale sale = db.Sales.Where(x => x.SaleID == saleID).FirstOrDefault();
                    if (sale != null)
                    {
                        Container_Product container_Product = db.Container_Product.Where(x => x.ContainerID == sale.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                        if (container_Product != null)
                        {
                                container_Product.CPQuantity = (container_Product.CPQuantity + quantity);
                            db.SaveChanges();

                            Product_Sale product_Sale = db.Product_Sale.Where(x => x.ProductID == product.ProductID && x.SaleID == sale.SaleID).FirstOrDefault();
                            if (product_Sale != null)
                            {

                                db.Product_Sale.Remove(product_Sale);
                                db.SaveChanges();

                                toReturn.Product_Sale = product_Sale;
                            }
                        }
                         else
                         {
                                toReturn.Error = "Container Not Found";
                         }


                }
                    else
                    {
                        toReturn.Error = "Sale Not Found";
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
        [Route("makeSalePayment")]
        public object makeSalePayment(int saleID, float payAmount, int paymentTypeID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                Sale sale = db.Sales.Where(x => x.SaleID == saleID).FirstOrDefault();
                if (sale != null)
                {
                    Payment_Type paymentType = db.Payment_Type.Where(x => x.PaymentTypeID == paymentTypeID).FirstOrDefault();
                    if(paymentType != null)
                    {
                        Payment payment = new Payment();
                        payment.SaleID = sale.SaleID;
                        payment.Sale = sale;
                        payment.PayAmount = payAmount;
                        payment.PayDate = DateTime.Now;
                        payment.PaymentTypeID = paymentTypeID;
                        db.Payments.Add(payment);
                        db.SaveChanges();

                        toReturn.Payment = db.Payments.ToList().LastOrDefault();
                    }
                    else
                    {
                        toReturn.Error = "Payment Type Not Found";
                    }

                  


                }
                else
                {
                    toReturn.Error = "Sale Not Found";
                }


            }
            catch
            {
                toReturn.Error = "Payment Add Unsuccessful";
            }

            return toReturn;
        }




        [HttpGet]
        [Route("getAllSales")]
        public object getAllSales()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                List<Sale> sales = db.Sales.ToList();
                List<dynamic> Sales = new List<dynamic>();

                foreach (Sale sale in sales)
                {
                    Sale sale1= db.Sales.Where(x => x.SaleID == sale.SaleID).FirstOrDefault();
                    ///User user = sale1.User;
                    DateTime date = Convert.ToDateTime(sale1.SaleDate);
                    if (sale1 != null)
                    {
                        
                        List<Product_Sale> product_Sale = db.Product_Sale.Where(x => x.SaleID == sale1.SaleID).ToList();

                        if (product_Sale.Count != 0)
                        {
                            dynamic searchedSale = new ExpandoObject();
                            searchedSale.SaleID = sale.SaleID;
                            // searchedSale.UserName = user.UserName;
                            searchedSale.SaleDate = date.ToString("yyyy-MM-dd");
                            Sales.Add(searchedSale);
                        }
                    }
                }

                toReturn.Sales = Sales;
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;
        }

       // Cancel Sale
        [HttpGet]
        [Route("cancelSale")]
        public object cancelSale(int saleID)
        {
           db.Configuration.ProxyCreationEnabled = false;
           dynamic toReturn = new ExpandoObject();

            try
            {
                //get sale
                Sale newSale = db.Sales.Where(x => x.SaleID == saleID).FirstOrDefault();
                if (newSale != null) {

                    //get container
                 Container container = db.Containers.Where(x => x.ContainerID == newSale.ContainerID).FirstOrDefault();



                    //get list of products in Sale
                    List<Product_Sale> product_Sales = newSale.Product_Sale.ToList();

                    if (container != null)
                    {
                        if (product_Sales != null)
                        {
                            foreach (var prod in product_Sales)
                            {
                                Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();
                                if (product != null)
                                {
                                   
                                        Container_Product container_Product = db.Container_Product.Where(x => x.ContainerID == newSale.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                                        if (container_Product != null)
                                        {
                                            container_Product.CPQuantity = (container_Product.CPQuantity + prod.PSQuantity);
                                            db.SaveChanges();

                                            Product_Sale product_Sale = db.Product_Sale.Where(x => x.ProductID == product.ProductID && x.SaleID == newSale.SaleID).FirstOrDefault();
                                            if (product_Sale != null)
                                            {

                                                db.Product_Sale.Remove(product_Sale);
                                                db.SaveChanges();
                                            }
                                        }
                                     
                                }
                                else
                                {
                                    toReturn.Error = "Product Not Found";
                                }


                            }
                            //get list of payment
                            List<Payment> payments = db.Payments.Where(x => x.SaleID == newSale.SaleID).ToList();
                            if (payments.Count != 0)
                            {
                                foreach (Payment payment in payments)
                                {
                                    db.Payments.Remove(payment);
                                    db.SaveChanges();
                                }
                            }



                            toReturn.Message = "Sale Cancelled";
                        }
                       
                    }
                    else
                    {
                        toReturn.Error = "Container Not Found";
                    }
                }

                   
                else
                {
                    toReturn.Error = "Cancel Failed: Sale Not Found";
                }
            }
            catch
            {
                toReturn.Error = "Sale Cancellation Unsuccessfully Completed";
            }

            return toReturn;
        }

        // To search for sales made on a specific date
        //[HttpGet]
        //[Route("searchSalesByDate/{date}")]
        //public object searchSalesByDate(DateTime date)
        //{
        //    db.Configuration.ProxyCreationEnabled = false;
        //    dynamic toReturn = new ExpandoObject();

        //    try
        //    {

        //        List<Sale> searchedSales = db.Sales.Include(x => x.Product_Sale).Include(x => x.Payments).Include(x => x.User).Where(x => x.SaleDate == date).ToList();
        //        toReturn = searchedSales;
        //    }
        //    catch 
        //    {
        //        toReturn.Error = "Search Interrupted. Retry";
        //    }

        //    return toReturn;


        //}

        [HttpGet]
        [Route("searchSalesByDate/{date}")]
        public object searchSalesByDate(DateTime date)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //List<Sale> searchedSales = db.Sales.Include(x => x.Product_Sale).Include(x => x.Payments).Include(x => x.User).Where(x => x.SaleDate == date).ToList();

                //toReturn = searchedSales;

                //List<Sale> sales = db.Sales.Include(x => x.User).ToList();
                List<Sale> sales = db.Sales.Include(x => x.User).Where(x => x.SaleDate == date).ToList();
                List<dynamic> searchedsales = new List<dynamic>();

                foreach(Sale sale in sales)
                {

                    DateTime saledate = Convert.ToDateTime(sale.SaleDate);
                    if (sale != null)
                    {

                        List<Product_Sale> product_Sale = db.Product_Sale.Where(x => x.SaleID == sale.SaleID).ToList();

                        if (product_Sale.Count != 0)
                        {
                            dynamic searchedSale = new ExpandoObject();
                            searchedSale.SaleID = sale.SaleID;
                            searchedSale.UserName = sale.User.UserName;

                            searchedSale.SaleDate = saledate.ToString("yyyy-MM-dd");
                            searchedsales.Add(searchedSale);
                        }
                    }


                }
                toReturn = searchedsales;

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;


        }

        //To search for sales with a specific product
        [HttpGet]
        [Route("searchSalesByProduct/{ProductID}")]
        public object searchSalesByProduct(int ProductID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //get all sales
                List<Sale> allSales = db.Sales.Include(x => x.Product_Sale).Include(x => x.Payments).Include(x => x.User).ToList();

                //check if sale has product
                List<Sale> searchedSales = new List<Sale>();
                foreach (var sale in allSales)
                {
                    //get list of products in each sale
                    List<Product_Sale> product_Sales = sale.Product_Sale.ToList();
                    foreach (var prod in product_Sales)
                    {
                        if (prod.ProductID == ProductID)
                        {
                            searchedSales.Add(sale);
                        }
                    }
                }

                toReturn = searchedSales;

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;


        }

        //to get sale details for a full view using id
        [HttpGet]
        [Route("getSale/{id}")]
        public object getSale(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            double TotalIncVat = 0.0;
            toReturn.calculatedValues = new ExpandoObject();
            toReturn.saleProducts = new List<dynamic>();
            toReturn.saleDate = new ExpandoObject();
            DateTime saleDate = DateTime.Now;

            try
            {

                Sale searchedSale = db.Sales.Include(x => x.Product_Sale).Include(x => x.Payments).Include(x => x.User).Where(x => x.SaleID == id).FirstOrDefault();
                if (searchedSale != null)
                {
                    //get list of Products in sale from db
                    List<Product_Sale> product_Sales = db.Product_Sale.Include(x => x.Sale).Include(x => x.Product).Where(x => x.SaleID == searchedSale.SaleID).ToList();


                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in product_Sales)
                    {

                        //Get Price For Each Product
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= searchedSale.SaleDate && x.PriceEndDate >= searchedSale.SaleDate && x.ProductID == prod.ProductID).FirstOrDefault();

                        if (price != null)
                        {

                            //Calculate Product Subtotal
                            double unitPrice = (double)price.UPriceR;
                            double quantity = (double)prod.PSQuantity;
                            double subtotal = unitPrice * quantity;

                            //Create Object And Populate With Product Related Details
                            dynamic productDetails = new ExpandoObject();
                            productDetails.ProductID = prod.ProductID;
                            productDetails.Prodname = prod.Product.ProdName;
                            productDetails.ProdDescription = prod.Product.ProdDesciption;
                            productDetails.Quantity = prod.PSQuantity.ToString();
                            productDetails.Price = price.UPriceR.ToString();
                            productDetails.Subtotal = subtotal.ToString("#.##");

                            TotalIncVat = TotalIncVat + subtotal;

                            products.Add(productDetails);
                        }
                        //set list of products to return object
                        toReturn.saleProducts = products;


                        var vatOnDate = db.VATs.Where(x => x.VATStartDate <= searchedSale.SaleDate).FirstOrDefault();
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
                            saleDate = Convert.ToDateTime(searchedSale.SaleDate);
                            toReturn.saleDate = saleDate;

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
                toReturn.Message = "Sale Search Inturrupted, Retry";
            }

            return toReturn;
        }


        [HttpGet]
        [Route("checkStock")]
        public bool checkStock(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            bool found = false;

            try
            {
               List<Container_Product> container_Product = db.Container_Product.Where(x => x.ContainerID == containerID).ToList();
                if (container_Product != null)
                { 
                    foreach(Container_Product conProd in container_Product){
                        Product product = db.Products.Where(x => x.ProductID == conProd.ProductID).FirstOrDefault();
                        if(product.ProdReLevel >= conProd.CPQuantity)
                        {
                            found = true;
                        }
                    }
                }

               

            }
            catch
            {
                
            }

            return found;
        }


    }
}
