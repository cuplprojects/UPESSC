using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class CandidateEducationalQualification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CEQID { get; set; }

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

        public string? MarkSheetpath { get; set; }

        public string? CertificatePath { get; set; }
    }
}
