﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using System.Data.Entity;
using System.Web.Http.Cors;
using ORDRA_API.Models;
using System.Security.Cryptography.X509Certificates;

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
            toReturn.Products = new List<Product>();

            try
            {

                List<Product> products = db.Products.Include(x => x.Prices).ToList();
                List<Product> productsList = new List<Product>();
                foreach(var item in products)
                {
                    Product product = new Product();
                    product.ProductID = item.ProductID;
                    product.ProdName = item.ProdName;
                    product.ProdDesciption = item.ProdDesciption;
                    product.ProdBarcode = item.ProdBarcode;
                    product.ProdReLevel = item.ProdReLevel;
                    product.ProductCategoryID = item.ProductCategoryID;
                    productsList.Add(product);
                   
                }

                toReturn.Products = productsList;
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
            toReturn.Products = new List<dynamic>();

            try
            {
                List<Container_Product> conProd = db.Container_Product.Include(x => x.Product).Where(x => x.CPQuantity > 0 && x.ContainerID == containerID).ToList();
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
                            productDetails.Quantity = prod.Product.ProdReLevel;
                            productDetails.Price = Math.Round(Price, 2);
                            productDetails.Subtotal = 0.0;

                            products.Add(productDetails);
                        }
                    }
                    toReturn.products = products;
                }
                else
                {
                    toReturn.Message = "Container Not Found";

                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }


        //Getting product by id
        [HttpGet]
        [Route("moveProduct")]
        public object moveProduct(int fromConID, int productID, int quantity, int toConID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.ContainerTo = new Container_Product();
            toReturn.ContainerFrom = new Container_Product();


            try
            {
                Container fromContainer = db.Containers.Where(x => x.ContainerID == fromConID).FirstOrDefault();
                if (fromContainer == null)
                {
                    toReturn.Error = "Container To Move From Not Found";
                    return toReturn;
                }
                else
                {
                    Product product = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                    if(product == null)
                    {
                        toReturn.Error = "Product Not Found";
                        return toReturn;
                    }
                    else
                    {
                        Container toContainer = db.Containers.Where(x => x.ContainerID == fromConID).FirstOrDefault();
                        if (toContainer == null)
                        {
                            toReturn.Error = "Container To Move To Not Found";
                            return toReturn;
                        }
                    }
                    if(quantity< 1)
                    {
                        toReturn.Error = "Cannot Move product with No quantity";
                        return toReturn;
                    }
                    else
                    {
                        
                        Container_Product conProdFrom = db.Container_Product.Where(x => x.ContainerID == fromContainer.ContainerID && x.ProductID == product.ProductID).FirstOrDefault();
                        if (conProdFrom == null)
                        {
                            toReturn.Error = "Container Not In Product";
                            return toReturn;
                        }
                        else
                        {
                            if(conProdFrom.CPQuantity < quantity)
                            {
                                toReturn.Error = "Not Enough Quantity to Move";
                                return toReturn;
                            }
                            else
                            {
                                var remainingQuantity = (conProdFrom.CPQuantity) - quantity;
                                conProdFrom.CPQuantity = remainingQuantity;
                                db.SaveChanges();


                                toReturn.ContainerFrom = db.Container_Product.Where(x => x.ContainerID == conProdFrom.ContainerID && x.ProductID == conProdFrom.ProductID).FirstOrDefault();



                                Container_Product container_Product = db.Container_Product.Where(x => x.ContainerID == toConID && x.ProductID == productID).FirstOrDefault();
                                Container containerTo = db.Containers.Where(x => x.ContainerID == toConID).FirstOrDefault();
                                if( container_Product == null)
                                {
                                    Container_Product toProdCon = new Container_Product();
                                    // toProdCon.ContainerID = toConID;
                                    // toProdCon.ProductID = productID;
                                    toProdCon.CPQuantity = quantity;
                                    toProdCon.Product = product;
                                    toProdCon.Container =  containerTo;
                                    db.SaveChanges();

                                    toReturn.CoantainerTo = db.Container_Product.Where(x => x.ContainerID == toProdCon.ContainerID && x.ProductID == toProdCon.ProductID).FirstOrDefault(); ;
                                }
                                else
                                {
                                    container_Product.CPQuantity = container_Product.CPQuantity + quantity;
                                    db.SaveChanges();

                                    toReturn.CoantainerTo = db.Container_Product.Where(x => x.ContainerID == container_Product.ContainerID && x.ProductID == container_Product.ProductID).FirstOrDefault();
                                }
                                

                               
                            }
                        }
                        toReturn.Message = "Product " + product.ProdName + " moved to " + fromContainer.ConName;
                    }
                }

                

            }
            catch
            {
                toReturn.Message = "Move Unsuccessful";
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
            toReturn.CurrentPrice = new ExpandoObject();
            toReturn.Product = new ExpandoObject();
            toReturn.PriceList = new List<dynamic>();
            toReturn.ProductCategory = new ExpandoObject();
            toReturn.ProductContainers = new List<dynamic>();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Include(x=> x.Container_Product).Where(x => x.ProductID == id).FirstOrDefault();



                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => (x.PriceStartDate <= DateTime.Now) && (x.PriceEndDate > DateTime.Now) && (x.ProductID == objectProduct.ProductID)).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    if (cat != null)
                    {
                        //Set Product Category Details
                        Product_Category category = new Product_Category();
                        category.ProductCategoryID = cat.ProductCategoryID;
                        category.PCatName = cat.PCatName;
                        category.PCatDescription = cat.PCatDescription;

                        toReturn.ProductCategory = category;
                    }
                    else
                    {
                        toReturn.Message = "Product's Categoty Not Found";
                    }

                    if (price != null)
                    {

                        //Set Product Details
                        Product Product = new Product();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;


                        DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                        DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                        //Set Price Details
                        dynamic Price = new ExpandoObject();
                        Price.PriceID = price.PriceID;
                        Price.UPriceR = (double)price.UPriceR;
                        Price.CPriceR = (double)price.CPriceR;
                        Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                        Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");




                        toReturn.CurrentPrice = Price;
                        toReturn.Product = Product;

                    }
                    else
                    {
                        Product Product = new Product();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;


                        toReturn.Product = Product;

                        toReturn.Message = "No current Price For Product";
                    }
                    //set Price lIST
                    List<Price> priceslist = db.Prices.Include(x => x.Product).Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> list = new List<dynamic>();
                    if (priceslist != null)
                    {


                        foreach (var pri in priceslist)
                        {

                            DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                            DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                            dynamic Price = new ExpandoObject();
                            Price.PriceID = price.PriceID;
                            Price.UPriceR = (double)price.UPriceR;
                            Price.CPriceR = (double)price.CPriceR;
                            Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                            Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                            list.Add(Price);
                        }

                        toReturn.PriceList = list;
                    }

                    List<Container_Product> container_Product = db.Container_Product.Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> ProductCons = new List<dynamic>();
                    if (container_Product != null)
                    {
                        foreach (Container_Product conProd in container_Product)
                        {
                            Container con = db.Containers.Where(x => x.ContainerID == conProd.ContainerID).FirstOrDefault();
                            if (con != null)
                            {

                                dynamic ProdCon = new ExpandoObject();
                                ProdCon.Container = conProd.Container.ConName; 
                                ProdCon.ContainerID = conProd.ContainerID;
                                ProdCon.ProductID = conProd.ProductID;
                                ProdCon.CPQuantity = conProd.CPQuantity;
                                ProductCons.Add(ProdCon);
                            }
                        }

                        toReturn.ProductContainers = ProductCons;

                    }

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
            toReturn.CurrentPrice = new ExpandoObject();
            toReturn.Product = new ExpandoObject();
            toReturn.PriceList = new List<dynamic>();
            toReturn.ProductCategory = new ExpandoObject();
            toReturn.ProductContainers = new List<dynamic>();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Where(x => x.ProdName == prodName).FirstOrDefault();



                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => (x.PriceStartDate <= DateTime.Now) && (x.PriceEndDate > DateTime.Now) && (x.ProductID == objectProduct.ProductID)).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    if (cat != null)
                    {
                        //Set Product Category Details
                        Product_Category category = new Product_Category();
                        category.ProductCategoryID = cat.ProductCategoryID;
                        category.PCatName = cat.PCatName;
                        category.PCatDescription = cat.PCatDescription;

                        toReturn.ProductCategory = category;
                    }
                    else
                    {
                        toReturn.Message = "Product's Categoty Not Found";
                    }

                    if (price != null)
                    {

                        //Set Product Details
                        Product Product = new Product();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;


                        DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                        DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                        //Set Price Details
                        dynamic Price = new ExpandoObject();
                        Price.PriceID = price.PriceID;
                        Price.UPriceR = (double)price.UPriceR;
                        Price.CPriceR = (double)price.CPriceR;
                        Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                        Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");




                        toReturn.CurrentPrice = Price;
                        toReturn.Product = Product;

                    }
                    else
                    {
                        Product Product = new Product();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;


                        toReturn.Product = Product;

                        toReturn.Message = "No current Price For Product";
                    }
                    //set Price lIST
                    List<Price> priceslist = db.Prices.Include(x => x.Product).Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> list = new List<dynamic>();
                    if (priceslist != null)
                    {


                        foreach (var pri in priceslist)
                        {

                            DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                            DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                            dynamic Price = new ExpandoObject();
                            Price.PriceID = price.PriceID;
                            Price.UPriceR = (double)price.UPriceR;
                            Price.CPriceR = (double)price.CPriceR;
                            Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                            Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                            list.Add(Price);
                        }

                        toReturn.PriceList = list;
                    }

                    List<Container_Product> container_Product = db.Container_Product.Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> ProductCons = new List<dynamic>();
                    if (container_Product != null)
                    {
                        foreach (Container_Product conProd in container_Product)
                        {
                            Container con = db.Containers.Where(x => x.ContainerID == conProd.ContainerID).FirstOrDefault();
                            if (con != null)
                            {

                                dynamic ProdCon = new ExpandoObject();
                                ProdCon.Container = conProd.Container.ConName;
                                ProdCon.ContainerID = conProd.ContainerID;
                                ProdCon.ProductID = conProd.ProductID;
                                ProdCon.CPQuantity = conProd.CPQuantity;
                                ProductCons.Add(ProdCon);
                            }
                        }

                        toReturn.ProductContainers = ProductCons;

                    }
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
            toReturn.CurrentPrice = new ExpandoObject();
            toReturn.Product = new ExpandoObject();
            toReturn.PriceList = new List<dynamic>();
            toReturn.ProductCategory = new ExpandoObject();
            toReturn.ProductContainers = new List<dynamic>();

            try
            {
                objectProduct = db.Products.Include(x => x.Product_Category).Where(x => x.ProdBarcode == prodBarcode).FirstOrDefault();



                if (objectProduct != null)
                {
                    Price price = db.Prices.Include(x => x.Product).Where(x => (x.PriceStartDate <= DateTime.Now) && (x.PriceEndDate > DateTime.Now) && (x.ProductID == objectProduct.ProductID)).FirstOrDefault();
                    Product_Category cat = db.Product_Category.Where(x => x.ProductCategoryID == objectProduct.ProductCategoryID).FirstOrDefault();

                    if (cat != null) 
                    {
                        //Set Product Category Details
                        Product_Category category = new Product_Category();
                        category.ProductCategoryID = cat.ProductCategoryID;
                        category.PCatName = cat.PCatName;
                        category.PCatDescription = cat.PCatDescription;

                        toReturn.ProductCategory = category;
                    }
                    else
                    {
                        toReturn.Message = "Product's Categoty Not Found";
                    }

                    if (price != null)
                    {
                       
                        //Set Product Details
                        dynamic Product = new ExpandoObject();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;
                        


                        DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                        DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                        //Set Price Details
                        dynamic Price = new ExpandoObject();
                        Price.PriceID = price.PriceID;
                        Price.UPriceR = (double)price.UPriceR;
                        Price.CPriceR = (double)price.CPriceR;
                        Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                        Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                
                        
          
                        toReturn.CurrentPrice = Price;
                        toReturn.Product = Product;

                    }
                    else
                    {
                        Product Product = new Product();
                        Product.ProductID = objectProduct.ProductID;
                        Product.ProductCategoryID = objectProduct.ProductCategoryID;
                        Product.ProdBarcode = objectProduct.ProdBarcode;
                        Product.ProdName = objectProduct.ProdName;
                        Product.ProdDesciption = objectProduct.ProdDesciption;
                        Product.ProdReLevel = objectProduct.ProdReLevel;


                        toReturn.Product = Product; 
                       
                        toReturn.Message = "No current Price For Product";
                    }

                    //set Price lIST
                    List<Price> priceslist = db.Prices.Include(x => x.Product).Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> list = new List<dynamic>();
                    if (priceslist != null)
                    {


                        foreach (var pri in priceslist)
                        {

                            DateTime startdate = Convert.ToDateTime(price.PriceStartDate);
                            DateTime enddate = Convert.ToDateTime(price.PriceEndDate);

                            dynamic Price = new ExpandoObject();
                            Price.PriceID = price.PriceID;
                            Price.UPriceR = (double)price.UPriceR;
                            Price.CPriceR = (double)price.CPriceR;
                            Price.PriceStartDate = startdate.ToString("yyyy-MM-dd");
                            Price.PriceEndDate = enddate.ToString("yyyy-MM-dd");

                            list.Add(Price);
                        }

                        toReturn.PriceList = list;
                    }

                    List<Container_Product> container_Product = db.Container_Product.Where(x => x.ProductID == objectProduct.ProductID).ToList();
                    List<dynamic> ProductCons = new List<dynamic>();
                    if ( container_Product != null)
                    {
                        foreach (Container_Product conProd in container_Product)
                        {
                            Container con = db.Containers.Where(x => x.ContainerID == conProd.ContainerID).FirstOrDefault();
                            if (con != null)
                            {

                                dynamic ProdCon = new ExpandoObject();
                                ProdCon.Container = conProd.Container.ConName;
                                ProdCon.ContainerID = conProd.ContainerID;
                                ProdCon.ProductID = conProd.ProductID;
                                ProdCon.CPQuantity = conProd.CPQuantity;
                                ProductCons.Add(ProdCon);
                            }
                        }

                        toReturn.ProductContainers = ProductCons;

                    }

                    Supplier supplier = db.Suppliers.Where(x => x.SupplierID == objectProduct.SupplierID).FirstOrDefault();
                    toReturn.supplier = supplier;
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
        [HttpGet]
        [Route("getProductByCategory")]

        public object getProductByCategory(int categoryID)
        {
            db.Configuration.ProxyCreationEnabled = false;

            dynamic toReturn = new ExpandoObject();
            toReturn.Products = new ExpandoObject();

            try
            {
                List<Product> objectProducts = db.Products.Where(x => x.ProductCategoryID == categoryID).ToList();

             

                
                if (objectProducts != null)
                {
                   
                    List<dynamic> productsList = new List<dynamic>();
                    foreach (var item in objectProducts)
                    {   dynamic product = new ExpandoObject();
                        product.ProductID = item.ProductID;
                        product.ProdName = item.ProdName;
                        product.CPQuantity = 0;
                        product.ProdReLevel = item.ProdReLevel;
                        product.ProductCategoryID = item.ProductCategoryID;
                        productsList.Add(product);

                    }

                    toReturn.Products = productsList;
                }
                else
                {
                    toReturn.Message = "No Products Found In Category";
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
                if (cat != null)
                {


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
                else
                {
                    toReturn.Message = "Add Product UnSuccsessful: Select A Category";
                }
           
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
        public object addProductToContainer(int containerID, int productID, int quantity)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


           try
            {

                Product prod = db.Products.Where(x => x.ProductID == productID).FirstOrDefault();
                Container con = db.Containers.Where(x => x.ContainerID == containerID).FirstOrDefault();

            if ( con == null){
                return toReturn.Message = "Container Not Found";

            }
            if (prod == null)
            {
                return toReturn.Message = "Product Not Found";

            }
            else
            {
                Container_Product conProd = new Container_Product();
                conProd.ContainerID = con.ContainerID;
                conProd.ProductID = prod.ProductID;
                conProd.CPQuantity = quantity;
                conProd.Product = prod;
                conProd.Container = con;

                Container_Product found = db.Container_Product.Where(x => x.ContainerID == conProd.ContainerID && x.ProductID == conProd.ProductID).FirstOrDefault();

                if (found == null)
                {
                    db.Container_Product.Add(conProd);
                    db.SaveChanges();

                    toReturn.Message = "Product Added To Container";
                }
                else
                {
                    toReturn.Message= " Product Already Linked To Container";
                    
                }

            }


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
                Product product = db.Products.Where(x => x.ProductID == newPrice.ProductID).FirstOrDefault();
                if (product != null)
                {
                    DateTime date = DateTime.Now.AddYears(1);
                    //save price for product;
                    Price addPrice = new Price();
                    //addPrice.ProductID = product.ProductID;
                    addPrice.Product = product;
                    addPrice.CPriceR = (float)newPrice.CPriceR;
                    addPrice.UPriceR = (float)newPrice.UPriceR;
                    addPrice.PriceStartDate = newPrice.PriceStartDate;
                    addPrice.PriceEndDate = date;
                    db.Prices.Add(addPrice);
                    db.SaveChanges();

                    toReturn.Message = "Price Added To Product Successfuly";
                }
              
            }
            catch
            {
                toReturn.Error = "Price Add Unsuccessfuly";

            }
            return toReturn;
        }

        [HttpGet]
        [Route("updatePriceRequest")]
        public object updatePriceRequest(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            
            
            try
            {
                Price price = db.Prices.Where(x => x.PriceID == id).FirstOrDefault();
                if(price == null)
                {
                    toReturn.Message = "Price Not Found";
                    return toReturn;
                }
                else
                {

                    Product product = db.Products.Where(x => x.ProductID == price.ProductID).FirstOrDefault();
                    if (product == null)
                    {
                         toReturn.Message = "Prices's Product Not Found";
                        return toReturn;
                    }
                    else
                    {
                       List<Customer_Order> orders = db.Customer_Order.Where(x => x.CusOrdDate > price.PriceStartDate && x.CusOrdDate < DateTime.Now).ToList();
                        if(orders != null)
                        {
                            foreach (Customer_Order order in orders) 
                            {
                                Product_Order_Line product_Order_Line = db.Product_Order_Line.Where(x => x.CustomerOrderID == order.CustomerOrderID).FirstOrDefault();
                                if(product_Order_Line != null)
                                {
                                    if(product.ProductID == product_Order_Line.ProductID)
                                    {
                                        toReturn.Message = "Price Update Restricted";
                                        return toReturn;
                                    }
                                }

                            }
                        }


                        List<Sale> sales = db.Sales.Where(x => x.SaleDate > price.PriceStartDate && x.SaleDate < DateTime.Now).ToList();
                        if(sales != null)
                        {
                            foreach( Sale sale in sales)
                            {
                                Product_Sale product_Sale = db.Product_Sale.Where(x => x.SaleID == sale.SaleID).FirstOrDefault();
                                if( product_Sale != null)
                                {
                                    if(product.ProductID == product_Sale.ProductID)
                                    {
                                        toReturn.Message = "Price Update Restricted";
                                        return toReturn;
                                    }
                                    
                                }
                            }

                        }
                        

                    }
                }


            }
            catch
            {
                toReturn.Message = "Price Update Restricted";

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


        //check product delete
        [HttpPost]
        [Route("checkProductDelete")]
        public bool checkProductDelete(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            bool found = false;

            try
            {
                Container_Product conProd = db.Container_Product.Where(x => x.ProductID == id).FirstOrDefault();
                if (conProd != null)
                {
                    found = true;
                     return found;
                }
                else
                {
                    Product_Sale product_Sale = db.Product_Sale.Where(x => x.ProductID == id).FirstOrDefault();
                    if (product_Sale != null)
                    {
                        found = true;
                        return found;
                    }
                    else
                    {
                        Supplier_Order_Product supplier_Order_Product = db.Supplier_Order_Product.Where(x => x.ProductID == id).FirstOrDefault();
                        if (supplier_Order_Product != null)
                        {
                            found = true;
                            return found;
                        }
                        else
                        {
                            Donated_Product donated_Product = db.Donated_Product.Where(x => x.ProductID == id).FirstOrDefault();
                            if (donated_Product != null)
                            {
                                found = true;
                                return found;
                            }
                            else
                            {
                                return found;
                            }
                            


                        }

                    }

                }




            }
            catch
            {
                //toReturn.Error = "Delete Request Error";

            }
            return found;
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
                product = db.Products.Where(x => x.ProductID == id).FirstOrDefault();

                if (product == null)
                {
                    toReturn.Message = "Product Not Found";
                }
                else
                {
                    bool found = checkProductDelete(id);
                    if (found != true)
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
                    else
                    {
                        toReturn.Message = "Product Delete Restricted";
                    }
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
                if (conProd != null)
                {
                    db.Container_Product.Remove(conProd);
                    db.SaveChanges();
                    toReturn.Message = "Product Removed From Container";
                }
                else
                {
                    toReturn.Message = "Product Not Found In Container";
                }

               



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
            toReturn.VAT = new List<dynamic>();

            try
            {
                List<VAT> vats = db.VATs.ToList();
                List<dynamic> vatList = new List<dynamic>();
                foreach(var item in vats)
                {
                    dynamic vat = new ExpandoObject();
                    DateTime startdate = Convert.ToDateTime(item.VATStartDate);
                    vat.VATID = item.VATID;
                    vat.VATPerc = item.VATPerc;
                    vat.VATStartDate = startdate.ToString("yyyy-MM-dd");
                    vat.VATEndDate = item.VATEndDate;

                    vatList.Add(vat);

                }

                toReturn.VAT = vatList;
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
               DateTime date = DateTime.Now.AddYears(1);
                newVat.VATEndDate = date;
                db.VATs.Add(newVat);
                db.SaveChanges();
                toReturn.Message = "VAT Added Succsessfully";
            }
            catch (Exception)
            {
                toReturn.Error = "VAT Add UnSuccsessful";


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
      

            try
            {
                objectVat = db.VATs.Where(x => x.VATID == vatUpdate.VATID).FirstOrDefault();
                if (objectVat != null)
                {
                    DateTime date = DateTime.Now.AddYears(1);
                    objectVat.VATEndDate = date;
                    objectVat.VATPerc = vatUpdate.VATPerc;
                    objectVat.VATStartDate = vatUpdate.VATStartDate;

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
                toReturn.Error = "VAT Update UnSuccessfull";

            }
            return toReturn;
        }


        [HttpGet]
        [Route("getLowStock")]
        public object getLowStock( int containerID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.Products = new List<dynamic>();

            try
            {
                List<Container_Product> conProd = db.Container_Product.Include(x => x.Product).Where(x=> x.ContainerID == containerID).ToList();
                if (conProd != null)
                {
                    //Get List Of products with current price
                    List<Product> productsList = db.Products.ToList();
                    List<dynamic> products = new List<dynamic>();
                    foreach (var prod in conProd)
                    {
                        if (prod.CPQuantity <= prod.Product.ProdReLevel)
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
                                productDetails.Quantity = prod.Product.ProdReLevel;
                                productDetails.Price = Math.Round(Price, 2);
                                productDetails.Subtotal = 0.0;

                                products.Add(productDetails);
                            }
                        }
                        toReturn.products = products;
                    }
                }
                else
                {
                    toReturn.Message = "Container Not Found";

                }

            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;
        }
    }
}
