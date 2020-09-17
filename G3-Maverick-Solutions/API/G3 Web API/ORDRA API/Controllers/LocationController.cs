using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ORDRA_API.Models;
using System.Data.Entity;
using System.Dynamic;
using System.Web.Http.Cors;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/Location")]
    public class LocationController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all Locations
        [HttpGet]
        [Route("getAllLocations")]
        public object getAllLocations()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Locations.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting Location by id
        [HttpGet]
        [Route("getLocation/{id}")]

        public object getLocation(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Location objectLocation = new Location();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectLocation = db.Locations.Find(id);

                if (objectLocation == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectLocation;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        //searching Location by name
        [HttpGet]
        [Route("searchLocation")]
        public object searchLocation(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search Location in database
                var Location= db.Locations.Where(x => x.LocName == name).FirstOrDefault();

                if (Location != null)
                {

                    toReturn = Location;
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


        //add location
        [HttpPost]
        [Route("addLocation")]
        public object addLocation(Location newLocation)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Locations.Add(newLocation);
                db.SaveChanges();
                toReturn.Message = "Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Oops!";


            }

            return toReturn;


        }

        //Update Location
        [HttpPut]
        [Route("updateLocation")]
        public object updateLocation(Location LocationUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Location objectLocation = new Location();
            dynamic toReturn = new ExpandoObject();
            var id = LocationUpdate.LocationID;

            try
            {
                objectLocation = db.Locations.Where(x => x.LocationID == id).FirstOrDefault();
                if (objectLocation != null)
                {
                    objectLocation.LocName = LocationUpdate.LocName;
                    objectLocation.LocationStatusID = LocationUpdate.LocationStatusID;
                    objectLocation.AreaID = LocationUpdate.AreaID;
                    objectLocation.ContainerID = LocationUpdate.ContainerID;

                    db.SaveChanges();

                    toReturn.Message = "Update Done.";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update not successful.";

            }


            return toReturn;
        }




    }
}
