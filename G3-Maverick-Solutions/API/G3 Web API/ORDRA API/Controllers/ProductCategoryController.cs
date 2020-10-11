using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ORDRA_API.Models;
using System.Data.Entity;
using System.Web.Http.Cors;
using System.Dynamic;

namespace ORDRA_API.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("Api/ProductCategory")]
    public class ProductCategoryController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //get all product category details
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
                toReturn.Message = "Search Interrupted.Retry";
            }

            return toReturn;

        }


        //get product category by ID
        [HttpGet]
        [Route("GetProductCategory/{id}")]

        public object GetProductCategory(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product_Category objectProductCategory = new Product_Category();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProductCategory = db.Product_Category.Find(id);

                if (objectProductCategory == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectProductCategory;
                }

            }
            catch 
            {
                toReturn.Message = "Search Interrupted.Retry";
            }

            return toReturn;
        }

        //insert a new product category
        [HttpPost]
        [Route("AddProductCategory")]
        public object AddProductCategory(Product_Category newProductCategory)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Product_Category.Add(newProductCategory);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //searching product category by the product category name
        [HttpGet]
        [Route("SearchProductCategory")]
        public object SearchProductCategory(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                var productCategory = db.Product_Category.Where((z => (z.PCatName == name))).FirstOrDefault();

                if (productCategory != null)
                {

                    toReturn = productCategory;
                }
                else
                {

                    toReturn.Message = "Record Not Found";

                }
            }

            catch 
            {
                toReturn.Message = "Search Interrupted.Retry";
            }

            return toReturn;
        }

        //update a product category
        [HttpPut]
        [Route("UpdateProductCategory")]
        public object UpdateProductCategory(Product_Category productCategoryUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product_Category objectProductCategory = new Product_Category();
            dynamic toReturn = new ExpandoObject();
            var id = productCategoryUpdate.ProductCategoryID;

            try
            {
                objectProductCategory = db.Product_Category.Where(x => x.ProductCategoryID == id).FirstOrDefault();
                if (objectProductCategory != null)
                {
                    objectProductCategory.PCatName = productCategoryUpdate.PCatName;
                    objectProductCategory.PCatDescription = productCategoryUpdate.PCatDescription;

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

        //delete a product category
        [HttpDelete]
        [Route("DeleteProductCategoryDetails")]
        public object DeleteProductCategoryDetails(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Product_Category objectProductCategory = new Product_Category();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProductCategory = db.Product_Category.Find(id);

                if (objectProductCategory == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    List<Product> products = db.Products.Where(x => x.ProductCategoryID == id).ToList();
                    if(products.Count == 0)
                    {
                        db.Product_Category.Remove(objectProductCategory);
                        db.SaveChanges();
                        toReturn.Message = "Delete Successful";
                    }
                    else
                    {
                        toReturn.Message = "Product Category Delete Restricted";
                    }
                    
                }

            }
            catch
            {
                toReturn.Message = "Delete Unsuccessful";
            }

            return toReturn;
        }
    }
}
