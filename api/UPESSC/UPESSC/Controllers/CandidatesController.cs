using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using UPESSC.Data;
using UPESSC.Models;
using UPESSC.Services;

namespace UPESSC.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidatesController : ControllerBase
    {
        private readonly UPESSCDbContext _context;
        private readonly OtpService _otpService;
        private readonly IConfiguration _configuration;
        private readonly ISecurityService _securityService;

        public CandidatesController(UPESSCDbContext context, OtpService otpService, IConfiguration configuration, ISecurityService securityService)
        {
            _context = context;
            _otpService = otpService;
            _configuration = configuration;
            _securityService = securityService;
        }

        // GET: api/Candidates
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Candidate>>> GetCandidates()
        {
            return await _context.Candidates.ToListAsync();
        }

        // GET: api/Candidates/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Candidate>> GetCandidate(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);

            if (candidate == null)
            {
                return NotFound();
            }

            return candidate;
        }

        // PUT: api/Candidates/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCandidate(int id, Candidate candidate)
        {
            if (id != candidate.CID)
            {
                return BadRequest();
            }

            _context.Entry(candidate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CandidateExists(id))
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

        // POST: api/Candidates
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Candidate>> PostCandidate(Candidate candidate)
        {
            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCandidate", new { id = candidate.CID }, candidate);
        }

        [HttpPost("Login")]
        public async Task<ActionResult<object>> Login(CandidateLoginRequest loginCandidate)
        {

            var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.RollNumber == loginCandidate.RollNumber);
            if (candidate == null)
            {
                return Unauthorized("Invalid Roll Number");
            }
            var (otp, expiry) = _otpService.GenerateOtp();

            var smsService = new SmsService(
            "https://www.smsgateway.center/SMSApi/rest/send", // API URL
            "6042614833445292185",                            // API Key
            "diversified",
            "REGNOW", // Sender ID
            "23Dbspl74@"
        );

            string mobileNumber = candidate.MobileNumber;
            string message = $"{otp} is OTP for UPESSC Login REGNOW";
            string templateId = "1207161207955867884";

            try
            {
                string response = smsService.SendSms(mobileNumber, message, templateId);
                Console.WriteLine("Response from SMS API: " + response);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error sending SMS: " + ex.Message);
            }
            var otps = new
            {
                ID = candidate.CID,
                otp = otp,
                expires = expiry
            };

            string emailBody = $@"
                <div style=""text-align: center; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border: 2px solid black; min-width: 200px; max-width: 300px; width: 100%; margin: 50px auto;"">
                    <h2 style=""color: blue;"">Email Authentication OTP <hr /></h2>
                     <p>
                        <strong>OTP:</strong><br /> {otp}
                    </p>
                </div>
                ";
            var result = new EmailService(_context, _configuration).SendEmail(candidate.Email, "Login Otp for UPESSC", emailBody);
            string otpsjson = JsonConvert.SerializeObject(otps);
            string encryptedJson = _securityService.Encrypt(otpsjson);
            return Ok(encryptedJson);
        }


        [HttpPost("GetToken")]
        public async Task<ActionResult<string>> GetToken(TokenRequest tokenRequest)
        {
            if (tokenRequest.IsVerified == true)
            {
                var token = GenerateToken(tokenRequest.UID);
                return Ok(token);
            }
            else
                return Unauthorized("USER NOT FOUND OR NOT VERIFIED");
        }

        // DELETE: api/Candidates/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return NotFound();
            }

            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CandidateExists(int id)
        {
            return _context.Candidates.Any(e => e.CID == id);
        }

        private string GenerateToken(int userId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userId.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
    public class CandidateLoginRequest
    {
        public string RollNumber { get; set; }
    }

    public class EmailOtps
    {
        Candidate candidate { get; set; }
        public string EmailOTP { get; set; }
        public DateTime Expires { get; set; }
    }

    public class TokenRequest
    {
        public int UID { get; set; }
        public bool IsVerified { get; set; }
    }
}
