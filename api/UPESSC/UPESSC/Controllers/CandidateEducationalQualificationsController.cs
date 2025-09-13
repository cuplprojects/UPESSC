using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;
using UPESSC.Models.DTO;

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
        public async Task<ActionResult<CandidateEducationalQualification>> PostCandidateEducationalQualification(CandidateEducationQualificationDTO ceq)
        {
            if (ceq == null)
            {
                return BadRequest("Please enter valid details");
            }

            // Check for existing record (based on CID + Examination)
            var existingRecord = await _context.CandidateEducationalQualifications
                .FirstOrDefaultAsync(x => x.CID == ceq.CID && x.Examination == ceq.Examination);

            // Prepare file upload paths
            string marksheetFullPath = "";
            if (ceq.MarkSheetFile != null)
            {
                var marksheetDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "marksheets");
                if (!Directory.Exists(marksheetDirectory))
                {
                    Directory.CreateDirectory(marksheetDirectory);
                }
                var marksheetPath = Path.Combine("uploads/marksheets", $"{ceq.RollNumber}_{ceq.Examination}_Marksheet{Path.GetExtension(ceq.MarkSheetFile.FileName)}");
                marksheetFullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", marksheetPath);

                using (var stream = new FileStream(marksheetFullPath, FileMode.Create))
                {
                    await ceq.MarkSheetFile.CopyToAsync(stream);
                }
            }

            string certificateFullPath = "";
            if (ceq.CertificateFile != null)
            {
                var certificateDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "Certificate");
                if (!Directory.Exists(certificateDirectory))
                {
                    Directory.CreateDirectory(certificateDirectory);
                }
                var certificatePath = Path.Combine("uploads/Certificate", $"{ceq.RollNumber}_{ceq.Examination}_Certificate{Path.GetExtension(ceq.CertificateFile.FileName)}");
                certificateFullPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", certificatePath);

                using (var stream = new FileStream(certificateFullPath, FileMode.Create))
                {
                    await ceq.CertificateFile.CopyToAsync(stream);
                }
            }

            if (existingRecord != null)
            {
                // Update existing record
                existingRecord.BoardOrUniversity = ceq.BoardOrUniversity;
                existingRecord.YearOfPassing = ceq.YearOfPassing;
                existingRecord.RollNumber = ceq.RollNumber;
                existingRecord.MarksObtained = ceq.MarksObtained;
                existingRecord.TotalMarks = ceq.TotalMarks;
                existingRecord.Percentage = ceq.Percentage;
                existingRecord.Grade = ceq.Grade;
                existingRecord.Subject = ceq.Subject;
                if (ceq.MarkSheetFile != null) existingRecord.MarkSheetpath = marksheetFullPath;
                if (ceq.CertificateFile != null) existingRecord.CertificatePath = certificateFullPath;

                await _context.SaveChangesAsync();
                return Ok(existingRecord);
            }
            else
            {
                // Insert new record
                var candidateEducationalQualificationEntity = new CandidateEducationalQualification
                {
                    CID = ceq.CID,
                    Examination = ceq.Examination,
                    BoardOrUniversity = ceq.BoardOrUniversity,
                    YearOfPassing = ceq.YearOfPassing,
                    RollNumber = ceq.RollNumber,
                    MarksObtained = ceq.MarksObtained,
                    TotalMarks = ceq.TotalMarks,
                    Percentage = ceq.Percentage,
                    Grade = ceq.Grade,
                    Subject = ceq.Subject,
                    MarkSheetpath = ceq.MarkSheetFile != null ? marksheetFullPath : "",
                    CertificatePath = ceq.CertificateFile != null ? certificateFullPath : ""
                };

                _context.CandidateEducationalQualifications.Add(candidateEducationalQualificationEntity);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCandidateEducationalQualification", new { id = candidateEducationalQualificationEntity.CEQID }, candidateEducationalQualificationEntity);
            }
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
