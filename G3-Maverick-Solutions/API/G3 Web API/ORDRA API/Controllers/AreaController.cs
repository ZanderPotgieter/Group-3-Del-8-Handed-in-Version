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
using System.Security.Cryptography.X509Certificates;
using System.Runtime.InteropServices;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [RoutePrefix("API/Area")]
    public class AreaController : ApiController
    {
        //database initializing
        OrdraDBEntities db = new OrdraDBEntities();

        //Getting all Statusses
        [HttpGet]
        [Route("getAllAreaStatus")]
        public object getAllAreaStatus()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Area_Status.ToList();
            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong" + error;
            }

            return toReturn;

        }

        //Getting all Areas
        [HttpGet]
        [Route("getAllAreas")]
        public object getAllAreas()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                List<Area> AreaList = db.Areas.ToList();
                List<dynamic> areas = new List<dynamic>();
                foreach (var ar in AreaList)
                {
                    dynamic area = new ExpandoObject();
                    area.ArName = ar.ArName;
                    area.ArPostalCode = ar.ArPostalCode;
                    area.AreaID = ar.AreaID;
                    Province province = db.Provinces.Where(z => z.ProvinceID == ar.ProvinceID).FirstOrDefault();
                    area.ProvName = province.ProvName;
                    area.ProvinceID = province.ProvinceID;
                    Area_Status status = db.Area_Status.Where(z => z.AreaStatusID == ar.AreaStatusID).FirstOrDefault();
                    area.Status = status.ASDescription;
                    area.AreaStatusID = ar.AreaStatusID;
                    areas.Add(ar);
                }

                toReturn.Locations = areas;

            }
            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong" + error;
            }

            return toReturn;

        }


        //Getting Area by ID
        [HttpGet]
        [Route("getAreaByID/{id}")]

        public object getAreaByID(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Area objectArea = new Area();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectArea = db.Areas.Find(id);

                if (objectArea == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectArea;
                }

            }
            catch (Exception error)
            {
                toReturn = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        //Search Area
        [HttpGet]
        [Route("searchArea")]
        public object searchArea(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search Location in database
                var Area = db.Areas.Include(z => z.Area_Status).Include(z => z.Province).Where(x => x.ArName == name).FirstOrDefault();

                if (Area != null)
                {

                    toReturn = Area;
                }
                else
                {

                    toReturn.Message = "Area not found. Please check input criteria.";

                }
            }

            catch (Exception error)
            {
                toReturn.Message = "Something Went Wrong " + error.Message;
            }

            return toReturn;
        }


        //Add Area
        [HttpPost]
        [Route("addArea")]
        public object addArea(Area newArea)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                db.Areas.Add(newArea);
                db.SaveChanges();
                toReturn.Message = "The Area has been added successfully.";
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to add the Area";


            }

            return toReturn;


        }

        //Update Area
        [HttpPut]
        [Route("updateArea")]
        public object updateArea(Area AreaUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Area objectArea = new Area();
            dynamic toReturn = new ExpandoObject();
            var id = AreaUpdate.AreaID;

            try
            {
                objectArea = db.Areas.Where(x => x.AreaID == id).FirstOrDefault();
                if (objectArea != null)
                {
                    objectArea.ArName = AreaUpdate.ArName;
                    objectArea.AreaStatusID = AreaUpdate.AreaStatusID;
                    objectArea.ProvinceID = AreaUpdate.ProvinceID;
                    objectArea.ArPostalCode = AreaUpdate.ArPostalCode;

                    db.SaveChanges();

                    toReturn.Message = AreaUpdate.ArName + " has been successfully updated.";
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

        //Delete Customer
        [HttpDelete]
        [Route("deleteArea")]
        public object deleteArea(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Area objectArea = new Area();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectArea = db.Areas.Find(id);

                if (objectArea == null)
                {
                    toReturn.Message = "Area Not Found";
                }
                else
                {
                    db.Areas.Remove(objectArea);
                    db.SaveChanges();
                    toReturn.Message = "The area has successfully been Deleted.";
                }

            }
            catch
            {
                toReturn.Error = "Delete Unsuccessful";
            }

            return toReturn;
        }
    }
}
