using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class RoleDTO
    {
        [Key] 
        public int RoleId { get; set; }

        [Required] 
        [StringLength(50, ErrorMessage = "RoleName cannot be longer than 50 characters.")]
        public string RoleName { get; set; }
    }
}
