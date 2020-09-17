using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using ORDRA_API.Models;

namespace ORDRA_API.Controllers
{
    [RoutePrefix("Api/Dropdown")]
    public class DropDownController : ApiController
    {
        OrdraDBEntities ccddlEN = new OrdraDBEntities();
        [Route("SupplierData")]
        [HttpGet]
        public List<Supplier> SupplierData()
        {
            ccddlEN.Configuration.ProxyCreationEnabled = false;
            return ccddlEN.Suppliers.ToList<Supplier>();
        }

        OrdraDBEntities ccddlEN2 = new OrdraDBEntities();
        [Route("AreaData")]
        [HttpGet]
        public List<Area> AreaData()
        {
            ccddlEN2.Configuration.ProxyCreationEnabled = false;
            return ccddlEN2.Areas.ToList<Area>();
        }

    }
}
