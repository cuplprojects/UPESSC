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
    public class ExpertsMastersController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public ExpertsMastersController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/ExpertsMasters
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExpertsMaster>>> GetExpertsMasters()
        {
            return await _context.ExpertsMasters.ToListAsync();
        }

        // GET: api/ExpertsMasters/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ExpertsMaster>> GetExpertsMaster(int id)
        {
            var expertsMaster = await _context.ExpertsMasters.FindAsync(id);

            if (expertsMaster == null)
            {
                return NotFound();
            }

            return expertsMaster;
        }

        // PUT: api/ExpertsMasters/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutExpertsMaster(int id, ExpertsMaster expertsMaster)
        {
            if (id != expertsMaster.EMID)
            {
                return BadRequest();
            }

            _context.Entry(expertsMaster).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExpertsMasterExists(id))
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

        // POST: api/ExpertsMasters
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ExpertsMaster>> PostExpertsMaster(ExpertsMaster expertsMaster)
        {
            _context.ExpertsMasters.Add(expertsMaster);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExpertsMaster", new { id = expertsMaster.EMID }, expertsMaster);
        }

        // DELETE: api/ExpertsMasters/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExpertsMaster(int id)
        {
            var expertsMaster = await _context.ExpertsMasters.FindAsync(id);
            if (expertsMaster == null)
            {
                return NotFound();
            }

            _context.ExpertsMasters.Remove(expertsMaster);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExpertsMasterExists(int id)
        {
            return _context.ExpertsMasters.Any(e => e.EMID == id);
        }
    }
}
