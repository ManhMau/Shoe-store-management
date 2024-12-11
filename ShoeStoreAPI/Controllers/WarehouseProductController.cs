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
    public class WarehouseProductController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public WarehouseProductController(ShoeStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/WarehouseProduct
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<WarehouseProductDTO>>> GetWarehouseProducts()
        {
            var warehouseProducts = await _context.WarehouseProducts
                                                  .Include(wp => wp.Warehouse)
                                                  .Include(wp => wp.Product)
                                                  .ToListAsync();
            return Ok(_mapper.Map<IEnumerable<WarehouseProductDTO>>(warehouseProducts));
        }

        // GET: api/WarehouseProduct/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WarehouseProductDTO>> GetWarehouseProduct(int id)
        {
            var warehouseProduct = await _context.WarehouseProducts
                                                 .Include(wp => wp.Warehouse)
                                                 .Include(wp => wp.Product)
                                                 .FirstOrDefaultAsync(wp => wp.WarehouseProductId == id);
            if (warehouseProduct == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<WarehouseProductDTO>(warehouseProduct));
        }

        // POST: api/WarehouseProduct
        [HttpPost]
        public async Task<ActionResult<WarehouseProductDTO>> CreateWarehouseProduct(WarehouseProductDTO warehouseProductDto)
        {
            if (warehouseProductDto == null)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var warehouseProduct = _mapper.Map<WarehouseProduct>(warehouseProductDto);

                _context.WarehouseProducts.Add(warehouseProduct);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetWarehouseProduct), new { id = warehouseProduct.WarehouseProductId }, _mapper.Map<WarehouseProductDTO>(warehouseProduct));
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và trả về thông báo lỗi
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWarehouseProduct(int id, WarehouseProductDTO warehouseProductDto)
        {
            if (id != warehouseProductDto.WarehouseProductId)
            {
                return BadRequest("WarehouseProduct ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra trùng lặp productId và warehouseId trước khi cập nhật
            var existingWarehouseProduct = await _context.WarehouseProducts
                .FirstOrDefaultAsync(wp => wp.ProductId == warehouseProductDto.ProductId
                && wp.WarehouseId == warehouseProductDto.WarehouseId && wp.WarehouseProductId != id);

            if (existingWarehouseProduct != null)
            {
                return BadRequest("Sản phẩm này đã tồn tại trong kho hàng này.");
            }

            var warehouseProduct = _mapper.Map<WarehouseProduct>(warehouseProductDto);
            _context.Entry(warehouseProduct).State = EntityState.Modified;

            try
            {
                // Cập nhật lại số lượng sản phẩm
                var oldProductId = await _context.WarehouseProducts
                    .Where(wp => wp.WarehouseProductId == id)
                    .Select(wp => wp.ProductId)
                    .FirstOrDefaultAsync();

                await _context.SaveChangesAsync();

                // Nếu ProductId thay đổi, cập nhật Quantity cho cả hai sản phẩm liên quan
                if (oldProductId != warehouseProduct.ProductId)
                {
                    await UpdateProductQuantity(oldProductId);

                    // Cập nhật lại số lượng của sản phẩm mới (warehouseProduct.ProductId)
                    await UpdateProductQuantity(warehouseProduct.ProductId);
                }
                else
                {
                    await UpdateProductQuantity(warehouseProduct.ProductId);
                }

            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WarehouseProductExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }


        // DELETE: api/WarehouseProduct/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouseProduct(int id)
        {
            var warehouseProduct = await _context.WarehouseProducts.FindAsync(id);
            if (warehouseProduct == null)
            {
                return NotFound();
            }

            _context.WarehouseProducts.Remove(warehouseProduct);
            await _context.SaveChangesAsync();
            // Cập nhật lại số lượng sản phẩm sau khi xóa
            await UpdateProductQuantity(warehouseProduct.ProductId);

            return NoContent();
        }

        private bool WarehouseProductExists(int id)
        {
            return _context.WarehouseProducts.Any(wp => wp.WarehouseProductId == id);
        }

        // API kiểm tra trùng lặp
        [HttpGet("CheckDuplicate")]
        public async Task<bool> CheckDuplicate(int warehouseId, int productId, int? warehouseProductId = null)
        {
            // Kiểm tra trùng lặp trong kho, loại trừ bản ghi đang được sửa (theo warehouseProductId)
            var existingProduct = await _context.WarehouseProducts
                .FirstOrDefaultAsync(wp => wp.ProductId == productId && wp.WarehouseId == warehouseId
                    && (warehouseProductId == null || wp.WarehouseProductId != warehouseProductId));

            // Nếu tìm thấy sản phẩm khác có productId và warehouseId giống nhau, trả về true (trùng lặp)
            return existingProduct != null;
        }

        private async Task UpdateProductQuantity(int productId)
        {
            // Tính tổng StockQuantity của ProductId trong bảng WarehouseProducts
            var totalStock = await _context.WarehouseProducts
                .Where(wp => wp.ProductId == productId)
                .SumAsync(wp => wp.StockQuantity);

            // Nếu không có sản phẩm nào trong WarehouseProducts cho ProductId, đặt tổng stock về 0
            if (totalStock == 0)
            {
                var product = await _context.Products.FindAsync(productId);

                if (product != null)
                {
                    product.Quantity = 0;  // Đặt Quantity của Product thành 0 nếu không có sản phẩm trong WarehouseProducts
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                // Cập nhật Quantity trong bảng Product nếu có tổng stock
                var product = await _context.Products.FindAsync(productId);

                if (product != null)
                {
                    product.Quantity = totalStock;  // Cập nhật Quantity bằng tổng stock
                    await _context.SaveChangesAsync();
                }
            }
        }


    }
}
