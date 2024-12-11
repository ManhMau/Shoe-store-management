using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class WarehouseDTO
    {
        public int WarehouseId { get; set; }

        [Required(ErrorMessage = "Warehouse name is required.")]
        [StringLength(100, ErrorMessage = "Warehouse name cannot exceed 100 characters.")]
        public string WarehouseName { get; set; } = null!;

        [Required(ErrorMessage = "Location is required.")]
        [StringLength(100, ErrorMessage = "Location cannot exceed 100 characters.")]
        public string Location { get; set; } = null!;
    }
}
