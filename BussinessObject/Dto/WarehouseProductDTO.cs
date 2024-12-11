using System.ComponentModel.DataAnnotations;

namespace BussinessObject.Dto
{
    public class WarehouseProductDTO
    {
        public int WarehouseProductId { get; set; }

        [Required(ErrorMessage = "Warehouse ID is required.")]
        public int?  WarehouseId { get; set; }

        [Required(ErrorMessage = "Product ID is required.")]
        public int? ProductId { get; set; }

        [Required(ErrorMessage = "Stock quantity is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Stock quantity cannot be negative.")]
        public int? StockQuantity { get; set; }

        public WarehouseDTO? Warehouse { get; set; }
        public ProductDTO? Product { get; set; }
    }
}
