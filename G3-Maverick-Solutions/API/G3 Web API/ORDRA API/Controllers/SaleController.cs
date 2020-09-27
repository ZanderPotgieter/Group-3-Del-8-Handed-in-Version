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

    [RoutePrefix("API/Sale")]
    public class SaleController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Make Sale
        [HttpGet]
        [Route("initiateMakeSale")]
        public object initiateMakeSale()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.products = new ExpandoObject();
            toReturn.SaleDate = new ExpandoObject();
            toReturn.paymetTypes = new ExpandoObject();
            toReturn.VAT = new ExpandoObject();


            try
            {
                //get todays date 
                toReturn.SaleDate = DateTime.Now;

                //get payment types
                toReturn.paymentTypes = db.Payment_Type.ToList();

                //get VAT
                toReturn.VAT = db.VATs.Where(x => x.VATStartDate <= DateTime.Now && x.VATEndDate >= DateTime.Now).FirstOrDefault();


                //Get List Of products with current price
                List<Product> productsList = db.Products.ToList();
                List<dynamic> products = new List<dynamic>();
                foreach (var prod in productsList)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == prod.ProductID).FirstOrDefault();
                    if (price != null)
                    {
                        double Price = (double)price.UPriceR;
                        dynamic productDetails = new ExpandoObject();
                        productDetails.ProductCategoryID = prod.ProductCategoryID;
                        productDetails.ProductID = prod.ProductID;
                        productDetails.ProdBarcode = prod.ProdBarcode;
                        productDetails.ProdDescription = prod.ProdDesciption;
                        productDetails.Prodname = prod.ProdName;
                        productDetails.Quantity = 0;
                        productDetails.Price = Math.Round(Price, 2);
                        productDetails.Subtotal = 0.0;

                        products.Add(productDetails);
                    }
                }
                toReturn.products = products;




            }
            catch 
            {
                toReturn.Error = "Please Reload Page to Initiate Sale";
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
                    if (sale1 != null )
                    {
                        dynamic searchedSale = new ExpandoObject();
                        searchedSale.SaleID = sale.SaleID;
                       // searchedSale.UserName = user.UserName;
                        searchedSale.SaleDate = date.ToString("yyyy-MM-dd");
                        Sales.Add(searchedSale);
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

        //Make Sale
        [HttpPost]
        [Route("makeSale")]
        public object makeSale(Sale newSale)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
            //get user who made sale
            // User user = db.Users.Where(x => x.UserID == newSale.UserID).FirstOrDefault();
            int id = (int)newSale.UserID;

           // User saleUser = db.Users.Where(x => x.UserID == id).FirstOrDefault();

            
                //add sale
                Sale sale = new Sale();
                sale.UserID = newSale.UserID;
                sale.SaleDate = DateTime.Now;
                db.Sales.Add(sale);
                db.SaveChanges();


                //get the sale record just added
                Sale addedSale = db.Sales.ToList().LastOrDefault();

                //get list of products in new Sale
                List<Product_Sale> product_Sales = newSale.Product_Sale.ToList();


                //Add the Product_Sale Records for each product
                foreach (var prod in product_Sales)
                {
                    Product product = db.Products.Where(x => x.ProductID == prod.ProductID).FirstOrDefault();
                    Product_Sale prodSale = new Product_Sale();
                    prodSale.SaleID = addedSale.SaleID;
                    prodSale.ProductID = product.ProductID;
                    prodSale.PSQuantity = prod.PSQuantity;
                    prodSale.Product = product;
                    prodSale.Sale = addedSale;

                    db.Product_Sale.Add(prodSale);
                    db.SaveChanges();

                }




                //Add Payment details to sale reord, note a sale can have more than one payment method
                List<Payment> payment = newSale.Payments.ToList();
                foreach (var item in payment)
                {
                    item.Sale = addedSale;
                    item.PayDate = DateTime.Now;
                    addedSale.Payments.Add(item);
                    db.SaveChanges();
                }


                //get sale ID OF record made(incase you immediately wanr to see the details after or print to a receipt
                int saleMadeID = addedSale.SaleID;

                toReturn.saleID = saleMadeID;
                toReturn.Message = "Sale Completed Succuessfully";
           
           }
            catch
            {
                toReturn.Error = "Sale Unsuccessfully Completed";
            }

            return toReturn;
        }

        // To search for sales made on a specific date
        [HttpGet]
        [Route("searchSalesByDate/{date}")]
        public object searchSalesByDate(DateTime date)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {

                List<Sale> searchedSales = db.Sales.Include(x => x.Product_Sale).Include(x => x.Payments).Include(x => x.User).Where(x => x.SaleDate == date).ToList();
                toReturn = searchedSales;
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

            catch (Exception error)
            {
                toReturn.Message = error.Message;
            }

            return toReturn;
        }
    }
}
