using Microsoft.AspNetCore.Mvc;

namespace ShoeStoreClient.Controllers
{
    public class WarehouseManagementController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }

        public IActionResult Edit(int warehouseProductId)
        {
            ViewBag.WarehouseProductId = warehouseProductId;
            return View();
        }
    }
}
