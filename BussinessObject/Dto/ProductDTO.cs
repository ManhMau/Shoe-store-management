using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class ProductDTO
    {
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Product name is required.")]
        public string ProductName { get; set; } = null!;

        public string? Description { get; set; }

        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal? Price { get; set; }  

        [Required(ErrorMessage = "Quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Quantity cannot be negative.")]
        public int? Quantity { get; set; }  

        [Required(ErrorMessage = "Size is required.")]
        public string Size { get; set; }

        [StringLength(50, ErrorMessage = "Color cannot exceed 50 characters.")]
        public string? Color { get; set; }

        [StringLength(50, ErrorMessage = "Brand cannot exceed 50 characters.")]
        public string? Brand { get; set; }

        [Required(ErrorMessage = "CategoryId is required.")]
        public int? CategoryId { get; set; }  

        [Required(ErrorMessage = "SupplierId is required.")]
        public int? SupplierId { get; set; }  

        [Required(ErrorMessage = "Image is required.")]
        public string Image { get; set; }
    }
}
