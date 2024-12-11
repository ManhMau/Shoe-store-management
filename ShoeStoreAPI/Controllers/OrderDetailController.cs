using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.EntityFrameworkCore;
using BussinessObject.Models;
using BussinessObject.Dto;

namespace BussinessObject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public OrderDetailController(ShoeStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/OrderDetail
        [HttpGet]
        [EnableQuery] // Hỗ trợ OData
        public async Task<ActionResult<IEnumerable<OrderDetailDTO>>> GetOrderDetails()
        {
            var orderDetails = await _context.OrderDetails.Include(a => a.Product).ToListAsync();
            return Ok(_mapper.Map<IEnumerable<OrderDetailDTO>>(orderDetails));
        }

        // GET: api/OrderDetail/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetailDTO>> GetOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails
                                               .Include(a => a.Product)
                                               .FirstOrDefaultAsync(od => od.OrderDetailId == id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<OrderDetailDTO>(orderDetail));
        }

        // POST: api/OrderDetail
        [HttpPost]
        public async Task<ActionResult<OrderDetailDTO>> CreateOrderDetail(OrderDetailDTO orderDetailDto)
        {
            // Kiểm tra đơn hàng đã tồn tại
            var order = await _context.Orders.FindAsync(orderDetailDto.OrderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found." });
            }

            var product = await _context.Products.FindAsync(orderDetailDto.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Product not found." });
            }

            var orderDetail = _mapper.Map<OrderDetail>(orderDetailDto);
            orderDetail.Order = order;
            orderDetail.Product = product; 

            // Thêm chi tiết đơn hàng vào cơ sở dữ liệu
            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            // Trả về kết quả
            return CreatedAtAction(nameof(GetOrderDetail), new { id = orderDetail.OrderDetailId }, _mapper.Map<OrderDetailDTO>(orderDetail));
        }


        // PUT: api/OrderDetail/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, OrderDetailDTO orderDetailDto)
        {
            if (id != orderDetailDto.OrderDetailId)
            {
                return BadRequest("OrderDetail ID mismatch.");
            }

            var orderDetail = _mapper.Map<OrderDetail>(orderDetailDto);
            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderDetailExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/OrderDetail/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);

            if (orderDetail == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OrderDetailExists(int id)
        {
            return _context.OrderDetails.Any(e => e.OrderDetailId == id);
        }
    }
}
