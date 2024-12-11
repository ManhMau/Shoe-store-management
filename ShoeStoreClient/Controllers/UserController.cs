using Microsoft.AspNetCore.Mvc;

namespace ShoeStoreClient.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        { 
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }
        public IActionResult EditProfile()
        {

            return View();
        }

        
        public IActionResult Edit(int userID)
        {
            ViewBag.UserId = userID;
            return View();
        }
    }
}
