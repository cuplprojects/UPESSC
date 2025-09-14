using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;
using CsvHelper;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectSchedulesController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public SubjectSchedulesController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/SubjectSchedules
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectSchedule>>> GetSubjectSchedules()
        {
            return await _context.SubjectSchedules.ToListAsync();
        }

        // GET: api/SubjectSchedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectSchedule>> GetSubjectSchedule(int id)
        {
            var subjectSchedule = await _context.SubjectSchedules.FindAsync(id);

            if (subjectSchedule == null)
            {
                return NotFound();
            }

            return subjectSchedule;
        }

        // PUT: api/SubjectSchedules/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubjectSchedule(int id, SubjectSchedule subjectSchedule)
        {
            if (id != subjectSchedule.SSID)
            {
                return BadRequest();
            }

            _context.Entry(subjectSchedule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubjectScheduleExists(id))
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



        // POST: api/SubjectSchedules
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SubjectSchedule>> PostSubjectSchedule(SubjectSchedule subjectSchedule)
        {
            _context.SubjectSchedules.Add(subjectSchedule);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubjectSchedule", new { id = subjectSchedule.SSID }, subjectSchedule);
        }

        [HttpPost("Import")]
        [RequestFormLimits(MultipartBodyLengthLimit = 200_000_000)] // allow large files
        [RequestSizeLimit(200_000_000)]
        public async Task<IActionResult> ImportSubjectSchedules([FromForm] SubjectScheduleImport subjectScheduleImport)
        {
            var file = subjectScheduleImport.formFile;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var importedSchedules = new List<SubjectSchedule>();

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
            }))
            {
                importedSchedules = csv.GetRecords<SubjectSchedule>().ToList();
            }

            // ✅ Basic Validation: filter out invalid SubjectID or invalid Date
            var validSchedules = importedSchedules
                .Where(s => s.SubjectCode > 0 && s.Date != default)
                .ToList();

            // ✅ Avoid duplicates: skip if same SubjectID + Date already exists
            var existingSchedules = await _context.SubjectSchedules
                .Select(s => new { s.SubjectCode, s.Date })
                .ToListAsync();

            var newSchedules = validSchedules
                .Where(s => !existingSchedules.Any(es => es.SubjectCode == s.SubjectCode && es.Date.Date == s.Date.Date))
                .ToList();

            if (!newSchedules.Any())
                return Ok(new { Message = "No new schedules to import." });

            _context.SubjectSchedules.AddRange(newSchedules);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ImportedCount = newSchedules.Count,
                SkippedCount = validSchedules.Count - newSchedules.Count,
                Message = "Subject schedules imported successfully."
            });
        }

        // DELETE: api/SubjectSchedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubjectSchedule(int id)
        {
            var subjectSchedule = await _context.SubjectSchedules.FindAsync(id);
            if (subjectSchedule == null)
            {
                return NotFound();
            }

            _context.SubjectSchedules.Remove(subjectSchedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubjectScheduleExists(int id)
        {
            return _context.SubjectSchedules.Any(e => e.SSID == id);
        }
    }

    public class SubjectScheduleImport
    {
        public IFormFile formFile { get; set; }
    }
}
