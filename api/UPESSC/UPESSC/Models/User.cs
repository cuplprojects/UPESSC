using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UPESSC.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UID { get; set; }

        public string UserName { get; set; }

        public string Name { get; set; }

        public string Password { get; set; }

        public bool Admin { get; set; }
    }
}
