using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class BoardCM
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BCMID { get; set; }

        public string ChairmanName { get; set; }
    }
}
