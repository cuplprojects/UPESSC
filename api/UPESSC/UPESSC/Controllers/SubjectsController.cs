using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Editing;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;
using CsvHelper;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public SubjectsController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/Subjects
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subject>>> GetSubjects()
        {
            return await _context.Subjects.ToListAsync();
        }

        // GET: api/Subjects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Subject>> GetSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);

            if (subject == null)
            {
                return NotFound();
            }

            return subject;
        }

        [HttpPost("Import")]
        public async Task<IActionResult> ImportSubjects(SubjectImport subjectImport)
        {
            var formFile = subjectImport.formFile;
            if (formFile == null || formFile.Length == 0)
                return BadRequest("No file uploaded.");

            var importedSubjects = new List<Subject>();

            using (var stream = formFile.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
            }))
            {
                importedSubjects = csv.GetRecords<Subject>().ToList();
            }

            // Filter duplicates by SubjectCode (existing in DB)
            var existingCodes = await _context.Subjects
                .Select(s => s.SubjectCode)
                .ToListAsync();

            var newSubjects = importedSubjects
                .Where(s => !existingCodes.Contains(s.SubjectCode))
                .ToList();

            if (!newSubjects.Any())
                return Ok(new { Message = "No new subjects to import." });

            _context.Subjects.AddRange(newSubjects);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ImportedCount = newSubjects.Count,
                SkippedCount = importedSubjects.Count - newSubjects.Count,
                Message = "Subjects imported successfully."
            });
        }

        public class SubjectImport
        {
            public IFormFile formFile { get; set; }
        }

        // PUT: api/Subjects/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubject(int id, Subject subject)
        {
            if (id != subject.SID)
            {
                return BadRequest();
            }

            _context.Entry(subject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectExists(id))
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

        // POST: api/Subjects
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Subject>> PostSubject(Subject subject)
        {
            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubject", new { id = subject.SID }, subject);
        }

        // DELETE: api/Subjects/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
            {
                return NotFound();
            }

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectExists(int id)
        {
            return _context.Subjects.Any(e => e.SID == id);
        }
    }
}
