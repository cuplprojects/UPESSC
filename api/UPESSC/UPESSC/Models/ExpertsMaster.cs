using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class ExpertsMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EMID { get; set; }

        public string ExpertName { get; set; }
    }
}
