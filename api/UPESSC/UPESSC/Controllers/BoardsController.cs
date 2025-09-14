using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing.Matching;
using Microsoft.EntityFrameworkCore;
using UPESSC.Data;
using UPESSC.Models;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BoardsController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public BoardsController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/Boards
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Boards>>> GetBoards()
        {
            return await _context.Boards.ToListAsync();
        }

        // GET: api/Boards/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Boards>> GetBoards(int id)
        {
            var boards = await _context.Boards.FindAsync(id);

            if (boards == null)
            {
                return NotFound();
            }

            return boards;
        }

        // PUT: api/Boards/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBoards(int id, Boards boards)
        {
            if (id != boards.BID)
            {
                return BadRequest();
            }

            _context.Entry(boards).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BoardsExists(id))
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

        // POST: api/Boards
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost("AllocateBoards")]
        //public async Task<IActionResult> AllocateBoards([FromBody] BoardAllocationRequest request)
        //{
        //    var chairmen = await _context.BoardCMs.ToListAsync();
        //    var experts = await _context.ExpertsMasters.ToListAsync();
        //    var subjectSchedules = await _context.SubjectSchedules
        //        .OrderBy(s => s.Date)
        //        .ToListAsync();

        //    if (chairmen.Count < 13 || experts.Count < 36)
        //    {
        //        return BadRequest("Not enough chairmen or experts to allocate.");
        //    }

        //    var rnd = new Random();

        //    // ✅ Take only first 3200 candidates (deterministic ordering)
        //    var allCandidates = await _context.Candidates
        //        .OrderBy(c => c.CID)
        //        .Take(3200)
        //        .ToListAsync();

        //    var boardsList = new List<Boards>();
        //    var updatedCandidates = new List<Candidate>();
        //    var unallocatedCandidates = new List<Candidate>();

        //    foreach (var schedule in subjectSchedules)
        //    {
        //        // ✅ Filter only from 3200 candidates
        //        var candidates = (
        //            from c in allCandidates
        //            join s in _context.Subjects
        //                on c.Subject_Name.Trim().ToLower()
        //                equals s.SubjectNameEnglish.Trim().ToLower()
        //            where s.SubjectCode == schedule.SubjectCode.ToString()
        //            select c
        //        ).ToList();

        //        // Shuffle after filtering
        //        candidates = candidates.OrderBy(x => rnd.Next()).ToList();

        //        int candidateIndex = 0;
        //        DateTime currentSlotTime = schedule.Date.Date.AddHours(9);
        //        TimeSpan dayEnd = TimeSpan.FromHours(19); // 7 PM

        //        while (candidateIndex < candidates.Count)
        //        {
        //            if (currentSlotTime.TimeOfDay >= dayEnd)
        //            {
        //                // ✅ Only collect unallocated from these 3200
        //                for (int i = candidateIndex; i < candidates.Count; i++)
        //                    unallocatedCandidates.Add(candidates[i]);
        //                break;
        //            }

        //            var shuffledChairmen = chairmen.OrderBy(x => rnd.Next()).Take(12).ToList();
        //            var shuffledExperts = experts.OrderBy(x => rnd.Next()).Take(36).ToList();

        //            int expertIndex = 0;

        //            for (int b = 0; b < 12 && candidateIndex < candidates.Count; b++)
        //            {
        //                var candidate = candidates[candidateIndex++];

        //                candidate.InterviewDate = currentSlotTime.ToString("yyyy-MM-dd HH:mm:ss");
        //                updatedCandidates.Add(candidate);

        //                var board = new Boards
        //                {
        //                    CID = candidate.CID,
        //                    C1 = shuffledChairmen[b].BCMID,
        //                    E1 = shuffledExperts[expertIndex++].EMID,
        //                    E2 = shuffledExperts[expertIndex++].EMID,
        //                    E3 = shuffledExperts[expertIndex++].EMID,
        //                    DateTimeSlot = currentSlotTime
        //                };

        //                boardsList.Add(board);
        //            }

        //            // Move to next slot (slot duration + 10 min break)
        //            currentSlotTime = currentSlotTime.AddMinutes(request.SlotDurationMinutes + 40);
        //        }
        //    }

        //    // ✅ Persist board allocations
        //    _context.Boards.AddRange(boardsList);

        //    // ✅ Bulk update interview dates only for updated candidates
        //    _context.Candidates.UpdateRange(updatedCandidates);

        //    await _context.SaveChangesAsync();

        //    // ✅ Generate Excel ONLY for unallocated (from these 3200)
        //    string filePath = Path.Combine(Path.GetTempPath(), $"UnallocatedCandidates_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        //    using (var workbook = new XLWorkbook())
        //    {
        //        var worksheet = workbook.Worksheets.Add("Unallocated");
        //        worksheet.Cell(1, 1).Value = "CID";
        //        worksheet.Cell(1, 2).Value = "Enrollment_No";
        //        worksheet.Cell(1, 3).Value = "Name";
        //        worksheet.Cell(1, 4).Value = "Subject_Name";

        //        int row = 2;
        //        foreach (var c in unallocatedCandidates)
        //        {
        //            worksheet.Cell(row, 1).Value = c.CID;
        //            worksheet.Cell(row, 2).Value = c.Enrollment_No;
        //            worksheet.Cell(row, 3).Value = c.Name;
        //            worksheet.Cell(row, 4).Value = c.Subject_Name;
        //            row++;
        //        }

        //        workbook.SaveAs(filePath);
        //    }

        //    var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
        //    System.IO.File.Delete(filePath);

        //    return File(fileBytes,
        //        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //        "UnallocatedCandidates.xlsx");
        //}


        [HttpPost("AllocateBoards")]
        public async Task<IActionResult> AllocateBoards([FromBody] BoardAllocationRequest request)
        {
            var chairmen = await _context.BoardCMs.ToListAsync();
            var experts = await _context.ExpertsMasters.ToListAsync();
            var subjectSchedules = await _context.SubjectSchedules
                .OrderBy(s => s.Date)
                .ToListAsync();

            if (chairmen.Count < 13 || experts.Count < 36)
            {
                return BadRequest("Not enough chairmen or experts to allocate.");
            }

            var rnd = new Random();

            // ✅ Take only first 3200 candidates (deterministic ordering)
            var allCandidates = await _context.Candidates
                .OrderBy(c => c.CID)
                .Take(3200)
                .ToListAsync();

            var boardsList = new List<Boards>();
            var updatedCandidates = new List<Candidate>();
            var unallocatedCandidates = new List<Candidate>();

            foreach (var schedule in subjectSchedules)
            {
                // ✅ Filter only from 3200 candidates
                var candidates = (
                    from c in allCandidates
                    join s in _context.Subjects
                        on c.Subject_Name.Trim().ToLower()
                        equals s.SubjectNameEnglish.Trim().ToLower()
                    where s.SubjectCode == schedule.SubjectCode.ToString()
                    select c
                ).ToList();

                // Shuffle after filtering
                candidates = candidates.OrderBy(x => rnd.Next()).ToList();

                int candidateIndex = 0;
                DateTime currentSlotTime = schedule.Date.Date.AddHours(9);
                TimeSpan dayEnd = TimeSpan.FromHours(19); // 7 PM

                while (candidateIndex < candidates.Count)
                {
                    if (currentSlotTime.TimeOfDay >= dayEnd)
                    {
                        // ✅ Only collect unallocated (still no InterviewDate)
                        for (int i = candidateIndex; i < candidates.Count; i++)
                        {
                            if (string.IsNullOrEmpty(candidates[i].InterviewDate))
                                unallocatedCandidates.Add(candidates[i]);
                        }
                        break;
                    }

                    var shuffledChairmen = chairmen.OrderBy(x => rnd.Next()).Take(12).ToList();
                    var shuffledExperts = experts.OrderBy(x => rnd.Next()).Take(36).ToList();

                    int expertIndex = 0;

                    for (int b = 0; b < 12 && candidateIndex < candidates.Count; b++)
                    {
                        var candidate = candidates[candidateIndex++];

                        candidate.InterviewDate = currentSlotTime.ToString("yyyy-MM-dd HH:mm:ss");
                        updatedCandidates.Add(candidate);

                        var board = new Boards
                        {
                            CID = candidate.CID,
                            C1 = shuffledChairmen[b].BCMID,
                            E1 = shuffledExperts[expertIndex++].EMID,
                            E2 = shuffledExperts[expertIndex++].EMID,
                            E3 = shuffledExperts[expertIndex++].EMID,
                            DateTimeSlot = currentSlotTime
                        };

                        boardsList.Add(board);
                    }

                    // Move to next slot (slot duration + 10 min break)
                    currentSlotTime = currentSlotTime.AddMinutes(request.SlotDurationMinutes + 40);
                }
            }

            // ✅ Persist board allocations
            _context.Boards.AddRange(boardsList);

            // ✅ Bulk update interview dates only for updated candidates
            _context.Candidates.UpdateRange(updatedCandidates);

            await _context.SaveChangesAsync();

            // ✅ Generate Excel ONLY for candidates whose InterviewDate is NOT allotted
            var notAllotted = allCandidates
                .Where(c => string.IsNullOrEmpty(c.InterviewDate))
                .ToList();

            string filePath = Path.Combine(Path.GetTempPath(), $"UnallocatedCandidates_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Unallocated");
                worksheet.Cell(1, 1).Value = "CID";
                worksheet.Cell(1, 2).Value = "Enrollment_No";
                worksheet.Cell(1, 3).Value = "Name";
                worksheet.Cell(1, 4).Value = "Subject_Name";

                int row = 2;
                foreach (var c in notAllotted)
                {
                    worksheet.Cell(row, 1).Value = c.CID;
                    worksheet.Cell(row, 2).Value = c.Enrollment_No;
                    worksheet.Cell(row, 3).Value = c.Name;
                    worksheet.Cell(row, 4).Value = c.Subject_Name;
                    row++;
                }

                workbook.SaveAs(filePath);
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            System.IO.File.Delete(filePath);

            return File(fileBytes,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "UnallocatedCandidates.xlsx");
        }






        // DELETE: api/Boards/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoards(int id)
        {
            var boards = await _context.Boards.FindAsync(id);
            if (boards == null)
            {
                return NotFound();
            }

            _context.Boards.Remove(boards);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BoardsExists(int id)
        {
            return _context.Boards.Any(e => e.BID == id);
        }
    }

    public class BoardAllocationRequest
    {
        public DateTime StartDate { get; set; } // Date we start scheduling from
        public int SlotDurationMinutes { get; set; } = 45; // Default slot duration (e.g., 45 mins)
    }

}
