using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using ORDRA_API.Models;
using System.Data.Entity;
using System.Web.Http.Cors;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/Province")]
    public class ProvinceController : ApiController
    {
        //DATABASE INITIALIZING
        OrdraDBEntities db = new OrdraDBEntities();


        //Getting all Provinces
        [HttpGet]
        [Route("getAllProvinces")]
        public object getAllProvinces()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn = db.Provinces.ToList();
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get all provinces" ;
            }

            return toReturn;

        }

        //Getting Province by id
        [HttpGet]
        [Route("getProvince/{id}")]

        public object getProvince(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Province objectProvince = new Province();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProvince = db.Provinces.Find(id);

                if (objectProvince == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {

                    toReturn = objectProvince;
                }

            }
            catch (Exception )
            {
                toReturn.Message = "Failed to get province " ;
            }

            return toReturn;


        }

        //searching Province by name 
        [HttpGet]
        [Route("searchProvince")]
        public object searchProvince(string name)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                //Search Province in database
                var Province = db.Provinces.Where(x => x.ProvName == name).FirstOrDefault();

                if (Province != null)
                {

                    toReturn = Province;
                }
                else
                {

                    toReturn.Message = "Record Not Found";

                }
            }

            catch (Exception )
            {
                toReturn.Message = "Failed to get province ";
            }

            return toReturn;


        }

        //adding a new province
        [HttpPost]
        [Route("addProvince")]
        public object addProvince(Province newProvince)
        {

            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {


                var name = newProvince.ProvName;
                List<Province> provList = db.Provinces.ToList();
                var dupCheck = false;
                var specCheck = false;

                foreach (var item in provList)
                {
                    if (name == item.ProvName)
                    {
                        dupCheck = true;
                    }
                }

                if (dupCheck == true)
                {
                    toReturn.Message = "Duplicate record";
                }
                else if (dupCheck == false)
                {

                    string specialChar = @"\|!#$%&/()=?»«@£§€{}.-;'<>_,";
                    foreach (var item in specialChar)
                    {
                        if (name.Contains(item))
                        {
                            specCheck = true;
                        }
                    }

                    if (name.Equals(null) || specCheck == true || name.Equals(""))
                    {
                        toReturn.Message = "Invalid input";
                    }
                    else
                    {
                        db.Provinces.Add(newProvince);
                        db.SaveChanges();
                        toReturn.Message = "Add Successful";
                    }

                }



            }
            catch (Exception)
            {
                toReturn.Message = "Add Unsuccsessful";


            }

            return toReturn;


        }

        //Update province
        [HttpPut]
        [Route("updateProvince")]
        public object updateProvince(Province provinceUpdate)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Province objectProvince = new Province();
            dynamic toReturn = new ExpandoObject();
            var id = provinceUpdate.ProvinceID;

            try
            {
                objectProvince = db.Provinces.Where(x => x.ProvinceID == id).FirstOrDefault();
                var Province = db.Provinces.Where(x => x.ProvName == provinceUpdate.ProvName).FirstOrDefault();

                if (objectProvince != null)
                {
                    if (Province == null)
                    {
                        objectProvince.ProvName = provinceUpdate.ProvName;
                    }
                    else
                    {
                        toReturn.Message = "Duplicate record";
                    }



                    db.SaveChanges();

                    toReturn.Message = "Update Successful";
                }
                else
                {
                    toReturn.Message = "Record Not Found";
                }
            }

            catch (Exception)
            {
                toReturn.Message = "Update Unsuccessful";

            }


            return toReturn;
        }

        //Deleting a province 
        [HttpDelete]
        [Route("removeProvince")]
        public object removeProvince(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Province objectProvince = new Province();
            dynamic toReturn = new ExpandoObject();

            try
            {
                objectProvince = db.Provinces.Find(id);

                if (objectProvince == null)
                {
                    toReturn.Message = "Record Not Found";
                }
                else
                {
                    db.Provinces.Remove(objectProvince);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";
                }

            }
            catch (Exception)
            {
                toReturn = "Failed to delete province";
            }

            return toReturn;
        }



    }
}


/*//database
OrdraDBEntities db = new OrdraDBEntities();
// db.Configuration.ProxyCreationEnabled = false;

[System.Web.Http.Route("api/Province/getAllProvinces")]
[System.Web.Mvc.HttpGet]
public List<dynamic> getAllProvinces()
{
    try
    {
        db.Configuration.ProxyCreationEnabled = false;

        return getProvincesReturnList(db.Provinces.ToList());
    }
    catch (Exception)
    {
        throw;
    }

}

public List<dynamic> getProvincesReturnList(List<Province> forProvince)
{
    try
    {
        List<dynamic> dynamicProvinces = new List<dynamic>();
        foreach (Province prov in forProvince)
        {
            dynamic dynamicProvince = new ExpandoObject();
            dynamicProvince.ProvinceID = prov.ProvinceID;
            dynamicProvince.ProvName = prov.ProvName;
            dynamicProvinces.Add(dynamicProvince);
        }

        return dynamicProvinces;
    }
    catch (Exception)
    {
        throw;
    }

}

//get province by ID
[System.Web.Http.Route("api/Province/getProvinceByID/{ProvinceId}")]
[System.Web.Mvc.HttpGet]
public IHttpActionResult getProvinceById(string ProvinceId)
{
    Province objectProvince = new Province();
    int ID = Convert.ToInt32(ProvinceId);

    try
    {
        db.Configuration.ProxyCreationEnabled = false;
        objectProvince = db.Provinces.Find(ID);
        if (objectProvince == null)
        {
            return NotFound();
        }
    }
    catch (Exception)
    {
        throw;
    }
    return Ok(objectProvince);
}


//add a new province
[System.Web.Http.Route("api/Province/addProvince")]
[System.Web.Mvc.HttpPost]
public IHttpActionResult addProvince(Province data)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    try
    {
        db.Configuration.ProxyCreationEnabled = false;
        db.Provinces.Add(data);
        db.SaveChanges();
    }
    catch (Exception)
    {
        throw;
    }
    return Ok(data);
}

[System.Web.Http.Route("api/Province/updateProvince")]
[System.Web.Mvc.HttpPut]
public IHttpActionResult updateProvince(Province province)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }
    try
    {
        db.Configuration.ProxyCreationEnabled = false;
        Province objectProvince = new Province();
        objectProvince = db.Provinces.Find(province.ProvinceID);

        if (objectProvince != null)
        {
            objectProvince.ProvName = province.ProvName;
        }

        int i = this.db.SaveChanges();
    }
    catch (Exception)
    {
        throw;
    }
    return Ok(province);
}


//delete a province
[System.Web.Http.Route("api/Province/removeProvince")]
[System.Web.Mvc.HttpDelete]
public IHttpActionResult removeProvince(int id)
{
    db.Configuration.ProxyCreationEnabled = false;
    Province province = db.Provinces.Find(id);
    if (province == null)
    {
        return NotFound();
    }

    db.Provinces.Remove(province);
    db.SaveChanges();
    return Ok(province);
}

}
}*/
