using Org.BouncyCastle.Bcpg;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class Candidate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CID { get; set; }

        public string RollNumber { get; set; }

        public string RegistrationNumber { get; set; }

        public string CandidateName { get; set; }

        public string? DOB { get; set; }

        public string? Gender { get; set; }

        public string? ProfileImage { get; set; }

        public string? Category { get; set; }

        public string? SubCategory { get; set; }

        public string? MaritalStatus { get; set; }
        
        public string? FatherOrHusbandName { get; set; }

        public string? MobileNumber { get; set; }

        public string? Email { get; set; }

        public string? SubjectCode { get; set; }

        public string? Subject{ get; set; }

        public string? InterviewBoard { get; set;}

       public string? InterviewDate { get; set; }
    }
}
