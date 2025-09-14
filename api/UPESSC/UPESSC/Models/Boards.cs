using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class Boards
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BID { get; set; }

        public int CID { get; set; }

        public int E1 { get; set; }

        public int E2 { get; set; }

        public int E3 { get; set; }

        public int C1 { get; set; }

        public DateTime DateTimeSlot { get; set; }
    }
}
