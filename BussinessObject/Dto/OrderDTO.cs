
using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class OrderDTO
    {

        public int OrderId { get; set; }

        public int UserId { get; set; }

        public string? Username { get; set; }

        [Required(ErrorMessage = "Order Date is required.")]
        public DateTime? OrderDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Total Price is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total Price must be greater than 0.")]
        public decimal? TotalPrice { get; set; }

        [Required(ErrorMessage = "Status is required.")]    
        public string Status { get; set; }

        [Required(ErrorMessage = "Shipping Address is required.")]
        public string ShippingAddress { get; set; }

        [Required(ErrorMessage = "Payment Method is required.")]
        public string PaymentMethod { get; set; }

        public DateTime? UpdatedAt { get; set; } = DateTime.Now;

        public List<OrderDetailDTO>? OrderDetails { get; set; }
    }
}
