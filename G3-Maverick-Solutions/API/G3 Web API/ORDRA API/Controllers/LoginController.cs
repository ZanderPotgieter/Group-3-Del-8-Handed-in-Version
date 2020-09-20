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

namespace ORDRA_API.Controllers
{


    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("Api/Login")]

    public class LoginController : ApiController
    {

        OrdraDBEntities db = new OrdraDBEntities();


        [Route("registerUser")]
        [HttpPost]
        public object registerUser(User user)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {

                User newUser = new User();


                var hash = GenerateHash(ApplySalt(user.UserPassword));

                User foundUser = db.Users.Where(x => x.UserEmail == user.UserEmail).FirstOrDefault();


                if (foundUser == null)
                {

                    newUser.UserName = user.UserName;
                    newUser.UserSurname = user.UserSurname;
                    newUser.UserPassword = hash;
                    newUser.UserCell = user.UserCell;
                    newUser.UserEmail = user.UserEmail;
                    Guid guid = Guid.NewGuid();
                    newUser.SessionID = guid.ToString();
                    newUser.UserTypeID = 2;

                    toReturn.Message = "Registration Successful";


                    db.Users.Add(newUser);
                    db.SaveChanges();

                }
                else if (foundUser != null)
                {
                    toReturn.Error = "Email already Registered";
                    return toReturn;
                }

                


            }
            catch
            {
                toReturn.Error = "Registration Unsuccesful";
            }

            return toReturn;
        }

        [Route("loginUser")]
        [HttpPost]

        public object loginUser(User userInput)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {

                var hash = GenerateHash(ApplySalt(userInput.UserPassword));
                User user = db.Users.Where(x => x.UserName == userInput.UserName && x.UserPassword == hash).FirstOrDefault();

                if (user != null)
                {
                    Guid guid = Guid.NewGuid();
                    user.SessionID = guid.ToString();

                    db.Entry(user).State = EntityState.Modified; // Checks if anything from the user here is diffent from the user in the db

                    db.SaveChanges();
                    toReturn.sessionID = guid.ToString();


                }
                else
                {
                    toReturn.Error = "Incorrect Username or Password";

                }


            }
            catch
            {
                toReturn.Error = "Login Unsuccesful";

            }

            return toReturn;
        }


        [Route("getUserDetails")]
        [HttpPost]

        public object getUserDetails(dynamic session)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                string sessionID = session.token;
                var user = db.Users.Where(x => x.SessionID == sessionID).FirstOrDefault();
                if (user != null)
                {
                    user.UserPassword = "This is classified information ;)";
                    toReturn = user;

                }
                else
                {
                    toReturn.Error = "Invalid User Token";

                }
            }
            catch
            {
                toReturn.Error = "User Not Found";
            }
            return toReturn;

        }

        public object getAllContainers()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                List<Container> containers = db.Containers.ToList();
                toReturn = containers;

            }
            catch
            {
                toReturn = "Containers Not Loaded, Please Reload page";

            }
            return toReturn;
        }




        //--------------------Hashing Password-------------------------//


        //Add salt to password (long sting hard to guess)
        public static string ApplySalt(string saltInput)
        {
            return saltInput + "HSINLOFJGKFJHLOOMR";
        }

        //Transform to bytes
        public static string GenerateHash(string hashInput)
        {
            SHA256 sha256 = SHA256Managed.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(hashInput);
            byte[] hash = sha256.ComputeHash(bytes);
            return GetStringFromHash(hash);
        }


        //builds bytes into the has string 
        private static string GetStringFromHash(byte[] hash)
        {
            StringBuilder resultString = new StringBuilder();
            for (int i = 0; i < hash.Length; i++)
            {
                resultString.Append(hash[i].ToString("X2"));
            }

            return resultString.ToString();

        }
    }
}
