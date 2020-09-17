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

    [RoutePrefix("API/Product")]
    public class ProductController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all products
        [HttpGet]
        [Route("GetAllProducts")]
        public object GetAllProducts()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Products.Include(x => x.Prices).ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting product by id
        [HttpGet]
        [Route("GetProduct/{id}")]

        public object GetProduct(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product objectProduct = new Product();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProduct = db.Products.Find(id);

                if (objectProduct == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectProduct;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        //search  by product category
        [HttpGet]
        [Route("SearchProductByCategory")]
        public object SearchProductByCategory(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //get product details 
               Product prod = db.Products.Include(x=>x.Product_Category).Where(x=>x.Product_Category.PCatName == name).FirstOrDefault();
                
                if (prod != null)
                {
                    //get product details in a list
                    List<Product> productD = db.Products.Include(x => x.Product_Category).Where(x => x.Product_Category.PCatName == name).ToList();

                    List<dynamic> items = new List<dynamic>();
                    foreach( var item in productD)
                    {
                        //get price details
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.ProductID == item.ProductID).ToList().FirstOrDefault();

                        dynamic productWithPrice = new ExpandoObject();
                        productWithPrice.ProductID = item.ProductID;
                        productWithPrice.ProductCategoryID = item.ProductCategoryID;
                        productWithPrice.ProductCategoryName = item.Product_Category.PCatName;
                        productWithPrice.ProdName = item.ProdName;
                        productWithPrice.ProdDescription = item.ProdDesciption;
                        productWithPrice.ProduReLevel = item.ProdReLevel;
                        productWithPrice.UPriceR = price.UPriceR;
                        productWithPrice.CPriceR = price.CPriceR;
                        productWithPrice.PriceStartDate = price.PriceStartDate;
                        productWithPrice.PriceEndDate = price.PriceEndDate;

                        items.Add(productWithPrice);
                        
                    }
                    

                    toReturn = items;
                }
                else
                {

                    toReturn.Message = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }

        //get product category details
        [HttpGet]
        [Route("GetAllProductCategories")]
        public object GetAllProductCategories()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Product_Category.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //add product
        [HttpPost]
        [Route("AddProduct")]
        public object AddProduct(Product newProduct)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                db.Products.Add(newProduct);
                db.SaveChanges();

               
                    toReturn.Message = "Add Succsessful";
           
            }
            catch(Exception)
            {
                toReturn.Message = "Add UnSuccsessful";

            }
            return toReturn;
        }

        //update product
        [HttpPut]
        [Route("UpdateProduct")]
        public object UpdateProduct(Product productUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product objectProduct = new Product();
            Price objectPrice = new Price();
            dynamic toReturn = new ExpandoObject();
            var id = productUpdate.ProductID;

            try
            {
                objectProduct = db.Products.Include(z => z.Prices).Where(x => x.ProductID == id).FirstOrDefault();
                if (objectProduct != null)
                {
                    objectProduct.ProdName = productUpdate.ProdName;
                    objectProduct.ProdDesciption = productUpdate.ProdDesciption;
                    objectProduct.ProdReLevel = productUpdate.ProdReLevel;
                    objectProduct.ProductCategoryID = productUpdate.ProductCategoryID;
                    
                    db.SaveChanges();

                    Price price = db.Prices.Include(x => x.Product).Where(x => x.ProductID == id).ToList().FirstOrDefault();

                   // objectPrice.UPriceR =productUpdate.Prices.
                    objectPrice.UPriceR =  price.UPriceR;
                    objectPrice.CPriceR = price.CPriceR;
                    objectPrice.PriceStartDate = price.PriceStartDate;
                    objectPrice.PriceEndDate = price.PriceEndDate;
                    db.SaveChanges();


                    toReturn.Message = "Update Successfull";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update UnSuccessfull";

            }
            return toReturn;
        }

        //delete product

        [HttpDelete]
        [Route("deleteProduct")]
        public dynamic deleteProduct(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            Product product = new Product();

            try
            {
                product= db.Products.Include(x=>x.Prices).Where(x => x.ProductID == id).FirstOrDefault();

                if (product == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                   
                    Price price = db.Prices.Where(x => x.ProductID == id).FirstOrDefault();
                    db.Prices.Remove(price);
                    db.SaveChanges();

                    product = db.Products.Where(x => x.ProductID == id).FirstOrDefault();
                    db.Products.Remove(product);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";

                }
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

    //stock take
    //get all stock take details
    [HttpGet]
        [Route("GetAllStockTake")]
        public object GetAllStockTake()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Stock_Take.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //add stock take
        [HttpPost]
        [Route("AddStockTake")]
        public object AddStockTake(Stock_Take newStockTake)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Stock_Take.Add(newStockTake);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //get marked-off reasons
        [HttpGet]
        [Route("GetAllMarkedOffReasons")]
        public object GetAllMarkedOffReasons()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Marked_Off_Reason.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //add marked-off product
        [HttpPost]
        [Route("AddMarkedOff")]
        public object AddMarkedOff(Marked_Off newMarkedOff)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Marked_Off.Add(newMarkedOff);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //generate low stock
        [HttpGet]
        [Route("GenerateNotification")]
        public object GenerateNotification()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            //get list of conatiner product and product from db
            List<Container_Product> containerProd = db.Container_Product.Include(x => x.Product).ToList();


            List<dynamic> listOfDetails = new List<dynamic>();
            foreach(var conP in containerProd)
            {
                //get the container product and product details
                Container_Product containerProduct = db.Container_Product.Include(x => x.Product).ToList().FirstOrDefault();

                //get and compare the container product CPQuantity with the product ProdReLevel
                Container_Product conProduct = db.Container_Product.Where(x => x.ProductID == containerProduct.Product.ProductID && x.CPQuantity <= containerProduct.Product.ProdReLevel).FirstOrDefault();

                dynamic prodlist = new ExpandoObject();
                prodlist.ProductName = conP.Product.ProdName;
                prodlist.CPQuantity = conP.CPQuantity;
                prodlist.ProdReLevel = conP.Product.ProdReLevel;

                listOfDetails.Add(prodlist);

            }

            toReturn.Message = "Low Stock Notification" + listOfDetails.ToList();

            return toReturn;
        }

        //get VAT
        [HttpGet]
        [Route("GetVat")]
        public object GetVat()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.VATs.ToList();
            }
            catch (Exception error)
            { 
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Add VAT
        [HttpPost]
        [Route("AddVat")]
        public object AddVat(VAT newVat)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.VATs.Add(newVat);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }


        //Update VAT
        [HttpPut]
        [Route("UpdateVat")]
        public object UpdateVat(VAT vatUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            VAT objectVat = new VAT();
            dynamic toReturn = new ExpandoObject();
            var id = vatUpdate.VATID;

            try
            {
                objectVat = db.VATs.Where(x => x.VATID == id).LastOrDefault();
                if (objectVat != null)
                {
                    objectVat.VATPerc = vatUpdate.VATPerc;
                    objectVat.VATStartDate = vatUpdate.VATStartDate;
                    objectVat.VATEndDate = vatUpdate.VATEndDate;

                    db.SaveChanges();

                    toReturn.Message = "Update Successfull";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update UnSuccessfull";

            }
            return toReturn;
        }


    }
}
