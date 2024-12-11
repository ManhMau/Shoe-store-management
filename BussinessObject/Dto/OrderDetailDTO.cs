using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class OrderDetailDTO
    {
        public int OrderDetailId { get; set; }

        [Required] 
        public int OrderId { get; set; }

        [Required] 
        public int ProductId { get; set; }
        public string? ProductName { get; set; }


        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")] 
        public int Quantity { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")] 
        public decimal Price { get; set; }


    }
}
