using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class SubjectSchedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SSID { get; set; }

        public int SubjectCode { get; set; }

        public DateTime Date { get; set; }
    }
}
