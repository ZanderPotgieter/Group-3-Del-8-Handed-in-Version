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

    [RoutePrefix("API/Container")]
    public class ContainerController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all container
        [HttpGet]
        [Route("GetAllContainers")]
        public object GetAllContainers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Containers.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting container by id
        [HttpGet]
        [Route("GetContainer/{id}")]

        public object GetContainer(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Container objectContainer = new Container();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectContainer = db.Containers.Find(id);

                if (objectContainer == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectContainer;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;


        }

        //searching container by name 
        [HttpGet]
        [Route("SearchContainer")]
        public object SearchContainer(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                
                var Container = db.Containers.Where(x => x.ConName == name).FirstOrDefault();

                if (Container != null)
                {

                    toReturn = Container;
                }
                else
                {

                    toReturn.Message = "Record Not Found";

                }
            }

            catch (Exception error)
            {
                toReturn = "Something Went Wrong " + error.Message;
            }

            return toReturn;


        }

        //add container
        [HttpPost]
        [Route("AddContainer")]
        public object AddContainer(Container newConatiner)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Containers.Add(newConatiner);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Add UnSuccsessful";


            }

            return toReturn;
        }

        //Update container
        [HttpPut]
        [Route("UpdateContainer")]
        public object UpdateContainer(Container ContainerUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Container objectContainer = new Container();
            dynamic toReturn = new ExpandoObject();
            var id = ContainerUpdate.ContainerID;

            try
            {
                objectContainer = db.Containers.Where(x => x.ContainerID == id).FirstOrDefault();
                if (objectContainer != null)
                {
                    objectContainer.ConName = ContainerUpdate.ConName;
                    objectContainer.ConDescription = ContainerUpdate.ConDescription;
                  
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

        //Delete container
        [HttpDelete]
        [Route("DeleteContainer")]
        public object DeleteContainer(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Container objectContainer = new Container();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectContainer = db.Containers.Find(id);

                if (objectContainer == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Containers.Remove(objectContainer);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch
            {
                toReturn.Message = "Delete Restricted";
            }

            return toReturn;
        }

    }
}
