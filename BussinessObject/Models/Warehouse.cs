using System;
using System.Collections.Generic;

namespace BussinessObject.Models
{
    public partial class Warehouse
    {
        public Warehouse()
        {
            WarehouseProducts = new HashSet<WarehouseProduct>();
        }

        public int WarehouseId { get; set; }
        public string WarehouseName { get; set; }
        public string Location { get; set; }

        public virtual ICollection<WarehouseProduct> WarehouseProducts { get; set; }
    }
}
