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

namespace ORDRA_API.Controllers
{
    public class Location_StatusController : ApiController
    {
        private OrdraDBEntities db = new OrdraDBEntities();

        // GET: api/Location_Status
        public IQueryable<Location_Status> GetLocation_Status()
        {
            return db.Location_Status;
        }

        // GET: api/Location_Status/5
        [ResponseType(typeof(Location_Status))]
        public async Task<IHttpActionResult> GetLocation_Status(int id)
        {
            Location_Status location_Status = await db.Location_Status.FindAsync(id);
            if (location_Status == null)
            {
                return NotFound();
            }

            return Ok(location_Status);
        }

        // PUT: api/Location_Status/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutLocation_Status(int id, Location_Status location_Status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != location_Status.LocationStatusID)
            {
                return BadRequest();
            }

            db.Entry(location_Status).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Location_StatusExists(id))
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

        // POST: api/Location_Status
        [ResponseType(typeof(Location_Status))]
        public async Task<IHttpActionResult> PostLocation_Status(Location_Status location_Status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Location_Status.Add(location_Status);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = location_Status.LocationStatusID }, location_Status);
        }

        // DELETE: api/Location_Status/5
        [ResponseType(typeof(Location_Status))]
        public async Task<IHttpActionResult> DeleteLocation_Status(int id)
        {
            Location_Status location_Status = await db.Location_Status.FindAsync(id);
            if (location_Status == null)
            {
                return NotFound();
            }

            db.Location_Status.Remove(location_Status);
            await db.SaveChangesAsync();

            return Ok(location_Status);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool Location_StatusExists(int id)
        {
            return db.Location_Status.Count(e => e.LocationStatusID == id) > 0;
        }
    }
}