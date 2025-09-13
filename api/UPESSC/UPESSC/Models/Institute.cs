using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class Institute
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IID { get; set; }

        public string InstituteName { get; set; }

        public bool? isFemaleInstitute { get; set; }

        public string? SubjectCode { get; set; }

        public string? Category { get; set; }
    }
}
