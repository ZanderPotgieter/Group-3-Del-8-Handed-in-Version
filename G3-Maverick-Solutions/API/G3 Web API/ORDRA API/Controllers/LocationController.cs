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
                List<Location> locList = db.Locations.ToList();
                /* List<dynamic> locations = new List<dynamic>();
                 foreach (var loc in locList)
                 {
                     dynamic location = new ExpandoObject();
                     location.LocationName = loc.LocName;
                     location.LocationID = loc.LocationID;
                     Area area = db.Areas.Where(z => z.AreaID == loc.AreaID).FirstOrDefault();
                     location.AreaName = area.ArName;
                     location.AreaID = loc.AreaID;
                     Container container = db.Containers.Where(z => z.ContainerID == loc.ContainerID).FirstOrDefault();
                     location.ContainerName = container.ConName;
                     location.ContainerID = loc.ContainerID;
                     Location_Status status = db.Location_Status.Where(z => z.LocationStatusID == loc.LocationStatusID).FirstOrDefault();
                     location.StatusName = status.LSDescription;
                     location.StatusID = loc.LocationStatusID;
                     locations.Add(loc);
                 }

                 toReturn.Locations = locations;*/
                toReturn.Locations = locList;
                
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get all locations";
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
                    toReturn.Message = "Location Record Not Found";
                }
                else
                {

                    toReturn = objectLocation;
                }

            }
            catch 
            {
                toReturn.Message = "Failed to get location";
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
                var Location= db.Locations.Include(z => z.Location_Status).Include(z => z.Container).Include(z =>z.Area).Where(x => x.LocName == name).FirstOrDefault();

                if (Location != null)
                {
                    
                    toReturn = Location;
                }
                else
                {

                    toReturn.Message = "Location Record Not Found";

                }
            }

            catch
            {
                toReturn.Message = "Search Interrupted.Retry";
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
                toReturn.Message = "Location Add Succsessful";
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to add location";


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

                    toReturn.Message = "Location Update Successful";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Location Update unsuccessful";

            }


            return toReturn;
        }

        //Getting all  statuses
        [HttpGet]
        [Route("getLocationStatuses")]
        public object getLocationStatuses()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Location_Status.ToList();
            }
            catch (Exception )
            {
                toReturn.Message = "Statuses not found";
            }
            return toReturn;
        }


        //Getting all areas
        [HttpGet]
        [Route("getLocationAreas")]
        public object getLocationAreas()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Areas.ToList();
            }
            catch (Exception)
            {
                toReturn.Message = "Areas not found";
            }
            return toReturn;
        }


        //Getting all  statuses
        [HttpGet]
        [Route("getLocationContainers")]
        public object getLocationContainers()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Containers.ToList();
            }
            catch (Exception)
            {
                toReturn.Message = "Containers not found";
            }
            return toReturn;
        }




    }
}
