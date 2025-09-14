using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExaminationMastersController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public ExaminationMastersController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/ExaminationMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExaminationMasters>>> GetExaminationMasters()
        {
            return await _context.ExaminationMasters.ToListAsync();
        }

        // GET: api/ExaminationMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExaminationMasters>> GetExaminationMasters(int id)
        {
            var examinationMasters = await _context.ExaminationMasters.FindAsync(id);

            if (examinationMasters == null)
            {
                return NotFound();
            }

            return examinationMasters;
        }

        // PUT: api/ExaminationMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExaminationMasters(int id, ExaminationMasters examinationMasters)
        {
            if (id != examinationMasters.ExaminationID)
            {
                return BadRequest();
            }

            _context.Entry(examinationMasters).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExaminationMastersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/ExaminationMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExaminationMasters>> PostExaminationMasters(ExaminationMasters examinationMasters)
        {
            _context.ExaminationMasters.Add(examinationMasters);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExaminationMasters", new { id = examinationMasters.ExaminationID }, examinationMasters);
        }

        // DELETE: api/ExaminationMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExaminationMasters(int id)
        {
            var examinationMasters = await _context.ExaminationMasters.FindAsync(id);
            if (examinationMasters == null)
            {
                return NotFound();
            }

            _context.ExaminationMasters.Remove(examinationMasters);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExaminationMastersExists(int id)
        {
            return _context.ExaminationMasters.Any(e => e.ExaminationID == id);
        }
    }
}
