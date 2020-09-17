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
    }
}
