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
using System.Globalization;

namespace ORDRA_API.Controllers
{

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("Api/Admin")]
    public class AdminController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();


        //---Users-----//
        [HttpPost]
        [Route("getUserAccess")]
        public object getUserAccess(dynamic session)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.userAccess = new List<dynamic>();
            toReturn.user = new ExpandoObject();

            try
            {
                string sessionID = session.token;
                var user = db.Users.Include(x => x.User_Type).Where(x => x.SessionID == sessionID).FirstOrDefault();
                if (user != null)
                {
                    user.UserPassword = "This is classified information ;)";
                    toReturn.user = user;
                }
                else
                {
                    toReturn.Error = "Invalid User Token";
                }

                List<string> access = new List<string>();
                List<User_Type_Access> userAccess = db.User_Type_Access.Include(x => x.Access).Where(x => x.UserTypeID == user.UserTypeID).ToList();

                foreach (User_Type_Access acc in userAccess)
                {

                    string name = acc.Access.AccessDescription;
                    access.Add(name);

                }

                toReturn.userAccess = access;



            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getAccessForUserType/{id}")]
        public object getAccessForUserType(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

           try
            {
                //getting user type access
                List<dynamic> access = new List<dynamic>();
                List<User_Type_Access> userAccess = db.User_Type_Access.Include(x => x.Access).Where(x => x.UserTypeID == id).ToList();

                foreach (User_Type_Access acc in userAccess)
                {
                    dynamic item = new ExpandoObject();
                    item.id = acc.Access.AccessID;
                    item.description = acc.Access.AccessDescription;
                    access.Add(item);

                }

                toReturn.userAccess = access;


                //getting list of all access
                List<dynamic> all_access = new List<dynamic>();
                List<Access> all_userAccess = db.Accesses.ToList();

                foreach (Access acc in all_userAccess)
                {
                    dynamic item = new ExpandoObject();
                    item.id = acc.AccessID;
                    item.description = acc.AccessDescription;
                    all_access.Add(item);

                }

                toReturn.AllAccess = all_access;


           }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }
            return toReturn;
        }

        [HttpGet]
        [Route("addUserTypeAccess")]
        public object addUserTypeAccess(int accessid, int usertypeid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                if(accessid == 0)
                {
                    return toReturn.Message = "Add Unsuccesful: Access Not Selected";
                }
                if (usertypeid == 0)
                {
                    return toReturn.Message = "Add Unsuccesful: User Type Not Selected";
                }
                Access access = db.Accesses.Where(x => x.AccessID == accessid).FirstOrDefault();
                User_Type user_Type = db.User_Type.Where(x => x.UserTypeID == usertypeid).FirstOrDefault();
                if (access != null && user_Type != null)
                {
                    User_Type_Access newaccess = new User_Type_Access();
                    newaccess.UserTypeID = user_Type.UserTypeID;
                    newaccess.AccessID = access.AccessID;
                    newaccess.AccessGranted = DateTime.Now;
                    newaccess.Access = access;
                    newaccess.User_Type = user_Type;

                    User_Type_Access found = db.User_Type_Access.Where(x => x.AccessID == newaccess.AccessID && x.UserTypeID == newaccess.AccessID).FirstOrDefault();
                    if (found == null)
                    {
                        db.User_Type_Access.Add(newaccess);
                        db.SaveChanges();
                        toReturn.Message = "User Type Access Added";
                    }
                    else
                    {
                        toReturn.Message = "User Type Access Is Already Set";
                    }
                    

                }



            }
            catch
            {
                toReturn.Error = "Adding Access Unsuccesful ";
            }

            return toReturn;
        }

        [HttpGet]
        [Route("removeUserTypeAccess")]
        public object removeUserTypeAccess(int accessid, int usertypeid)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                if (accessid == 0)
                {
                    return toReturn.Message = "Remove Unsuccesful: Access Not Selected";
                }
                if (usertypeid == 0)
                {
                    return toReturn.Message = "Remove Unsuccesful: User Type Not Selected";
                }
                

                    User_Type_Access found = db.User_Type_Access.Where(x => x.AccessID == accessid && x.UserTypeID == usertypeid).FirstOrDefault();
                    if (found != null)
                    {
                        db.User_Type_Access.Remove(found);
                        db.SaveChanges();
                        toReturn.Message = "User Type Access Removed";
                    }
                    else
                    {
                        toReturn.Error = "Cannot Remove Access Not Set";
                    }


            }
            catch
            {
                toReturn.Error = "Adding Access Unsuccesful ";
            }

            return toReturn;
        }

        [HttpPost]
        [Route("setUserTypeAccess")]
        public object setUserTypeAccess(List<User_Type_Access> user_type_access)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {


               foreach(User_Type_Access Uaccess in user_type_access)
                {
                    Access access = db.Accesses.Where(x => x.AccessID == Uaccess.AccessID).FirstOrDefault();
                    User_Type user_Type = db.User_Type.Where(x => x.UserTypeID == Uaccess.UserTypeID).FirstOrDefault();
                    if( access != null && user_Type != null)
                    {
                        User_Type_Access newaccess = new User_Type_Access();
                        newaccess.UserTypeID = user_Type.UserTypeID;
                        newaccess.AccessID = access.AccessID;
                        newaccess.AccessGranted = DateTime.Now;
                        newaccess.Access = access;
                        newaccess.User_Type = user_Type;

                    User_Type_Access found = db.User_Type_Access.Where(x => x.AccessID == newaccess.AccessID && x.UserTypeID == newaccess.AccessID).FirstOrDefault();
                    if (found == null)
                    {
                        db.User_Type_Access.Add(newaccess);
                        db.SaveChanges();
                    }

                    }
                }

            toReturn.Message = "User Type Access Updated";
                
            }
            catch
           {
                toReturn.Error = "Updating UserType Access Failed";
            }

            return toReturn;
        }




        [HttpGet]
        [Route("getUserTypeAccess")]
        public object getUserTypeAccess()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            List<Tuple<string, List<string>>> usertypeAccess = new List<Tuple<string, List<string>>>();
            //List<string, string[]> returnList = new List<string, string[]>();
            // dynamic[,] returnList = { { }, { } };


            try
            {

                List<User_Type> userstypes = db.User_Type.ToList();

                List<string> userTypes = new List<string>();


                foreach (User_Type user_type in userstypes)
                {

                    string name = user_type.UTypeDescription;
                    userTypes.Add(name);

                    List<User_Type_Access> userAccess = db.User_Type_Access.Include(x => x.Access).Where(x => x.UserTypeID == user_type.UserTypeID).ToList();
                    List<string> userTypeAccess = new List<string>();

                    foreach (User_Type_Access user_access in userAccess)
                    {


                        string access = user_access.Access.AccessDescription;
                        userTypeAccess.Add(access);


                    }



                    usertypeAccess.Add(new Tuple<string, List<string>>(name, userTypeAccess));




                }

                toReturn.dataMap = usertypeAccess;
                toReturn.rootLevelNodes = userTypes;

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getTreeData")]
        public object getTreeData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.treeObject = new ExpandoObject();


            try

            {
                List<User_Type_Access> access = db.User_Type_Access.Include(x => x.Access).Include(x => x.User_Type).ToList();

                dynamic treeObject = new ExpandoObject();
                treeObject.UserTypes = null;

              //list of dynamic objects for the chart
            var userTypeList = access.GroupBy(x => x.User_Type.UTypeDescription);
            List<dynamic> type = new List<dynamic>();
            foreach (var group in userTypeList)
            {
                dynamic usertype = new ExpandoObject();
                usertype.name = group.Key;
                type.Add(usertype);
            }

                treeObject.UserTypes = type;
                return (treeObject);

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;
        }







            [HttpGet]
        [Route("getAllUsers")]
        public object getAllUsers()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
        
            {
                List<dynamic> returnUsers = new List<dynamic>();
                List<User> users = db.Users.Include(x => x.User_Type).ToList();
                foreach (var user in users)
                {
                    User_Type type = db.User_Type.Where(x => x.UserTypeID == user.UserTypeID).FirstOrDefault();
                    dynamic item = new ExpandoObject();
                    item.UserName = user.UserName;
                    item.UserSurname = user.UserSurname;
                    item.UserCell = user.UserCell;
                    item.UserEmail = user.UserEmail;
                    item.UserType = type;

                    returnUsers.Add(item);

                    toReturn = returnUsers;
                }
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //get users with user types
        [HttpGet]
        [Route("getAllTypesAndUsers")]
        public object getAllTypesAndUsers()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try

            {
                List<User_Type> user_Types = db.User_Type.ToList();
                List<dynamic> treedataList = new List<dynamic>();
               

                foreach (var item in user_Types)
                {
                    dynamic treedata = new ExpandoObject();
                    treedata.name = item.UTypeDescription;

                    dynamic child = new ExpandoObject();
                    List<dynamic> children = new List<dynamic>();
                    List<User> users= db.Users.Where(X => X.UserTypeID == item.UserTypeID).ToList();
                    foreach ( var user in users)
                    {
                        child = user.UserName + " " + user.UserSurname;
                        children.Add(child);

                    }
                    treedata.children = children;
                     
                    treedataList.Add(treedata);
                }

                toReturn = treedataList;



            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }


        //------Users Types------//

        //Getting all user types
        [HttpGet]
        [Route("getAllUserTypes")]
        public object getAllUserTypes()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.List = new List<dynamic>();

            try
            {
                List<User_Type> types = db.User_Type.ToList();
                if (types != null)
                {
                    List<dynamic> typesList = new List<dynamic>();
                    foreach (User_Type item in types)
                    {
                        dynamic status = new ExpandoObject();
                        status.id = item.UserTypeID;
                        status.description = item.UTypeDescription;
                        typesList.Add(status);
                    }
                    toReturn.List = typesList;
                }
                else
                {
                    toReturn.Message = "No User Types Found";
                }
                
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //add User Type
        [HttpPut]
        [Route("addUserType")]
        public object addUserType(string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                User_Type newType = new User_Type();
                newType.UTypeDescription = description;
                db.User_Type.Add(newType);
                db.SaveChanges();

                toReturn.Message = "User Type Added Successfully";

            }
            catch
            {
                toReturn.Error = "User Type Add Unsuccessful";
            }

            return toReturn;

        }

        //Update User Type
        [HttpPost]
        [Route("updateUserType")]
        public object updateUserType(int id, string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
               User_Type newType = db.User_Type.Where(x => x.UserTypeID == id).FirstOrDefault();
                newType.UTypeDescription = description;
                db.SaveChanges();

                toReturn.Message = "Update User Type Successful";
            }
            catch
            {
                toReturn.Error = "User Type Update Unsuccessful";
            }

            return toReturn;

        }



        //------Customer Order Status------//

        //Getting all Customer Orders Statuses
        [HttpGet]
        [Route("getAllCusOrderStatuses")]
        public object getAllCusOrderStatuses() {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.List = new List<dynamic>();

            try
            {
                List<Customer_Order_Status> statuses = db.Customer_Order_Status.ToList();
                if (statuses != null)
                {
                    List<dynamic> statusList = new List<dynamic>();
                    foreach (Customer_Order_Status item in statuses)
                    {
                        dynamic status = new ExpandoObject();
                        status.id = item.CustomerOrderStatusID;
                        status.description = item.CODescription;
                        statusList.Add(status);
                    }

                    toReturn.List = statusList;
                }
                else
                {
                    toReturn.Message = "Customer Order Statuses Not Found";
                }
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //add Customer Orders Statuses
        [HttpPost]
        [Route("addCusOrderStatuses")]
        public object addCusOrderStatuses(string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = new Customer_Order_Status();
                newStatus.CODescription = description;
                db.Customer_Order_Status.Add(newStatus);
                db.SaveChanges();

                toReturn.Message = "Customer Order Status Added Successfully";

            }
            catch
            {
                toReturn.Error = "Customer Order Status Add Unsuccessful";
            }

            return toReturn;

        }

        //Update Customer Orders Statuses
        [HttpPost]
        [Route("updateCusOrderStatuses")]
        public object updateCusOrderStatuses(int id, string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = db.Customer_Order_Status.Where(x => x.CustomerOrderStatusID == id).FirstOrDefault();
                newStatus.CODescription = description;
                db.SaveChanges();

                toReturn.Message = "Customer Order Status Update Successful";
            }
            catch
            {
                toReturn.Error = "Customer Order Status Update Unsuccessful";
            }

            return toReturn;

        }

        [HttpPost]
        [Route("deleteCusOrderStatuses")]
        public object deleteCusOrderStatuses(int id)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = db.Customer_Order_Status.Where(x => x.CustomerOrderStatusID == id).FirstOrDefault();
             
                db.Customer_Order_Status.Remove(newStatus);
                db.SaveChanges();

                toReturn.Message = "Customer Order Status Delete Successful";
            }
            catch
            {
                toReturn.Error = "Customer Order Status Delete Unsuccessful";
            }

            return toReturn;

        }




        //------Supplier Order Status------//

        //Getting all Supplier Order Statuses
        [HttpGet]
        [Route("getAllSupOrderStatuses")]
        public object getAllSupOrderStatuses()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.List = new List<dynamic>();

            try
            {
                List<Supplier_Order_Status> statuses = db.Supplier_Order_Status.ToList();
                if (statuses != null)
                {
                    List<dynamic> statusList = new List<dynamic>();
                    foreach (Supplier_Order_Status item in statuses)
                    {
                        dynamic status = new ExpandoObject();
                        status.id = item.SupplierOrderStatusID;
                        status.description = item.SOSDescription;
                        statusList.Add(status);
                    }

                    toReturn.List = statusList;
                }
                else
                {
                    toReturn.Message = "No Supplier Order Statuses Found";
                }
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //add Supplier Orders Statuses
        [HttpPut]
        [Route("addSupOrderStatuses")]
        public object addSupOrderStatuses(string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = new Supplier_Order_Status();
                newStatus.SOSDescription= description;
                db.Supplier_Order_Status.Add(newStatus);
                db.SaveChanges();

                toReturn.Message = "Supplier Order Status Added Successfully";

            }
            catch
            {
                toReturn.Error = "Supplier Order Status Add Unsuccessful";
            }

            return toReturn;

        }

        //Update Supplier Orders Statuses
        [HttpPost]
        [Route("updateSupOrderStatuses")]
        public object updateSupOrderStatuses(int id, string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == id).FirstOrDefault();
                newStatus.SOSDescription = description;
                db.SaveChanges();
                toReturn.Message = "Supplier Order Status Update Successful";

            }
            catch
            {
                toReturn.Error = "Supplier Order Status Update Unsuccessful";
            }

            return toReturn;

        }
        
        //delete Supplier Order Status

        [HttpDelete]
        [Route("deleteSupOrderStatuses")]
        public object deleteSupOrderStatuses(int id)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == id).FirstOrDefault();

                db.Supplier_Order_Status.Remove(newStatus);
                db.SaveChanges();
                toReturn.Message = "Supplier Order Status Delete Successful";

            }
            catch
            {
                toReturn.Error = "Supplier Order Status Delete Unsuccessful";
            }

            return toReturn;

        }



        //------Marked Of Reasons------//

        //Getting all Marked of reasons
        [HttpGet]
        [Route("getAllMarkedOfReasons")]
        public object getAllMarkedOfReasons()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.List = new List<dynamic>();

            try
            {
                List<Marked_Off_Reason> reasons = db.Marked_Off_Reason.ToList();
                if (reasons != null)
                {
                    List<dynamic> statusList = new List<dynamic>();
                    foreach (Marked_Off_Reason item in reasons)
                    {
                        dynamic status = new ExpandoObject();
                        status.id = item.ReasonID;
                        status.description = item.MODescription;
                        statusList.Add(status);
                    }

                    toReturn.List = statusList;
                }
                else
                {
                    toReturn.Message = "No Marked Off Reasons Found";
                }
            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //add MarkedOfReason
        [HttpPut]
        [Route("addMarkedOfReason")]
        public object addMarkedOfReasons(string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = new Marked_Off_Reason();
                newReason.MODescription = description;
                db.Marked_Off_Reason.Add(newReason);
                db.SaveChanges();

                toReturn.Message = "Marked Off Reason Added Successfully";
            }
            catch
            {
                toReturn.Error = "Marked Off Reason Add Unsuccessful";
            }

            return toReturn;

        }

        //Update MarkedOfReason
        [HttpPost]
        [Route("updateMarkedOfReason")]
        public object updateMarkedOfReason(int id, string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = db.Marked_Off_Reason.Where(x => x.ReasonID == id).FirstOrDefault();
                newReason.MODescription = description;
                db.SaveChanges();

                toReturn.Message = "Marked Off Reason Update Successful";

            }
            catch
            {
                toReturn.Error = "Marked Off Reason Update Unsuccessful";
            }

            return toReturn;

        }

        //delete MarkedOfReason

        [HttpDelete]
        [Route("deleteMarkedOfReason")]
        public object deleteMarkedOfReason(int id)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = db.Marked_Off_Reason.Where(x => x.ReasonID == id).FirstOrDefault();
                db.Marked_Off_Reason.Remove(newReason);
                db.SaveChanges();

                toReturn.Message = "Marked Off Reason Delete Successful";
            }
            catch
            {
                toReturn.Error = "Marked Off Reason Delete Unsuccessful";
            }

            return toReturn;

        }


        //------Payment Types------//

        //Getting all Payment Types
        [HttpGet]
        [Route("getAllPaymentTypes")]
        public object getAllPaymentTypes()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.List = new List<dynamic>();

            try
            {
                List<Payment_Type> types = db.Payment_Type.ToList();
                if (types != null)
                {
                    List<dynamic> typesList = new List<dynamic>();
                    foreach (Payment_Type item in types)
                    {
                        dynamic status = new ExpandoObject();
                        status.id = item.PaymentTypeID;
                        status.description = item.PTDescription;
                        typesList.Add(status);
                    }
                    toReturn.List = typesList;
                }
                else
                {
                    toReturn.Message = "No Payment Types Found";
                }

            }
            catch
            {
                toReturn.Error = "Search Interrupted. Retry";
            }

            return toReturn;

        }

        //add Payment Type
        [HttpPut]
        [Route("addPaymentTypes")]
        public object addPaymentTypes(string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = new Payment_Type();
                newType.PTDescription = description;
                db.Payment_Type.Add(newType);
                db.SaveChanges();

                toReturn.Message = "Payment Type Added Successfully";

            }
            catch
            {
                toReturn.Error = "Payment Type Add Unsuccessful";
            }

            return toReturn;

        }

        //Update Payment Type
        [HttpPost]
        [Route("updatePaymentTypes")]
        public object updatePaymentTypes(int id, string description)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = db.Payment_Type.Where(x => x.PaymentTypeID == id).FirstOrDefault();
                newType.PTDescription = description;
                db.SaveChanges();

                toReturn.Message = "Update Payment Type Successful";
            }
            catch
            {
                toReturn.Error = "Payment Type Update Unsuccessful";
            }

            return toReturn;

        }

        //delete Payment Type

        [HttpDelete]
        [Route("deletePaymentTypes")]
        public object deletePaymentTypes(int id)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = db.Payment_Type.Where(x => x.PaymentTypeID == id).FirstOrDefault();
                db.Payment_Type.Remove(newType);
                db.SaveChanges();

                toReturn.Message = "Payment Type Delete Successful";
            }
            catch
            {
                toReturn.Error = "Payment Type Delete Unsuccessful";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getSaleReportData")] //daily sales for the bar graph
        public dynamic getSaleReportData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Marked_Off> markedProducts = new List<Marked_Off>();
            List<Product> products = new List<Product>();
            DateTime today = DateTime.Today;
            int year = DateTime.Now.Year;

            DateTime begin = new DateTime(year, 01, 01);
            DateTime end = new DateTime(year, 12, 31, 23, 59, 0);

            List<Sale> sales = new List<Sale>();
            try
            {                                                                                     //.Where(z=> (z.SaleDate >= begin) || (z.SaleDate<=end))
                sales = db.Sales.Include(z => z.Container).Include(z => z.Product_Sale).ToList(); //.Where(z => z.SaleDate == today)
                                                                                                  //db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).ToList();
            }
            catch (Exception)
            {
                throw;
            }

            return getSaleReportObject(sales);
        }
        public dynamic getSaleReportObject(List<Sale> sales)
        {
            dynamic toReturn = new ExpandoObject();
            //toReturn.TableData = null;
            toReturn.ChartData = null;
            try
            {

                if (sales != null)
                {
                    //chart data

                    var conList = sales.GroupBy(z => z.ContainerID);
                    List<dynamic> containers = new List<dynamic>();
                    

                    foreach (var item in conList)
                    {
                        dynamic name = new ExpandoObject();
                        decimal rev = 0;
                        if (item!=null || item.Key!=null)
                        {
                            dynamic container = new ExpandoObject();
                            container.ID = item.Key;
                            var id = item.Key;
                            //List<Product_Sale> saleProds = db.Product_Sale.Where(z => z.SaleID == id).ToList();
                            Container nameObj = db.Containers.Where(z => z.ContainerID == id).FirstOrDefault();
                            name = nameObj.ConName;
                            var sum = 0;    //Convert.ToInt32(item.Sum(z => z.SaleID), CultureInfo.InvariantCulture);

                            //calculating revenue
                            var saleId = item.Select(z => z.SaleID).FirstOrDefault();
                            List<Product_Sale> prodSale = db.Product_Sale.Where(z => z.SaleID == saleId).ToList();
                            foreach (var prod in prodSale)
                            {
                                var quantity = Convert.ToDecimal(prod.PSQuantity);
                                var prodId = prod.ProductID;
                                Price price = db.Prices.Where(z => z.ProductID == prodId).ToList().LastOrDefault();
                                var salePrice = Convert.ToDecimal(price.UPriceR);
                                rev = rev + (quantity * salePrice);
                            }

                            container.Sum = rev;
                            container.Name = name;
                            containers.Add(container);
                        }
                        else
                        {
                            toReturn.Error = "Container information not available to generate report";
                        }
                    }

                    toReturn.ChartData = containers;

                    
                }
                else
                {
                    toReturn.Error = "Sale information not available to generate report";
                }
            }
            catch (Exception )
            {
                toReturn.Error = "Failed to generate report";
            }
            return toReturn;
        }


        [HttpGet]
        [Route("getSaleYearlyPieData")] // sales for the year for the pie chart
        public dynamic getSaleYearlyPieData()
        {
            db.Configuration.ProxyCreationEnabled = false;
            List<Marked_Off> markedProducts = new List<Marked_Off>();
            List<Product> products = new List<Product>();
            //DateTime today = DateTime.Today;
            int year = DateTime.Now.Year;

            DateTime begin = new DateTime(year, 01, 01);
            DateTime end = new DateTime(year, 12, 31, 23, 59, 0);

            List<Sale> sales = new List<Sale>();
            try
            {
                sales = db.Sales.Include(z => z.Container).Include(z => z.Product_Sale).ToList();//.Where(z => (z.SaleDate >= begin) || (z.SaleDate <= end))
                                                                                                 //db.Marked_Off.Include(z => z.Product).Include(z => z.Marked_Off_Reason).ToList();
            }
            catch (Exception)
            {
                throw;
            }

            return getSalePieChartObject(sales);
        }
        public dynamic getSalePieChartObject(List<Sale> sales)
        {
            dynamic toReturn = new ExpandoObject();
            //toReturn.TableData = null;
            toReturn.ChartData = null;
            try
            {

                if (sales != null)
                {
                    //chart data

                    var conList = sales.GroupBy(z => z.ContainerID);
                    List<dynamic> containers = new List<dynamic>();


                    foreach (var item in conList)
                    {
                        dynamic name = new ExpandoObject();
                        decimal rev = 0;
                        if (item != null || item.Key != null)
                        {
                            dynamic container = new ExpandoObject();
                            container.ID = item.Key;
                            var id = item.Key;
                            //List<Product_Sale> saleProds = db.Product_Sale.Where(z => z.SaleID == id).ToList();
                            Container nameObj = db.Containers.Where(z => z.ContainerID == id).FirstOrDefault();
                            name = nameObj.ConName;
                            var sum = 0;    //Convert.ToInt32(item.Sum(z => z.SaleID), CultureInfo.InvariantCulture);

                            //calculating revenue
                            var saleId = item.Select(z => z.SaleID).FirstOrDefault();
                            List<Product_Sale> prodSale = db.Product_Sale.Where(z => z.SaleID == saleId).ToList();
                            foreach (var prod in prodSale)
                            {
                                var quantity = Convert.ToDecimal(prod.PSQuantity);
                                var prodId = prod.ProductID;
                                Price price = db.Prices.Where(z => z.ProductID == prodId).ToList().LastOrDefault();
                                var salePrice = Convert.ToDecimal(price.UPriceR);
                                rev = rev + (quantity * salePrice);
                            }

                            container.Sum = rev;
                            container.Name = name;
                            containers.Add(container);
                        }
                        else
                        {
                            toReturn.Error = "Container information not available to generate report";
                        }
                    }

                    toReturn.ChartData = containers;


                }
                else
                {
                    toReturn.Error = "Sale information not available to generate report";
                }
            }
            catch (Exception)
            {
                toReturn.Error = "Failed to generate report";
            }
            return toReturn;
        }

    }
}
