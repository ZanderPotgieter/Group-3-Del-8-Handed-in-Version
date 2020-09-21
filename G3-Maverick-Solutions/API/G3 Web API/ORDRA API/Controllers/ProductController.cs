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
        [Route("getAllProductsForAllContainers")]
        public object getAllProductsForAllContainers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Products.Include(x => x.Prices).ToList();
            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }

        //Getting all products
        [HttpGet]
        [Route("getAllProductsForSpecificContainer/{containerID}")]
        public object getAllProductsForSpecificContainer(int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                List<Container_Product> conProducts = db.Container_Product.Where(x => x.Container.ContainerID == containerID).ToList();
                List<dynamic> productWithQuantity = new List<dynamic>();
                if (conProducts != null)
                {
                    foreach (Container_Product Cprod in conProducts)
                    {
                        dynamic prod = new ExpandoObject();

                        Product p = db.Products.Where(x => x.ProductID == Cprod.ProductID).FirstOrDefault();
                        if (p != null)
                        {
                            prod.Product = p;
                            prod.CPQuantity = Cprod.CPQuantity;

                            productWithQuantity.Add(prod);
                        }
                        else
                        {
                            toReturn.Message = "No Products In Container";
                        }

                    }
                }
                else
                {
                    toReturn.Message = "Container Not Found";

                }

                toReturn = productWithQuantity;
            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }





        //Getting product by id
        [HttpGet]
        [Route("getProductByID/{id}")]

        public object getProductByID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product objectProduct = new Product();
            Price objectPrice = new Price();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Include(x=> x.Container_Product).Where(x => x.ProductID == id).FirstOrDefault();
               
                

                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == id).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                    DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                    dynamic objectProdandPrice = new ExpandoObject();
                    objectProdandPrice.ProductID = objectProduct.ProductID;
                    objectProdandPrice.ProductCategoryID = objectProduct.ProductCategoryID;
                    objectProdandPrice.ProductCategoty = cat.PCatDescription;
                    objectProdandPrice.ProdBarcode = objectProduct.ProdBarcode;
                    objectProdandPrice.ProdName = objectProduct.ProdName;
                    objectProdandPrice.ProdDescription = objectProduct.ProdDesciption;
                    objectProdandPrice.ProdReLevel = objectProduct.ProdReLevel;
                    objectProdandPrice.PriceID = price.PriceID;
                    objectProdandPrice.UPriceR = (double)price.UPriceR;
                    objectProdandPrice.CPriceR = (double)price.CPriceR;
                    objectProdandPrice.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                    objectProdandPrice.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                    toReturn.ProdandPrice = objectProdandPrice;
                    toReturn.Product = objectProduct;
                    toReturn.CurrentPrice = price;
                    toReturn.PriceList = db.Prices.Where(x => x.ProductID == objectProduct.ProductID);

                }
                else
                {

                    toReturn.Message = "Prodcut Not Found";
                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }


        //Getting product by Product Name
        [HttpPost]
        [Route("getProductByName")]

        public object getProductByName(string prodName)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product objectProduct = new Product();
            Price objectPrice = new Price();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Where(x => x.ProdName == prodName).FirstOrDefault();



                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == objectProduct.ProductID).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                    DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                    dynamic objectProdandPrice = new ExpandoObject();
                    objectProdandPrice.ProductID = objectProduct.ProductID;
                    objectProdandPrice.ProductCategoryID = objectProduct.ProductCategoryID;
                    objectProdandPrice.ProductCategoty = cat.PCatDescription;
                    objectProdandPrice.ProdBarcode = objectProduct.ProdBarcode;
                    objectProdandPrice.ProdName = objectProduct.ProdName;
                    objectProdandPrice.ProdDescription = objectProduct.ProdDesciption;
                    objectProdandPrice.ProdReLevel = objectProduct.ProdReLevel;
                    objectProdandPrice.PriceID = price.PriceID;
                    objectProdandPrice.UPriceR = (double)price.UPriceR;
                    objectProdandPrice.CPriceR = (double)price.CPriceR;
                    objectProdandPrice.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                    objectProdandPrice.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                    toReturn.ProdandPrice = objectProdandPrice;
                    toReturn.Product = objectProduct;
                    toReturn.CurrentPrice = price;
                    toReturn.PriceList = db.Prices.Where(x => x.ProductID == objectProduct.ProductID);

                }
                else
                {

                    toReturn.Message = "Prodcut Not Found";
                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;
        }

        //Getting product by Product Name
        [HttpPost]
        [Route("getProductByBarcode")]

        public object getProductByBarcode(string prodBarcode)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product objectProduct = new Product();
            Price objectPrice = new Price();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Where(x => x.ProdBarcode == prodBarcode).FirstOrDefault();



                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == objectProduct.ProductID).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                    DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                    dynamic objectProdandPrice = new ExpandoObject();
                    objectProdandPrice.ProductID = objectProduct.ProductID;
                    objectProdandPrice.ProductCategoryID = objectProduct.ProductCategoryID;
                    objectProdandPrice.ProductCategoty = cat.PCatDescription;
                    objectProdandPrice.ProdBarcode = objectProduct.ProdBarcode;
                    objectProdandPrice.ProdName = objectProduct.ProdName;
                    objectProdandPrice.ProdDescription = objectProduct.ProdDesciption;
                    objectProdandPrice.ProdReLevel = objectProduct.ProdReLevel;
                    objectProdandPrice.PriceID = price.PriceID;
                    objectProdandPrice.UPriceR = (double)price.UPriceR;
                    objectProdandPrice.CPriceR = (double)price.CPriceR;
                    objectProdandPrice.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                    objectProdandPrice.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                    toReturn.ProdandPrice = objectProdandPrice;
                    toReturn.Product = objectProduct;
                    toReturn.CurrentPrice = price;
                    toReturn.PriceList = db.Prices.Where(x => x.ProductID == objectProduct.ProductID);

                }
                else
                {

                    toReturn.Message = "Prodcut Not Found";
                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;
        }

        //Getting product by Product Category
        [HttpPost]
        [Route("getProductByCategory")]

        public object getProductByCategory(string prodCategory)
        {
            db.Configuration.ProxyCreationEnabled = false;

            List<Product> objectProducts = new List<Product>();
            Price objectPrice = new Price();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProducts = db.Products.Include(x => x.Product_Category).Where(x => x.Product_Category.PCatName == prodCategory).ToList();


                List<dynamic> prodList = new List<dynamic>();
                if (objectProducts != null)
                {
                    foreach (Product objectProduct in objectProducts)
                    {
                        Price price = db.Prices.Include(x => x.Product).Where(x => x.PriceStartDate <= DateTime.Now && x.PriceEndDate >= DateTime.Now && x.ProductID == objectProduct.ProductID).FirstOrDefault();
                        Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                        DateTime startdate =Convert.ToDateTime(price.PriceStartDate);
                        DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                        dynamic objectProdandPrice = new ExpandoObject();
                        objectProdandPrice.ProductID = objectProduct.ProductID;  
                        objectProdandPrice.ProductCategoryID = objectProduct.ProductCategoryID;
                        objectProdandPrice.ProductCategoty = cat.PCatDescription;
                        objectProdandPrice.ProdBarcode = objectProduct.ProdBarcode;
                        objectProdandPrice.ProdName = objectProduct.ProdName;
                        objectProdandPrice.ProdDescription = objectProduct.ProdDesciption;
                        objectProdandPrice.ProdReLevel = objectProduct.ProdReLevel;
                        objectProdandPrice.PriceID = price.PriceID;
                        objectProdandPrice.UPriceR = (double)price.UPriceR;
                        objectProdandPrice.CPriceR = (double)price.CPriceR;
                        objectProdandPrice.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                        objectProdandPrice.PriceEndDate = enddate.ToString("yyyy-MM-dd");
                        prodList.Add(objectProdandPrice);

                        
                    }
                    toReturn.ProdandPriceList = prodList ;

                }
                else
                {

                    toReturn.Message = "Prodcut Not Found";
                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
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
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }

        //add product
        [HttpPut]
        [Route("AddProduct")]
        public object AddProduct(Price newProduct)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {
                //get category for product
                Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == newProduct.Product.ProductCategoryID).FirstOrDefault();

                //save new product
                Product addProd = new Product();
                addProd.ProdName = newProduct.Product.ProdName;
                addProd.ProdBarcode = newProduct.Product.ProdBarcode;

                addProd.ProdDesciption = newProduct.Product.ProdDesciption;
                addProd.ProdReLevel = newProduct.Product.ProdReLevel;
                addProd.Product_Category = cat;
                db.Products.Add(addProd);
                db.SaveChanges();

                //get details of saved product;
                Product addedprod = db.Products.ToList().LastOrDefault();
                DateTime date = DateTime.Now.AddYears(1);

                //save price for product;
                Price addPrice = new Price();
                addPrice.Product = addedprod;
                addPrice.CPriceR = (float)newProduct.CPriceR;
                addPrice.UPriceR = (float)newProduct.UPriceR;
                addPrice.PriceStartDate = newProduct.PriceStartDate;
                addPrice.PriceEndDate = date;
                db.Prices.Add(addPrice);
                db.SaveChanges();
               
                 toReturn.Message = "Add Product Succsessful";
           
            }
            catch(Exception)
            {
                toReturn.Message = "Add Product UnSuccsessful";

            }
            return toReturn;
        }

        //add product to container
        [HttpPut]
        [Route("addProductToContainer")]
        public object addProductToContainer(int containerID, int productID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {

                Product prod = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                Container con = db.Containers.Where(x => x.ContainerID == containerID).FirstOrDefault();

                Container_Product conProd = new Container_Product();
                conProd.Product = prod;
                conProd.Container = con;
                db.Container_Product.Add(conProd);
                db.SaveChanges();

                toReturn.Message = "Product Successfully Added To Container";



            }
            catch (Exception)
            {
                toReturn.Message = "Adding Product To Container UnSuccsessful";

            }
            return toReturn;
        }

        //ADD PRICE
        [HttpPut]
        [Route("addPrice")]
        public object addPrice(Price newPrice)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                DateTime date = DateTime.Now.AddYears(1);
                //save price for product;
                Price addPrice = new Price();
                addPrice.ProductID = newPrice.ProductID;
                addPrice.CPriceR = (float)newPrice.CPriceR;
                addPrice.UPriceR = (float)newPrice.UPriceR;
                addPrice.PriceStartDate = newPrice.PriceStartDate;
                addPrice.PriceEndDate = date;
                db.Prices.Add(addPrice);
                db.SaveChanges();

                toReturn.Message = "Price Added To Product Successfuly";
            }
            catch (Exception)
            {
                toReturn.Message = "Price Add Unsuccessfuly";

            }
            return toReturn;
        }


            //UPDATE product
            [HttpPost]
        [Route("updateProduct")]
        public object updateProduct(Product updateProduct)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {
                //get category for product
                Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == updateProduct.ProductCategoryID).FirstOrDefault();

                //save new product
                Product addProd = db.Products.Where(x => x.ProductID == updateProduct.ProductID).FirstOrDefault();
                if (addProd != null)
                {
                    addProd.ProdName = updateProduct.ProdName;
                    addProd.ProdDesciption = updateProduct.ProdDesciption;
                    addProd.ProdReLevel = updateProduct.ProdReLevel;
                    addProd.Product_Category = cat;
                    db.SaveChanges();

                    toReturn.Message = "Product Update Succsessful";
                }
                else
                {
                    toReturn.Message = "Product Not Found";
                }

            }
            catch (Exception)
            {
                toReturn.Message = "Product Update UnSuccsessful";

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
                    toReturn.Message = "Product Not Found";
                }
                else
                {
                    //delete all product prices
                   
                    List<Price> prices = db.Prices.Where(x => x.ProductID == id).ToList();
                    foreach (Price price in prices)
                    {
                        db.Prices.Remove(price);
                        db.SaveChanges();
                    }

                    //remove product from all containers
                    List<Container_Product> conProducts = db.Container_Product.Where(x => x.ProductID == id).ToList();
             

                    foreach (Container_Product Cprod in conProducts)
                    {
                        db.Container_Product.Remove(Cprod);
                        db.SaveChanges();

                    }


                    //delete product
                    product = db.Products.Where(x => x.ProductID == id).FirstOrDefault();
                    db.Products.Remove(product);
                    db.SaveChanges();

                    toReturn.Message = "Product Deleted Successfully";

                }
            }
            catch
            {
                toReturn = "Product Delete Unsuccessful";
            }

            return toReturn;
        }


        //remove product from container
        [HttpPost]
        [Route("removeProductFromContainer")]
        public object removeProductFromContainer(int containerID, int productID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {



                Container_Product conProd = db.Container_Product.Where(x => x.ContainerID == containerID && x.ProductID == productID).FirstOrDefault();
                db.Container_Product.Remove(conProd);
                db.SaveChanges();

                toReturn.Message = "Product Successfully Removed From Container";



            }
            catch (Exception)
            {
                toReturn.Message = "Removing Product From Container UnSuccsessful";

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
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
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
            catch 
            {
                toReturn.Message = "Search interrupted. Retry";
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

            toReturn = "Low Stock Notification" + listOfDetails.ToList();

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
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
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
                toReturn.Message = "VAT Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "VAT Add UnSuccsessful";


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

                    toReturn.Message = "VAT Update Successfull";
                }
                else
                {
                    toReturn.Message = "VAT Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "VAT Update UnSuccessfull";

            }
            return toReturn;
        }


    }
}
