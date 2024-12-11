using System;
using System.Collections.Generic;

namespace BussinessObject.Models
{
    public partial class WarehouseProduct
    {
        public int WarehouseProductId { get; set; }
        public int WarehouseId { get; set; }
        public int ProductId { get; set; }
        public int StockQuantity { get; set; }

        public virtual Product Product { get; set; }
        public virtual Warehouse Warehouse { get; set; }
    }
}
