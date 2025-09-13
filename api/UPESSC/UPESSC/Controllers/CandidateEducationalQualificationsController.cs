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
    public class CandidateEducationalQualificationsController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public CandidateEducationalQualificationsController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/CandidateEducationalQualifications
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateEducationalQualification>>> GetCandidateEducationalQualifications()
        {
            return await _context.CandidateEducationalQualifications.ToListAsync();
        }

        // GET: api/CandidateEducationalQualifications/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CandidateEducationalQualification>> GetCandidateEducationalQualification(int id)
        {
            var candidateEducationalQualification = await _context.CandidateEducationalQualifications.FindAsync(id);

            if (candidateEducationalQualification == null)
            {
                return NotFound();
            }

            return candidateEducationalQualification;
        }

        // PUT: api/CandidateEducationalQualifications/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCandidateEducationalQualification(int id, CandidateEducationalQualification candidateEducationalQualification)
        {
            if (id != candidateEducationalQualification.CEQID)
            {
                return BadRequest();
            }

            _context.Entry(candidateEducationalQualification).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidateEducationalQualificationExists(id))
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

        // POST: api/CandidateEducationalQualifications
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CandidateEducationalQualification>> PostCandidateEducationalQualification(CandidateEducationalQualification candidateEducationalQualification)
        {
            _context.CandidateEducationalQualifications.Add(candidateEducationalQualification);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCandidateEducationalQualification", new { id = candidateEducationalQualification.CEQID }, candidateEducationalQualification);
        }

        // DELETE: api/CandidateEducationalQualifications/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidateEducationalQualification(int id)
        {
            var candidateEducationalQualification = await _context.CandidateEducationalQualifications.FindAsync(id);
            if (candidateEducationalQualification == null)
            {
                return NotFound();
            }

            _context.CandidateEducationalQualifications.Remove(candidateEducationalQualification);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidateEducationalQualificationExists(int id)
        {
            return _context.CandidateEducationalQualifications.Any(e => e.CEQID == id);
        }
    }
}
