using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class Candidate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CID { get; set; }
        public long Enrollment_No { get; set; }
        public string? Subject_Name { get; set; }
        public string? Sub_Subject { get; set; }
        public string? Name { get; set; }
        public string? Father_Name { get; set; }
        public string? Husband_Name { get; set; }
        public string? Mother_Name { get; set; }
        public string? Marital_Status { get; set; }
        public string? Date_of_Birth { get; set; }  // Consider DateTime if always valid date
        public string? Gender { get; set; }
        public string? Aadhaar_No { get; set; }
        public string? DFF { get; set; }
        public string? PH { get; set; }
        public string? PG_Before_91 { get; set; }
        public string? UP_Resident { get; set; }
        public string? Category_Code { get; set; }
        public string? Address_Line1 { get; set; }
        public string? Address_Line2 { get; set; }
        public string? Address_Line3 { get; set; }
        public string? Address_Line4 { get; set; }
        public string? Address_Line5 { get; set; }
        public string? State { get; set; }
        public string? District { get; set; }
        public string? Postal_Code { get; set; }
        public string? Permanent_Address_Line1 { get; set; }
        public string? Permanent_Address_Line2 { get; set; }
        public string? Permanent_Address_Line3 { get; set; }
        public string? Permanent_Address_Line4 { get; set; }
        public string? Permanent_Address_Line5 { get; set; }
        public string? Permanent_State { get; set; }
        public string? Permanent_District { get; set; }
        public string? Permanent_Postal_Code { get; set; }
        public string? Email { get; set; }
        public string? MobileNo { get; set; }
        public string? is_SLET_SET { get; set; }
        public string? SLET_Subject { get; set; }
        public string? is_NET { get; set; }
        public string? NET_Subject { get; set; }
        public string? is_JRF { get; set; }
        public string? JRF_Subject { get; set; }
        public string? is_Phd { get; set; }
        public string? Phd_Subject { get; set; }
        public string? Photo_File { get; set; }
        public string? Sign_File { get; set; }
        public string? Payment_Status { get; set; }
        public string? Payment_ID { get; set; }
        public string? Created_Date { get; set; }  // Consider DateTime if always valid date
        public string? Payment_Date { get; set; } // If this is actually date, use DateTime instead of double
        public string? Payment_Mode { get; set; }
        public string? RollNumber { get; set; }
        public string? InterviewDate { get; set; }
    }
}

