using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CsvHelper.Configuration;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Org.BouncyCastle.Asn1.Ocsp;
using UPESSC.Data;
using UPESSC.Models;
using UPESSC.Services;
using CsvHelper;
using OfficeOpenXml;

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

            string mobileNumber = candidate.MobileNo;
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

        /*[HttpPost("Import")]
        [RequestFormLimits(MultipartBodyLengthLimit = 200_000_000)]
        [RequestSizeLimit(200_000_000)]
        public async Task<IActionResult> ImportCandidates([FromForm] CandidateImport candidateImport)
        {
            var file = candidateImport.formFile;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var importedCandidates = new List<Candidate>();

            using (var stream = file.OpenReadStream())
            using (var reader = new StreamReader(stream))
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                TrimOptions = TrimOptions.Trim,
                IgnoreBlankLines = true,
            }))
            {
                importedCandidates = csv.GetRecords<Candidate>().ToList();
            }

            // ✅ Basic Validation: Ensure Enrollment_No is valid
            var validCandidates = importedCandidates
                .Where(c => c.Enrollment_No > 0)
                .ToList();

            // ✅ Avoid duplicates: skip Enrollment_No that already exist
            var existingEnrollments = await _context.Candidates
                .Select(c => c.Enrollment_No)
                .ToListAsync();

            var newCandidates = validCandidates
                .Where(c => !existingEnrollments.Contains(c.Enrollment_No))
                .ToList();

            if (!newCandidates.Any())
                return Ok(new { Message = "No new candidates to import." });

            _context.Candidates.AddRange(newCandidates);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ImportedCount = newCandidates.Count,
                SkippedCount = validCandidates.Count - newCandidates.Count,
                Message = "Candidates imported successfully."
            });
        }*/

        [HttpPost("Import")]
        [RequestFormLimits(MultipartBodyLengthLimit = 200_000_000)]
        [RequestSizeLimit(200_000_000)]
        public async Task<IActionResult> ImportCandidates([FromForm] CandidateImport candidateImport)
        {
            var file = candidateImport.formFile;
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            var importedCandidates = new List<Candidate>();

            using (var stream = file.OpenReadStream())
            using (var package = new ExcelPackage(stream))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                if (worksheet == null)
                    return BadRequest("No worksheet found in the file.");

                int rowCount = worksheet.Dimension.Rows;
                int colCount = worksheet.Dimension.Columns;

                // ✅ Read header row dynamically
                var headers = new List<string>();
                for (int col = 1; col <= colCount; col++)
                    headers.Add(worksheet.Cells[1, col].Text.Trim());

                // ✅ Read data rows (start from row 2)
                for (int row = 2; row <= rowCount; row++)
                {
                    try
                    {
                        var candidate = new Candidate
                        {
                            Enrollment_No = TryParseLong(GetValue(worksheet, headers, row, "Enrollment_No")),
                            Subject_Name = GetValue(worksheet, headers, row, "Subject_Name"),
                            Sub_Subject = GetValue(worksheet, headers, row, "Sub_Subject"),
                            Name = GetValue(worksheet, headers, row, "Name"),
                            Father_Name = GetValue(worksheet, headers, row, "Father_Name"),
                            Husband_Name = GetValue(worksheet, headers, row, "Husband_Name"),
                            Mother_Name = GetValue(worksheet, headers, row, "Mother_Name"),
                            Date_of_Birth = GetValue(worksheet, headers, row, "Date_of_Birth"),
                            Marital_Status = GetValue(worksheet, headers, row, "Marital_Status"),
                            Gender = GetValue(worksheet, headers, row, "Gender"),
                            Aadhaar_No = (GetValue(worksheet, headers, row, "Aadhaar_No")),
                            DFF = GetValue(worksheet, headers, row, "DFF"),
                            PH = GetValue(worksheet, headers, row, "PH"),
                            PG_Before_91 = GetValue(worksheet, headers, row, "PG_Before_91"),
                            UP_Resident = GetValue(worksheet, headers, row, "UP_Resident"),
                            Category_Code = GetValue(worksheet, headers, row, "Category_Code"),
                            Address_Line1 = GetValue(worksheet, headers, row, "Address_Line1"),
                            Address_Line2 = GetValue(worksheet, headers, row, "Address_Line2"),
                            Address_Line3 = GetValue(worksheet, headers, row, "Address_Line3"),
                            Address_Line4 = GetValue(worksheet, headers, row, "Address_Line4"),
                            Address_Line5 = GetValue(worksheet, headers, row, "Address_Line5"),
                            State = GetValue(worksheet, headers, row, "State"),
                            District = GetValue(worksheet, headers, row, "District"),
                            Postal_Code =GetValue(worksheet, headers, row, "Postal_Code"),
                            Permanent_Address_Line1 = GetValue(worksheet, headers, row, "Permanent_Address_Line1"),
                            Permanent_Address_Line2 = GetValue(worksheet, headers, row, "Permanent_Address_Line2"),
                            Permanent_Address_Line3 = GetValue(worksheet, headers, row, "Permanent_Address_Line3"),
                            Permanent_Address_Line4 = GetValue(worksheet, headers, row, "Permanent_Address_Line4"),
                            Permanent_Address_Line5 = GetValue(worksheet, headers, row, "Permanent_Address_Line5"),
                            Permanent_State = GetValue(worksheet, headers, row, "Permanent_State"),
                            Permanent_District = GetValue(worksheet, headers, row, "Permanent_District"),
                            Permanent_Postal_Code =GetValue(worksheet, headers, row, "Permanent_Postal_Code"),
                            Email = GetValue(worksheet, headers, row, "Email"),
                            MobileNo = GetValue(worksheet, headers, row, "MobileNo"),
                            is_SLET_SET = GetValue(worksheet, headers, row, "is_SLET_SET"),
                            SLET_Subject = GetValue(worksheet, headers, row, "SLET_Subject"),
                            is_NET = GetValue(worksheet, headers, row, "is_NET"),
                            NET_Subject = GetValue(worksheet, headers, row, "NET_Subject"),
                            is_JRF = GetValue(worksheet, headers, row, "is_JRF"),
                            JRF_Subject = GetValue(worksheet, headers, row, "JRF_Subject"),
                            is_Phd = GetValue(worksheet, headers, row, "is_Phd"),
                            Phd_Subject = GetValue(worksheet, headers, row, "Phd_Subject"),
                            Photo_File = GetValue(worksheet, headers, row, "Photo_File"),
                            Sign_File = GetValue(worksheet, headers, row, "Sign_File"),
                            Payment_Status = GetValue(worksheet, headers, row, "Payment_Status"),
                            Payment_ID = GetValue(worksheet, headers, row, "Payment_ID"),
                            Created_Date = GetValue(worksheet, headers, row, "Created_Date"),
                            Payment_Date = GetValue(worksheet, headers, row, "Payment_Date"),
                            Payment_Mode = GetValue(worksheet, headers, row, "Payment_Mode"),
                            RollNumber = GetValue(worksheet, headers, row, "RollNumber")
                        };

                        if (candidate.Enrollment_No > 0)
                            importedCandidates.Add(candidate);
                    }
                    catch
                    {
                        // Skip any row with bad data
                        continue;
                    }
                }
            }

            // ✅ Remove duplicates (based on Enrollment_No)
            var existingEnrollments = await _context.Candidates
                .Select(c => c.Enrollment_No)
                .ToListAsync();

            var newCandidates = importedCandidates
                .Where(c => !existingEnrollments.Contains(c.Enrollment_No))
                .ToList();

            if (!newCandidates.Any())
                return Ok(new { Message = "No new candidates to import." });

            _context.Candidates.AddRange(newCandidates);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                ImportedCount = newCandidates.Count,
                SkippedCount = importedCandidates.Count - newCandidates.Count,
                Message = "Candidates imported successfully from Excel."
            });
        }

        /// <summary> Helper: Safely get a cell value by header name </summary>
        private string GetValue(ExcelWorksheet ws, List<string> headers, int row, string headerName)
        {
            int index = headers.IndexOf(headerName);
            if (index == -1) return string.Empty;
            return ws.Cells[row, index + 1].Text?.Trim();
        }

        private int? TryParseInt(string input)
        {
            if (int.TryParse(input, out int result))
                return result;
            return null;
        }

        private long TryParseLong(string input)
        {
            if (long.TryParse(input, out long result))
                return result;
            return 0;
        }

        private int? CleanPostalCode(string postalCode)
        {
            if (string.IsNullOrWhiteSpace(postalCode)) return null;
            postalCode = postalCode.Replace("O", "0").Replace("o", "0"); // OCR Fix
            if (int.TryParse(postalCode, out int result)) return result;
            return null;
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
    public class CandidateImport
    {
        public IFormFile formFile { get; set; }
    }
}
