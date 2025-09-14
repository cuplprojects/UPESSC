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
    public class CandidateInstitutePreferencesController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public CandidateInstitutePreferencesController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/CandidateInstitutePreferences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CandidateInstitutePreference>>> GetCandidateInstitutePreferences()
        {
            return await _context.CandidateInstitutePreferences.ToListAsync();
        }

        // GET: api/CandidateInstitutePreferences/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CandidateInstitutePreference>> GetCandidateInstitutePreference(int id)
        {
            var candidateInstitutePreference = await _context.CandidateInstitutePreferences.FindAsync(id);

            if (candidateInstitutePreference == null)
            {
                return NotFound();
            }

            return candidateInstitutePreference;
        }

        // PUT: api/CandidateInstitutePreferences/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCandidateInstitutePreference(int id, CandidateInstitutePreference candidateInstitutePreference)
        {
            if (id != candidateInstitutePreference.CIPID)
            {
                return BadRequest();
            }

            _context.Entry(candidateInstitutePreference).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidateInstitutePreferenceExists(id))
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

        // POST: api/CandidateInstitutePreferences
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<CandidateInstitutePreference>> PostCandidateInstitutePreference(CandidateInstitutePreference candidateInstitutePreference)
        {
            // ✅ Check how many preferences this candidate already has
            var existingCount = await _context.CandidateInstitutePreferences
                .CountAsync(c => c.CID == candidateInstitutePreference.CID);

            if (existingCount >= 5)
            {
                return BadRequest("You can select a maximum of 5 institute preferences.");
            }

            _context.CandidateInstitutePreferences.Add(candidateInstitutePreference);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCandidateInstitutePreference",
                new { id = candidateInstitutePreference.CIPID },
                candidateInstitutePreference);
        }

        // DELETE: api/CandidateInstitutePreferences/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidateInstitutePreference(int id)
        {
            var candidateInstitutePreference = await _context.CandidateInstitutePreferences.FindAsync(id);
            if (candidateInstitutePreference == null)
            {
                return NotFound();
            }

            _context.CandidateInstitutePreferences.Remove(candidateInstitutePreference);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidateInstitutePreferenceExists(int id)
        {
            return _context.CandidateInstitutePreferences.Any(e => e.CIPID == id);
        }
    }
}
