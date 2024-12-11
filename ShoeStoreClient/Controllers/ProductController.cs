using Microsoft.AspNetCore.Mvc;

namespace ShoeStoreClient.Controllers
{
    public class ProductController : Controller
    {
        private readonly IConfiguration _configuration;

        public ProductController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public IActionResult Create()
        {
            return View();
        }
        
        public IActionResult Edit(int productId)
        {
            ViewBag.ProductId = productId;
            return View();
        }
        public IActionResult Detail(int productId)
        {
            ViewBag.ProductId = productId;
            return View();
        }
        public IActionResult IndexUser()
        {
            ViewBag.ApiBaseUrl = _configuration["ApiBaseUrl"]; 
            return View();
        }
        public IActionResult Index()
        {
            ViewBag.ApiBaseUrl = _configuration["ApiBaseUrl"]; // Truyền ApiBaseUrl xuống View
            return View();
        }
    }
}
