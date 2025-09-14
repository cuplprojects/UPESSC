using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;
using CsvHelper;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstitutesController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public InstitutesController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/Institutes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Institute>>> GetInstitutes()
        {
            return await _context.Institutes.ToListAsync();
        }

        // GET: api/Institutes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Institute>> GetInstitute(int id)
        {
            var institute = await _context.Institutes.FindAsync(id);

            if (institute == null)
            {
                return NotFound();
            }

            return institute;
        }

        // PUT: api/Institutes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutInstitute(int id, Institute institute)
        {
            if (id != institute.IID)
            {
                return BadRequest();
            }

            _context.Entry(institute).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InstituteExists(id))
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

        [HttpPost("Import")]
        public async Task<IActionResult> ImportInstitutes([FromForm] InstituteImport instituteImport)
        {
            var file = instituteImport.formFile;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var importedInstitutes = new List<Institute>();

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
            }))
            {
                importedInstitutes = csv.GetRecords<Institute>().ToList();
            }

            // Validate data (skip rows with missing InstituteName)
            var validInstitutes = importedInstitutes
                .Where(i => !string.IsNullOrWhiteSpace(i.InstituteName))
                .ToList();

            // Skip duplicates based on InstituteName
            var existingNames = await _context.Institutes
                .Select(i => i.InstituteName)
                .ToListAsync();

            var newInstitutes = validInstitutes
                .Where(i => !existingNames.Contains(i.InstituteName))
                .ToList();

            if (!newInstitutes.Any())
                return Ok(new { Message = "No new institutes to import." });

            _context.Institutes.AddRange(newInstitutes);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ImportedCount = newInstitutes.Count,
                SkippedCount = validInstitutes.Count - newInstitutes.Count,
                Message = "Institutes imported successfully."
            });
        }

        public class InstituteImport
        {
            public IFormFile formFile { get; set; }
        }

        // POST: api/Institutes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Institute>> PostInstitute(Institute institute)
        {
            _context.Institutes.Add(institute);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetInstitute", new { id = institute.IID }, institute);
        }

        [HttpPost("GetInsitutesbyUserID")]
        public async Task<ActionResult<IEnumerable<Institute>>> GetInsitutesbyUserID(InstitutGetRequest institutGetRequest)
        {
            var Candidate = await _context.Candidates.FindAsync(institutGetRequest.CID);
            if (Candidate == null)
            {
                return NotFound("Candidate not found.");
            }

            var isFemale = Candidate.Gender == "Female";
            var candidateCategory = Candidate.Category_Code;

            var subject = await _context.Subjects.FirstOrDefaultAsync(s => s.SubjectNameEnglish == Candidate.Subject_Name);
            if (subject == null)
            {
                return NotFound("Subject not found.");
            }
            var subjectCode = subject.SubjectCode;

            IQueryable<Institute> query = _context.Institutes;

            // Filter out female institutes if candidate is NOT female
            if (!isFemale)
            {
                query = query.Where(i => i.isFemaleInstitute == false);
            }

            // Filter by category + subject
            if (!string.IsNullOrEmpty(candidateCategory))
            {
                if (candidateCategory != "GEN")
                {
                    query = query.Where(i => i.Category == candidateCategory || i.Category == "GEN");
                }
                else
                {
                    query = query.Where(i => i.Category == "GEN");
                }
            }

            query = query.Where(i => i.SubjectCode == subjectCode);

            // ✅ Ordering:
            // 1. If candidate is female → female institutes first
            // 2. Institutes with candidate's category first
            if (isFemale)
            {
                query = query
                    .OrderByDescending(i => i.isFemaleInstitute) // true first, false later
                    .ThenBy(i => i.Category != candidateCategory); // candidate category first, then others
            }
            else
            {
                query = query
                    .OrderBy(i => i.Category != candidateCategory); // candidate category first for non-female
            }

            var institutes = await query.ToListAsync();
            return institutes;
        }


        // DELETE: api/Institutes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstitute(int id)
        {
            var institute = await _context.Institutes.FindAsync(id);
            if (institute == null)
            {
                return NotFound();
            }

            _context.Institutes.Remove(institute);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InstituteExists(int id)
        {
            return _context.Institutes.Any(e => e.IID == id);
        }
    }

    public class InstitutGetRequest
    {
        public int CID { get; set; }
    }
}
