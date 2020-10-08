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

        //Getting all Provinces
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

        //Getting all products
        [HttpGet]
        [Route("getAllAreas")]
        public object getAllAreas()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.Areas = new List<Area>();

            try
            {

                List<Area> areas = db.Areas.Include(x => x.Area_Status).Include(x => x.Province).ToList();
                List<Area> areasList = new List<Area>();
                foreach (var item in areas)
                {
                    Area area = new Area();
                    area.AreaID = item.AreaID;
                    area.ArName = item.ArName;
                    area.ArPostalCode = item.ArPostalCode;
                    area.AreaStatusID = item.AreaStatusID;
                    area.ProvinceID = item.ProvinceID;
                    areasList.Add(area);

                }

                toReturn.Products = areasList;
            }
            catch
            {
                toReturn.Message = "Search interrupted. Retry";
            }

            return toReturn;

        }

        //Getting Creditor by id
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

        //Search Employee Using Thier Name And Surname
        [HttpGet]
        [Route("searchArea")]
        public object searchArea(string name)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.area = new ExpandoObject();


            try
            {
                Area area = db.Areas.Where(x => x.ArName == name).FirstOrDefault();
                Area_Status stat = db.Area_Status.Where(x => x.AreaStatusID == area.AreaStatusID).FirstOrDefault();
                Province prov = db.Provinces.Where(x => x.ProvinceID == area.ProvinceID).FirstOrDefault();

                if (area != null)
                {

                    //Set User Details To Return Object
                    dynamic areaDetails = new ExpandoObject();
                    areaDetails.AreaID = area.AreaID;
                    areaDetails.ArName = area.ArName;
                    areaDetails.ArPostalCode = area.ArPostalCode;
                    areaDetails.ProvinceID = area.ProvinceID;
                    areaDetails.AreaStatusID = area.AreaStatusID;
                    areaDetails.Province = prov;
                    areaDetails.Area_Status = stat;
                    toReturn.area = areaDetails;

                }
                else
                {
                    toReturn.Error = "User Record Not Found";
                }


            }
            catch (Exception)
            {
                toReturn.Error = "Not Found";
            }

            return toReturn;
        }

        //add product
        [HttpPut]
        [Route("AddArea")]
        public object AddArea(Area newArea)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {
                //get category for product
                Area_Status stat = db.Area_Status.Where(x => x.AreaStatusID == newArea.AreaStatusID).FirstOrDefault();
                Province prov = db.Provinces.Where(x => x.ProvinceID == newArea.ProvinceID).FirstOrDefault();
                if (prov != null & stat != null)
                {


                    //save new product
                    Area addArea = new Area();
                    addArea.ArName = newArea.ArName;
                    addArea.ArPostalCode = newArea.ArPostalCode;
                    addArea.AreaStatusID = stat.AreaStatusID;
                    addArea.ProvinceID = prov.ProvinceID;
                    addArea.Province = prov;
                    addArea.Area_Status = stat;
                    db.Areas.Add(addArea);
                    db.SaveChanges();

                
                    toReturn.Message = "Add Area Succsessful";
                }
                else
                {
                    toReturn.Message = "Add Area UnSuccsessful: Select a Province and Status";
                }

            }
            catch (Exception)
            {
                toReturn.Message = "Add Area UnSuccsessful";

            }
            return toReturn;
        }

        //UPDATE product
        [HttpPost]
        [Route("updateArea")]
        public object updateArea(Area updateArea)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();


            try
            {
                //get category for product
                Area_Status stat = db.Area_Status.Where(x => x.AreaStatusID == updateArea.AreaStatusID).FirstOrDefault();
                Province prov = db.Provinces.Where(x => x.ProvinceID == updateArea.ProvinceID).FirstOrDefault();

                //save new product
                Area addArea = db.Areas.Where(x => x.AreaID == updateArea.AreaID).FirstOrDefault();
                if (addArea != null)
                {
                    addArea.ArName = updateArea.ArName;
                    addArea.ArPostalCode = updateArea.ArPostalCode;
                    addArea.AreaStatusID = stat.AreaStatusID;
                    addArea.ProvinceID = prov.ProvinceID;
                    addArea.Area_Status = stat;
                    addArea.Province = prov;
                    db.SaveChanges();

                    toReturn.Message = "Area Update Succsessful";
                }
                else
                {
                    toReturn.Message = "Area Not Found";
                }

            }
            catch (Exception)
            {
                toReturn.Message = "Area Update UnSuccsessful";

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
