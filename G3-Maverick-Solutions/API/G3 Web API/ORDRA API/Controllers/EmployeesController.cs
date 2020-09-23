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
            catch (Exception error)
            {
                toReturn.Message = "Something Went Wrong" + error.Message;
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
                    toReturn.Error = "There are no employees";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong" + error.Message;
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
                    toReturn.Error = "Employee Profile Not Found";
                }
                else
                {

                    toReturn.Employee = searchEmployee(employee.User.UserName, employee.User.UserSurname);
                }

            }
            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong: " + error.Message;
            }

            return toReturn;
        }

        [HttpPost]
        [Route("createEmployee")]
        public dynamic createEmployee(Employee employee)
        {
            db.Configuration.ProxyCreationEnabled = false;
            dynamic toReturn = new ExpandoObject();
            ////try
            ///{
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

                    toReturn.Error = "Employee Profile Succesfully Created";
                }
                else
                {
                    toReturn.Error = "Employee Profile Not Found";
                }
            }
            else
            {
                toReturn.Error = "Employee already exists ";
            }
            
            /* }
             catch (Exception error)
             {
                 toReturn = "Something Went Wrong: " + error.Message;
             }*/

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
                    toReturn.Error = "Employee Profile Not Found";
                }
            }
            catch (Exception error)
            {
                toReturn.Error = "Something Went Wrong: " + error.Message;
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
                    toReturn.Error = "Employee profile Not Found";
                }
                else
                {
                     db.Employees.Remove(employee);
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