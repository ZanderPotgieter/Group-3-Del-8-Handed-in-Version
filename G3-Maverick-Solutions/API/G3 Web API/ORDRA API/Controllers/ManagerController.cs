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
using Microsoft.Ajax.Utilities;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/Manager")]
    public class ManagerController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Search Manager Using Thier Name And Surname
        [HttpGet]
        [Route("searchManager")]
        public object searchManager(string name, string surname)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.user = new ExpandoObject();
            toReturn.manager = new ExpandoObject();
            toReturn.employee = new ExpandoObject();
            toReturn.containersManaged = new List<Container>();
            toReturn.containers = new ExpandoObject();


            try
            {
                

                //get all containers list for select box to update
                List<Container> containersList = db.Containers.ToList();
                List<dynamic> allcontainers = new List<dynamic>();
                foreach (var con in containersList)
                {
                    dynamic cont = new ExpandoObject();
                    cont.ContainerID = con.ContainerID;
                    cont.ConName = con.ConName;
                    allcontainers.Add(cont);

                }
                toReturn.containers = allcontainers;


                User user = db.Users.Where(x => x.UserName == name && x.UserSurname == surname).FirstOrDefault();

                if (user != null)
                {

                    //Set User Details To Return Object
                    dynamic userDetails = new ExpandoObject();
                    userDetails.UserID = user.UserID;
                    userDetails.UserName = user.UserName;
                    userDetails.UserSurname = user.UserSurname;
                    userDetails.UserCell = user.UserCell;
                    userDetails.UserEmail = user.UserEmail;
                    toReturn.user = userDetails;

                    Employee employee = db.Employees.Where(x => x.UserID == user.UserID).FirstOrDefault();
                    if (employee != null)
                    {


                        //Set Employye Details To Return Object
                        dynamic employeeDetails = new ExpandoObject();
                        employeeDetails.EmployeeID = employee.EmployeeID;
                        employeeDetails.EmpStartDate = employee.EmpStartDate;
                        employeeDetails.EmpShiftsCompleted = employee.EmpShiftsCompleted;
                        toReturn.employee = employeeDetails;
                    }
                    else
                    {
                        toReturn.Message = "Employee Record Not Found";
                    }

                    Manager manager = db.Managers.Include(x => x.Containers).Where(x => x.UserID == user.UserID).FirstOrDefault();
                    if (manager != null)
                    {

                        //Set Manager Details To Return object
                        dynamic managerDetails = new ExpandoObject();
                        managerDetails.ManagerID = manager.ManagerID;
                        managerDetails.ManQualification = manager.ManQualification;
                        managerDetails.ManNationality = manager.ManNationality;
                        managerDetails.ManIDNumber = manager.ManIDNumber;
                        managerDetails.ManNextOfKeenFName = manager.ManNextOfKeenFName;
                        managerDetails.ManNextOfKeenCell = manager.ManNextOfKeenCell;
                        toReturn.manager = managerDetails;

                        //Set Conainers Managed
                        List<Container> containersManaged = manager.Containers.ToList();
                        List<dynamic> containers = new List<dynamic>();
                        foreach (var con in containersManaged)
                        {
                            dynamic container = new ExpandoObject();
                            container.ContainerID = con.ContainerID;
                            container.ConName = con.ConName;
                            containers.Add(container);

                        }

                        toReturn.containersManaged = containers;

                    }
                    else
                    {
                        toReturn.Message = "Manager Profile Not Found";
                    }

                }
                else
                {
                    toReturn.Message = "User Record Not Found";
                }


            }
            catch (Exception error)
            {
                toReturn.Message = "Something Went Wrong" + error.Message;
            }

            return toReturn;
        }


        //Getting all Managers
        [HttpGet]
        [Route("getAllManagers")]
        public object getAllManagers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Users.Include(x => x.Managers).Include(x => x.Employees).ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error.Message;
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getManager/{id}")]

        public object getManager(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Manager manager = new Manager();
            dynamic toReturn = new ExpandoObject();

            try
            {
                manager = db.Managers.Include(x => x.User).Where(x => x.ManagerID == id).FirstOrDefault();

                if (manager == null)
                {
                    toReturn.Message = "Manager Profile Not Found";
                }
                else
                {

                    toReturn = searchManager(manager.User.UserName, manager.User.UserSurname);
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;


        }

        [HttpPost]
        [Route("createManager")]
        public dynamic createManager(Manager manager)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            ////try
            ///{
                //Get User Details From Input Parameter
                User user = db.Users.Where(x => x.UserID == manager.UserID).FirstOrDefault();

                //Get Lists 0f Contains To Set In Create Dynamic Object From Input Parameter
                List<Container> containers = manager.Containers.ToList();
                List<Container> managedContainers = new List<Container>();

                foreach (var con in containers)
                {
                    Container container = db.Containers.Where(x => x.ContainerID == con.ContainerID).SingleOrDefault() ;
                    managedContainers.Add(container);

                }

                //Set Manager Details To Return object
                Manager managerDetails = new Manager();
                if (manager != null)
                {
                    managerDetails.User = user;
                    managerDetails.ManQualification = manager.ManQualification;
                    managerDetails.ManNationality = manager.ManNationality;
                    managerDetails.ManIDNumber = manager.ManIDNumber;
                    managerDetails.ManNextOfKeenFName = manager.ManNextOfKeenFName;
                    managerDetails.ManNextOfKeenCell = manager.ManNextOfKeenCell;
                    managerDetails.Containers = managedContainers;

                    db.Managers.Add(managerDetails);
                    db.SaveChanges();

                    toReturn.Message = "Manager Profile Succesfully Created";
                }
                else
                {
                    toReturn.Message = "Manager Profile Not Found";
                }
           /* }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }*/

            return toReturn;
        }

        [HttpPut]
        [Route("updateManager")]
        public dynamic updateManager(Manager manager)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            Manager managerDetails = new Manager();

            try
            {
                List<Container> containers = manager.Containers.ToList();
                List<Container> managedContainers = new List<Container>();

                foreach (var con in containers)
                {
                    Container container = db.Containers.Where(x => x.ContainerID == con.ContainerID).FirstOrDefault();
                    managedContainers.Add(container);

                }

                //Set Manager Details To Return object
                managerDetails = db.Managers.Include(x => x.Containers).Where(x => x.ManagerID == manager.ManagerID).FirstOrDefault();
                if (managerDetails != null)
                {
                    managerDetails.ManQualification = manager.ManQualification;
                    managerDetails.ManNationality = manager.ManNationality;
                    managerDetails.ManIDNumber = manager.ManIDNumber;
                    managerDetails.ManNextOfKeenFName = manager.ManNextOfKeenFName;
                    managerDetails.ManNextOfKeenCell = manager.ManNextOfKeenCell;
                    managerDetails.Containers = managedContainers;

                    db.SaveChanges();
                    toReturn.Message = "Update Successful";
                }
                else
                {
                    toReturn.Message = "Manager Profile Not Found";
                }
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        [HttpDelete]
        [Route("deleteManager")]
        public dynamic deleteManager(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            Manager manager = new Manager();
           // Containers containers = new Container();

            try
            {
                manager = db.Managers.Include(x => x.Containers).Where(x => x.ManagerID == id).FirstOrDefault();

                if (manager == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    List<Container> containers = manager.Containers.ToList();
                    List<Container> managedContainers = new List<Container>();

                    foreach (var con in containers)
                    {
                        Container container = db.Containers.Where(x => x.ContainerID == con.ContainerID).FirstOrDefault();
                        manager.Containers.Remove(container);

                    }


                      db.SaveChanges();

                        manager = db.Managers.Where(x => x.ManagerID == id).FirstOrDefault();
                        db.Managers.Remove(manager);
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



    }
}

