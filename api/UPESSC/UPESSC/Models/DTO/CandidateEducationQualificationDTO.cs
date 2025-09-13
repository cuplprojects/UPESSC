namespace UPESSC.Models.DTO
{
    public class CandidateEducationQualificationDTO
    {
        public int CID { get; set; }

        public string? Examination { get; set; }

        public string? BoardOrUniversity { get; set; }

        public string? YearOfPassing { get; set; }

        public string? RollNumber { get; set; }

        public string? MarksObtained { get; set; }

        public string? TotalMarks { get; set; }

        public string? Percentage { get; set; }

        public string? Grade { get; set; }

        public string? Subject { get; set; }

        public IFormFile? MarkSheetFile { get; set; }

        public IFormFile? CertificateFile { get; set; }
    }
}
