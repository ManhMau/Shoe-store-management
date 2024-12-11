using Microsoft.AspNetCore.Mvc;

namespace ShoeStoreClient.Controllers
{
    public class CategoriesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Create()
        {
            return View();
        }

        public IActionResult Edit(int categoryId)
        {
            ViewBag.CategoryId = categoryId;
            return View();
        }
    }
}
