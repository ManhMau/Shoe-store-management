using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BussinessObject.Models;
using BussinessObject.Dto;
using Microsoft.AspNetCore.OData.Query;

namespace BussinessObject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public OrderController(ShoeStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Order
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            var orders = await _context.Orders
                                       .Include(o => o.OrderDetails)
                                       .ThenInclude(a => a.Product)
                                       .Include(o => o.User)
                                       .ToListAsync();

            return Ok(_mapper.Map<IEnumerable<OrderDTO>>(orders));
        }

        // GET: api/Order/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            var order = await _context.Orders
                                       .Include(o => o.OrderDetails)
                                       .ThenInclude(a => a.Product)
                                       .Include(o => o.User)
                                       .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<OrderDTO>(order));
        }

        // GET: api/Order/History/{userId}
        [HttpGet("History/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetUserOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderDetails)
                .ThenInclude(a => a.Product)
                .ToListAsync();

            if (orders == null || orders.Count == 0)
            {
                return NotFound(new { message = "No orders found for this user." });
            }

            return Ok(_mapper.Map<IEnumerable<OrderDTO>>(orders));
        }


        [HttpGet("searchByDateTime")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrdersByDateRange(DateTime? fromDate, DateTime? toDate)
        {
            if (fromDate == null && toDate == null)
            {
                return BadRequest("At least one of FromDate or ToDate is required.");
            }

            if (fromDate.HasValue && toDate.HasValue && fromDate > toDate)
            {
                return BadRequest("FromDate cannot be later than ToDate.");
            }

            var query = _context.Orders.Include(o => o.User).AsQueryable();

            if (fromDate != null)
            {
                query = query.Where(o => o.OrderDate >= fromDate);
            }

            if (toDate != null)
            {
                query = query.Where(o => o.OrderDate <= toDate);
            }

            var orders = await query.ToListAsync();

            var orderDTOs = _mapper.Map<List<OrderDTO>>(orders);

            return Ok(orderDTOs);
        }


        [HttpPost]
        public async Task<ActionResult<OrderDTO>> CreateOrder(OrderDTO orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FindAsync(orderDto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Tạo đơn hàng từ OrderDTO
            var order = _mapper.Map<Order>(orderDto);
            order.User = user; 

            if (orderDto.OrderDetails != null && orderDto.OrderDetails.Count > 0)
            {
                foreach (var orderDetailDto in orderDto.OrderDetails)
                {
                    // Kiểm tra nếu Product tồn tại
                    var product = await _context.Products.FindAsync(orderDetailDto.ProductId);
                    if (product == null)
                    {
                        return NotFound(new { message = $"Product with ID {orderDetailDto.ProductId} not found." });
                    }

                    var orderDetail = _mapper.Map<OrderDetail>(orderDetailDto);
                    orderDetail.Order = order;
                    orderDetail.Product = product;

                    if (!order.OrderDetails.Any(od => od.ProductId == orderDetail.ProductId))
                    {
                        order.OrderDetails.Add(orderDetail);
                    }
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Trả về thông tin đơn hàng đã tạo
            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, _mapper.Map<OrderDTO>(order));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, OrderDTO orderDTO)
        {
            // Tìm đơn hàng cần cập nhật
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Chỉ cập nhật các trường có giá trị hợp lệ từ DTO
            if (!string.IsNullOrEmpty(orderDTO.Status))
            {
                order.Status = orderDTO.Status;
            }

            if (orderDTO.TotalPrice.HasValue)
            {
                order.TotalPrice = orderDTO.TotalPrice.Value;
            }

            if (!string.IsNullOrEmpty(orderDTO.ShippingAddress))
            {
                order.ShippingAddress = orderDTO.ShippingAddress;
            }

            if (!string.IsNullOrEmpty(orderDTO.PaymentMethod))
            {
                order.PaymentMethod = orderDTO.PaymentMethod;
            }

            // Cập nhật thông tin cập nhật cuối cùng
            order.UpdatedAt = DateTime.Now;

            await _context.SaveChangesAsync(); // Lưu thay đổi vào database

            return NoContent(); 
        }



        // DELETE: api/Order/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                                       .Include(o => o.OrderDetails)
                                       .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound();
            }

            // Remove related order details
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Remove the order
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
