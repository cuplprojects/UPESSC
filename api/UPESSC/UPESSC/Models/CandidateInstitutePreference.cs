using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class CandidateInstitutePreference
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CIPID { get; set; }

        public int CID { get; set; }

        public int IID { get; set; }

        public int PreferenceOrder { get; set; }
    }
}
