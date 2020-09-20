using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.IO;
using System.Web.Hosting;
using System.Net.Http.Headers;
using System.Data;
using System.Dynamic;
using System.Data.Entity;
using ORDRA_API.Models;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("Api/Login")]
    public class LoginController : ApiController
    {
        OrdraDBEntities db = new OrdraDBEntities();
            
        
    }
}

