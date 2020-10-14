using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Net.Http;
using System.Web.Http;
using System.Dynamic;
using System.Data.Entity;
using System.Web.Http.Cors;
using ORDRA_API.Models;
using Microsoft.Ajax.Utilities;
using System.IO;

namespace ORDRA_API.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("API/Employee")]
    public class EmployeesController : ApiController
    {
        OrdraDBEntities db = new OrdraDBEntities();


        //Search Employee Using Thier Name And Surname
        [HttpGet]
        [Route("searchEmployee")]
        public object searchEmployee(string name, string surname)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.user = new ExpandoObject();
            toReturn.employee = new ExpandoObject();


            try
            {
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

                }
                else
                {
                    toReturn.Message = "User Record Not Found";
                }


            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get Employee record" ;
            }

            return toReturn;
        }

        //get all
        [HttpGet]
        [Route("getAll")]
        public object getAll()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            toReturn.user = new ExpandoObject();
            toReturn.employee = new ExpandoObject();


            try
            {
                List<Employee> employees = db.Employees.ToList();
                List<User> userList = new List<User>();
                List<Employee> employeeList = new List<Employee>();

                foreach (var emp in employees)
                {
                    if (emp != null)
                    {

                        //Set Employee Details To Return Object
                       
                        Employee empDetails = new Employee();
                        empDetails.UserID = emp.UserID;
                        empDetails.EmployeeID = emp.EmployeeID;
                        empDetails.EmpShiftsCompleted = emp.EmpShiftsCompleted;
                        empDetails.EmpStartDate= emp.EmpStartDate;
                        employeeList.Add(empDetails);

                        User user = db.Users.Where(z => z.UserID == emp.UserID).FirstOrDefault();
                        if (user != null)
                        {


                            //Set user Details To Return Object
                            User userDetails = new User();
                            userDetails.UserID = user.UserID;
                            userDetails.UserName = user.UserName;
                            userDetails.UserSurname = user.UserSurname;
                            userDetails.UserEmail= user.UserEmail;
                            userDetails.UserCell = user.UserCell;
                            userList.Add(userDetails);
                        }
                        else
                        {
                            toReturn.Message = "Employee Record Not Found";
                        }

                    }
                    else
                    {
                        toReturn.Message = "User Record Not Found";
                    }
                }

                toReturn.user = userList;
                toReturn.employee = employeeList;
                
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get Employee records" ;
            }

            return toReturn;
        }

        //getting employee image 
        [HttpGet]
        [Route("getImage")]
        public object getImage(int employeeID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
                
                EmployeePicture image = db.EmployeePictures.Where(z => z.EmployeeID == employeeID).FirstOrDefault(); //
                if (image != null)
                {
                   // string path =  image.ImgName;
                    string path = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("~/Images"), image.ImgName);
                    toReturn.Image = path;
                        //get pAppDomain.CurrentDomain.BaseDirectory + image.ImgName;
                  
                }
                else
                {
                    toReturn.Message = "Image not available";
                }
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to get image";
            }

            return toReturn;
        }


        //Getting all Employees
        [HttpGet]
        [Route("getAllEmployees")]
        public object getAllEmployees()
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();

            try
            {
                toReturn.Employees = db.Users.Include(x => x.Employees).Include(x => x.Employees).ToList();
                if (toReturn.Employees == null)
                {
                    toReturn.Message = "There are no employees";
                }
            }
            catch (Exception )
            {
                toReturn.Message = "Failed to get all employees";
            }

            return toReturn;

        }

        [HttpGet]
        [Route("getEmployee/{id}")]

        public object getEmployee(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;

            Employee employee = new Employee();
            dynamic toReturn = new ExpandoObject();

            try
            {
                employee = db.Employees.Include(x => x.User).Where(x => x.EmployeeID == id).FirstOrDefault();

                if (employee == null)
                {
                    toReturn.Message= "Employee Profile Not Found";
                }
                else
                {

                    toReturn.Employee = searchEmployee(employee.User.UserName, employee.User.UserSurname);
                }

            }
            catch (Exception )
            {
                toReturn.Message = "Failed to get employee record " ;
            }

            return toReturn;
        }

        [HttpPost]
        [Route("createEmployee")]
        public dynamic createEmployee(Employee employee)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            try
            {
            //Get User Details From Input Parameter
            User user = db.Users.Where(x => x.UserID == employee.UserID).FirstOrDefault();
            Employee dupObj = db.Employees.Where(z => z.UserID == employee.UserID).FirstOrDefault();
            if (dupObj == null)
            {
                //Set employee Details To Return object
                Employee employeeDetails = new Employee();
                if (employee != null)
                {
                    employeeDetails.User = user;
                    employeeDetails.EmpStartDate = employee.EmpStartDate;
                    employeeDetails.EmpShiftsCompleted = employee.EmpShiftsCompleted;


                    db.Employees.Add(employeeDetails);
                    db.SaveChanges();

                    toReturn.Message = "Employee Profile Succesfully Created";
                }
                else
                {
                    toReturn.Message = "Employee Profile Not Found";
                }
            }
            else
            {
                toReturn.Message = "Employee already exists ";
            }
            
            }
             catch (Exception )
             {
                 toReturn = "Failed to create an employee record " ;
             }

            return toReturn;
        }

        [HttpPut]
        [Route("updateEmployee")]
        public dynamic updateEmployee(Employee employee)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            Employee employeeDetails = new Employee();

            try
            {


                //Set Manager Details To Return object
                employeeDetails = db.Employees.Where(x => x.EmployeeID == employee.EmployeeID).FirstOrDefault();
                if (employeeDetails != null)
                {
                    employeeDetails.EmpStartDate = employee.EmpStartDate;
                    employeeDetails.EmpShiftsCompleted = employee.EmpShiftsCompleted;
                    db.SaveChanges();
                    toReturn.Message = "Update Successful";
                }
                else
                {
                    toReturn.Message = "Employee Profile Not Found";
                }
            }
            catch (Exception)
            {
                toReturn.Message = "Failed to update employee record" ;
            }

            return toReturn;
        }

        [HttpDelete]
        [Route("deleteEmployee")]
        public dynamic deleteEmployee(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
           Employee employee = new Employee();

            try
            {
                employee = db.Employees.Where(x => x.EmployeeID == id).FirstOrDefault();

                if (employee == null)
                {
                    toReturn.Message = "Employee profile Not Found";
                }
                else
                {
                     db.Employees.Remove(employee);
                    db.SaveChanges();
                    toReturn.Message = "Delete Successful";

                }
            }
            catch (Exception )
            {
                toReturn.Message = "Failed to delete employee record " ;
            }

            return toReturn;
        }

        [HttpPost]
        [Route("uploadImage")]
        public HttpResponseMessage uploadImage(int employeeID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                string imageName = null;
                var httpRequest = HttpContext.Current.Request;

                //upload image
                var postedFile = httpRequest.Files["image"];

                //create custom filename
                imageName = new string(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                imageName = imageName + DateTime.Now.ToString("yymmssff") + Path.GetExtension(postedFile.FileName);
                var filePath = HttpContext.Current.Server.MapPath("~/Images/" + imageName);
                postedFile.SaveAs(filePath);

                Employee employee = db.Employees.Where(z => z.EmployeeID == employeeID).FirstOrDefault();
                User user = db.Users.Where(z => z.UserID == employee.UserID).FirstOrDefault();
                //save to db
                using (OrdraDBEntities dbs = new OrdraDBEntities())
                {
                    EmployeePicture image = new EmployeePicture()
                    {
                        ImgCaption = user.UserName +" "+ user.UserSurname + " Img" ,//httpRequest["ImageCaption"],
                        ImgName = imageName,
                        EmployeeID = employeeID,
                    };
                    db.EmployeePictures.Add(image);
                    db.SaveChanges();
                    
                }
            }
            catch (Exception error)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error in saving the image: " + error);
            }

            return Request.CreateResponse(HttpStatusCode.Created, "Saved successfully");
        }

        [HttpPost]
        [Route("uploadCv")]
        public HttpResponseMessage uploadCv(int employeeID)
        {
            db.Configuration.ProxyCreationEnabled = false;
            try
            {
                string imageName = null;
                var httpRequest = HttpContext.Current.Request;

                //upload image
                var postedFile = httpRequest.Files["image"];

                //create custom filename
                imageName = new string(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                imageName = imageName + DateTime.Now.ToString("yymmssff") + Path.GetExtension(postedFile.FileName);
                var filePath = HttpContext.Current.Server.MapPath("~/Images/" + imageName);
                postedFile.SaveAs(filePath);

                Employee employee = db.Employees.Where(z => z.EmployeeID == employeeID).FirstOrDefault();
                User user = db.Users.Where(z => z.UserID == employee.UserID).FirstOrDefault();
                //save to db
                using (OrdraDBEntities dbs = new OrdraDBEntities())
                {
                    EmployeeCV image = new EmployeeCV()
                    {
                        CVCaption = user.UserName + " " + user.UserSurname + " CV",//httpRequest["ImageCaption"],
                        CVName = imageName,
                        EmployeeID = employeeID,
                    };
                    db.EmployeeCVs.Add(image);
                    db.SaveChanges();

                }
            }
            catch (Exception error)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error in saving the image: " + error);
            }

            return Request.CreateResponse(HttpStatusCode.Created, "Saved successfully");
        }


        /*[HttpPost]
        [Route("uploadCv")]
        public HttpResponseMessage uploadCv(int employeeID)
        {
            try
            {
                string cvName = null;
                var httpRequest = HttpContext.Current.Request;

                //upload cv
                var postedFile = httpRequest.Files["file"];

                //create custom filename
                cvName = new string(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
                cvName = cvName + DateTime.Now.ToString("yymmssff") + Path.GetExtension(postedFile.FileName);
                var filePath = HttpContext.Current.Server.MapPath("~/Images/" + cvName);
                //postedFile.SaveAs(Path.Combine(filePath, postedFile.FileName));
                postedFile.SaveAs(filePath);

                Employee employee = db.Employees.Where(z => z.EmployeeID == employeeID).FirstOrDefault();
                User user = db.Users.Where(z => z.UserID == employee.UserID).FirstOrDefault();
                //save to db
                using (OrdraDBEntities dbs = new OrdraDBEntities())
                {
                    EmployeeCV cv = new EmployeeCV()
                    {
                        CVCaption = user.UserName + " " + user.UserSurname + "CV",//httpRequest["CvCaption"],
                        CVName = cvName,
                        EmployeeID = employeeID,
                    };
                    db.EmployeeCVs.Add(cv);
                    db.SaveChanges();
                }
               
            }
            catch(Exception )
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error in saving the image: ");
            }
            return Request.CreateResponse(HttpStatusCode.Created, "CV Saved successfully");
        }*/


        [HttpGet]
        [Route("getCvs")]
        public dynamic getCVs(int employeeID)
        {
            dynamic toReturn = new ExpandoObject();
            try
            {
                toReturn.Cv = db.EmployeeCVs.Where(z => z.EmployeeID == employeeID).ToList();
            }
            catch
            {
                toReturn.Message = "CV not found";
            }
            return toReturn;
        }

        [HttpGet]
        [Route("getImages")]
        public dynamic getImages(int employeeID)
        {
            dynamic toReturn = new ExpandoObject();
            try
            {
                List<EmployeePicture> imgList = new List<EmployeePicture>();
                List<EmployeePicture> imgs = db.EmployeePictures.Where(z => z.EmployeeID == employeeID).ToList();
                foreach(var img in imgs)
                {
                    dynamic obj = new ExpandoObject();
                    obj.ImgCaption = img.ImgCaption;
                    obj.ImgName = img.ImgName;
                    imgList.Add(obj);
                }
                toReturn.Img = imgList;
            }
            catch
            {
                toReturn.Message = "Images not found";
            }
            return toReturn;
        }

        /*// GET: api/Employees
        public IQueryable<Employee> GetEmployees()
        {
            return db.Employees;
        }

        // GET: api/Employees/5
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> GetEmployee(int id)
        {
            Employee employee = await db.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        // PUT: api/Employees/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutEmployee(int id, Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != employee.EmployeeID)
            {
                return BadRequest();
            }

            db.Entry(employee).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Employees
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> PostEmployee(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Employees.Add(employee);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = employee.EmployeeID }, employee);
        }

        // DELETE: api/Employees/5
        [ResponseType(typeof(Employee))]
        public async Task<IHttpActionResult> DeleteEmployee(int id)
        {
            Employee employee = await db.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            await db.SaveChangesAsync();

            return Ok(employee);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(int id)
        {
            return db.Employees.Count(e => e.EmployeeID == id) > 0;
        }*/
    }
}