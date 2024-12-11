using BussinessObject.Models;
using Microsoft.AspNetCore.Mvc;

namespace ShoeStoreClient.Controllers
{
    public class OrderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult HistoryOrder()
        {
            return View();
        }
        public IActionResult OrderDetails(int orderId)
        {
            ViewBag.OrderId = orderId;

            return View();  
        }
        public IActionResult Edit(int orderId)
        {
            ViewBag.OrderId = orderId;  
            return View();
        }
            public IActionResult Checkout(int orderId)
        {
            ViewBag.OrderId = orderId;
            return View();
        }
        public IActionResult Cart(int orderId)
        {
            ViewBag.OrderId = orderId;
            return View();
        }
    }
}
