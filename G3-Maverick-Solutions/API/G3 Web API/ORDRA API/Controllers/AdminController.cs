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

    [RoutePrefix("Api/Admin")]
    public class AdminController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();


        //---User Types---//
        [HttpGet]
        [Route("getAllUserTypes")]
        public object getAllUserTypes()
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.User_Type.ToList();
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
                toReturn = db.Users.Include(x => x.User_Type).ToList();
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
                    treedata.children = db.Users.Where(X => X.UserTypeID == item.UserTypeID);
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






        //------Customer Order Status------//

        //Getting all Customer Orders Statuses
        [HttpGet]
        [Route("getAllCusOrderStatuses")]
        public object getAllCusOrderStatuses() {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Customer_Order_Status.ToList();
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
        public object addCusOrderStatuses(Customer_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = new Customer_Order_Status();
                newStatus.CODescription = newStatus.CODescription;
                db.Customer_Order_Status.Add(newStatus);
                db.SaveChanges();

                toReturn.Message = "Customer Order Status Add Successful";

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
        public object updateCusOrderStatuses(Customer_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = db.Customer_Order_Status.Where(x => x.CustomerOrderStatusID == status.CustomerOrderStatusID).FirstOrDefault();
                newStatus.CODescription = newStatus.CODescription;
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
        public object deleteCusOrderStatuses(Customer_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Customer_Order_Status newStatus = db.Customer_Order_Status.Where(x => x.CustomerOrderStatusID == status.CustomerOrderStatusID).FirstOrDefault();
             
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

            try
            {
                toReturn = db.Supplier_Order_Status.ToList();
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
        public object addSupOrderStatuses(Supplier_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = new Supplier_Order_Status();
                newStatus.SOSDescription= newStatus.SOSDescription;
                db.Supplier_Order_Status.Add(newStatus);
                db.SaveChanges();

                toReturn.Message = "Supplier Order Status Add Successful";

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
        public object updateSupOrderStatuses(Supplier_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == status.SupplierOrderStatusID).FirstOrDefault();
                newStatus.SOSDescription = newStatus.SOSDescription;
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
        public object deleteSupOrderStatuses(Supplier_Order_Status status)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Supplier_Order_Status newStatus = db.Supplier_Order_Status.Where(x => x.SupplierOrderStatusID == status.SupplierOrderStatusID).FirstOrDefault();

                db.Supplier_Order_Status.Remove(newStatus);
                db.SaveChanges();
                toReturn.Message = "Supplier Order Status Delet Successful";

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

            try
            {
                toReturn = db.Marked_Off_Reason.ToList();
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
        public object addMarkedOfReasons(Marked_Off_Reason reason)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = new Marked_Off_Reason();
                newReason.MODescription = reason.MODescription;
                db.Marked_Off_Reason.Add(newReason);
                db.SaveChanges();

                toReturn.Message = "Marked Off Reason Add Successful";
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
        public object updateMarkedOfReason(Marked_Off_Reason reason)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = db.Marked_Off_Reason.Where(x => x.ReasonID == reason.ReasonID).FirstOrDefault();
                newReason.MODescription = reason.MODescription;
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
        public object deleteMarkedOfReason(Marked_Off_Reason reason)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Marked_Off_Reason newReason = db.Marked_Off_Reason.Where(x => x.ReasonID == reason.ReasonID).FirstOrDefault();
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

            try
            {
                toReturn = db.Payment_Type.ToList();
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
        public object addPaymentTypes(Payment_Type type)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = new Payment_Type();
                newType.PTDescription = type.PTDescription;
                db.Payment_Type.Add(newType);
                db.SaveChanges();

                toReturn.Message = "Payment Type Add Successful";

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
        public object updatePaymentTypes(Payment_Type type)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = db.Payment_Type.Where(x => x.PaymentTypeID == type.PaymentTypeID).FirstOrDefault();
                newType.PTDescription = type.PTDescription;
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
        public object deletePaymentTypes(Payment_Type type)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                Payment_Type newType = db.Payment_Type.Where(x => x.PaymentTypeID == type.PaymentTypeID).FirstOrDefault();
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


    }
}
