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
    public class BoardCMsController : ControllerBase
    {
        private readonly UPESSCDbContext _context;

        public BoardCMsController(UPESSCDbContext context)
        {
            _context = context;
        }

        // GET: api/BoardCMs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BoardCM>>> GetBoardCMs()
        {
            return await _context.BoardCMs.ToListAsync();
        }

        // GET: api/BoardCMs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BoardCM>> GetBoardCM(int id)
        {
            var boardCM = await _context.BoardCMs.FindAsync(id);

            if (boardCM == null)
            {
                return NotFound();
            }

            return boardCM;
        }

        // PUT: api/BoardCMs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBoardCM(int id, BoardCM boardCM)
        {
            if (id != boardCM.BCMID)
            {
                return BadRequest();
            }

            _context.Entry(boardCM).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BoardCMExists(id))
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

        // POST: api/BoardCMs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BoardCM>> PostBoardCM(BoardCM boardCM)
        {
            _context.BoardCMs.Add(boardCM);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBoardCM", new { id = boardCM.BCMID }, boardCM);
        }

        // DELETE: api/BoardCMs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBoardCM(int id)
        {
            var boardCM = await _context.BoardCMs.FindAsync(id);
            if (boardCM == null)
            {
                return NotFound();
            }

            _context.BoardCMs.Remove(boardCM);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BoardCMExists(int id)
        {
            return _context.BoardCMs.Any(e => e.BCMID == id);
        }
    }
}
