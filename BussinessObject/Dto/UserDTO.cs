using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
        public class UserDTO
        {
            public int UserId { get; set; }

            [Required(ErrorMessage = "Username is required.")]
            public string Username { get; set; }

            [Required(ErrorMessage = "Password is required")]
            [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
            public string PasswordHash { get; set; }
            
            [Required(ErrorMessage = "Email is required.")]
            public string Email { get; set; }

            [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
            public string? PhoneNumber { get; set; }    

            [StringLength(50, ErrorMessage = "Address cannot be longer than 50 characters.")]
            public string? Address { get; set; }

            [Required(ErrorMessage = "RoleId is required.")]
            public int? RoleId { get; set; }
        }

}
