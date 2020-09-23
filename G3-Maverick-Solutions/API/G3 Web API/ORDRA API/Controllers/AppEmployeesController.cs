using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using ORDRA_API.Models;
using System.Dynamic;
using System.Web.Http.Cors;
using ORDRA_API.Controllers;

namespace ORDRA_API.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    //[RoutePrefix("api/AppEmployee")]
    public class AppEmployeesController : ApiController
    {

        private OrdraDBEntities db = new OrdraDBEntities();

        // GET: api/AppEmployees
        public IQueryable<AppEmployee> GetAppEmployees()
        {
            return db.AppEmployees;
        }

        // GET: api/AppEmployees/5
        [ResponseType(typeof(AppEmployee))]
        public async Task<IHttpActionResult> GetAppEmployee(int id)
        {
            AppEmployee appEmployee = await db.AppEmployees.FindAsync(id);
            if (appEmployee == null)
            {
                return NotFound();
            }

            return Ok(appEmployee);
        }

        // PUT: api/AppEmployees/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutAppEmployee(int id, AppEmployee appEmployee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != appEmployee.EmployeeID)
            {
                return BadRequest();
            }

            db.Entry(appEmployee).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppEmployeeExists(id))
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

        // POST: api/AppEmployees
        [ResponseType(typeof(AppEmployee))]
        public async Task<object> PostAppEmployee(AppEmployee appEmployee)
        {
            var message = "nothing";
            if (!ModelState.IsValid)
            {
                message = "Error";
                return message;
            }
            //find app employee 
            AppEmployee findEmployee = await db.AppEmployees.Where(x => x.EmpName == appEmployee.EmpName && x.EmpSurname == appEmployee.EmpSurname).FirstOrDefaultAsync();

            //check for id
            if (findEmployee != null)
            {
                //fill in missing app employee
                findEmployee.EmpCellNo = appEmployee.EmpCellNo;
                findEmployee.EmpStartDate = appEmployee.EmpStartDate;
                findEmployee.EmpShiftsCompleted = appEmployee.EmpShiftsCompleted;
                await db.SaveChangesAsync();

                //find in user table 
                User findEmp = await db.Users.Where(x => x.UserName == findEmployee.EmpName && x.UserSurname == findEmployee.EmpSurname).FirstOrDefaultAsync();

                //fill in missing user cell
                findEmp.UserCell = appEmployee.EmpCellNo;
                await db.SaveChangesAsync();

                //find in emp table
                Employee findEmploy = await db.Employees.Where(x => x.UserID == findEmp.UserID).FirstOrDefaultAsync();
                await db.SaveChangesAsync();
                message = "Updated Records";
            }
            else
            {
                //createAppEmployee
                AppEmployee newAppemp = new AppEmployee();
                newAppemp.EmpName = appEmployee.EmpName;
                newAppemp.EmpSurname = appEmployee.EmpSurname;
                newAppemp.EmpEmail = appEmployee.EmpEmail;
                newAppemp.EmpCellNo = appEmployee.EmpCellNo;
                newAppemp.EmpStartDate = appEmployee.EmpStartDate;
                newAppemp.EmpShiftsCompleted = appEmployee.EmpShiftsCompleted;
                db.AppEmployees.Add(newAppemp);
                await db.SaveChangesAsync();

                //create User
                //Create User in User Table 

                /*var userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
                var manager = new Microsoft.AspNet.Identity.UserManager<ApplicationUser>(userStore);
                AccountModel model = new AccountModel();
                model.Role = "Cashier";
                var applicationUser = new ApplicationUser()
                {
                    UserName = appEmployee.EmpName,
                    Email = appEmployee.EmpEmail,
                    FirstName = appEmployee.EmpName,
                    LastName = appEmployee.EmpSurname,
                };*/

                dynamic userStore = new ExpandoObject();
                dynamic manager = new ExpandoObject();
                dynamic model = new ExpandoObject();
                model.role = "Cashier";
                dynamic applicationUser = new ExpandoObject();
                applicationUser.UserName = appEmployee.EmpName;
                applicationUser.Email = appEmployee.EmpEmail;
                applicationUser.FirstName = appEmployee.EmpName;
                applicationUser.LastName = appEmployee.EmpSurname;

                try
                {
                    var result = await manager.CreateAsync(applicationUser, "123456");
                    if (result.Succeeded)
                    {
                        await manager.AddToRoleAsync(applicationUser.Id, model.Role);

                        User newUser = new User();
                        newUser.UserTypeID = 2;
                        newUser.UserPassword = "123456";
                        newUser.UserName = appEmployee.EmpName;
                        newUser.UserSurname = appEmployee.EmpSurname;
                        newUser.UserEmail = appEmployee.EmpEmail;
                        newUser.UserCell = appEmployee.EmpCellNo;
                        db.Users.Add(newUser);
                        await db.SaveChangesAsync();

                        //find created User 
                        User findEmp2 = await db.Users.Where(x => x.UserName == appEmployee.EmpName && x.UserSurname == appEmployee.EmpSurname).FirstOrDefaultAsync();

                        //create Employee
                        Employee newEmp = new Employee();
                        newEmp.UserID = findEmp2.UserID;
                        newEmp.EmpStartDate = appEmployee.EmpStartDate;
                        newEmp.EmpShiftsCompleted = appEmployee.EmpShiftsCompleted;

                        db.Employees.Add(newEmp);
                        await db.SaveChangesAsync();
                        message = "Created Records";
                    }

                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return message;
        }

        // DELETE: api/AppEmployees/5
        [ResponseType(typeof(AppEmployee))]
        public async Task<IHttpActionResult> DeleteAppEmployee(int id)
        {
            AppEmployee appEmployee = await db.AppEmployees.FindAsync(id);
            if (appEmployee == null)
            {
                return NotFound();
            }

            db.AppEmployees.Remove(appEmployee);
            await db.SaveChangesAsync();

            return Ok(appEmployee);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool AppEmployeeExists(int id)
        {
            return db.AppEmployees.Count(e => e.EmployeeID == id) > 0;
        }
    }
}
