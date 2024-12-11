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
    public class ProductController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public ProductController(ShoeStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // API tìm kiếm sản phẩm theo tên
        [HttpGet]
        [EnableQuery]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts([FromQuery] string? searchTerm)
        {
            IQueryable<Product> query = _context.Products;

            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.ProductName.Contains(searchTerm));
            }

            var products = await query.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ProductDTO>(product));
        }
      /*  [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProducts([FromQuery] string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return BadRequest("Product name is required.");
            }

            var products = await _context.Products
                .Where(p => p.ProductName.Contains(name)) 
                .ToListAsync();

            if (products == null || !products.Any())
            {
                return NotFound("No products found matching the search criteria.");
            }

            return Ok(_mapper.Map<IEnumerable<ProductDTO>>(products));
        }*/

        [HttpPost]
        public async Task<ActionResult<ProductDTO>> CreateProduct(ProductDTO productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = _mapper.Map<Product>(productDto);

            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("UNIQUE"))
                {
                    return Conflict(new { message = "Tên sản phẩm đã tồn tại trong hệ thống. Vui lòng chọn tên khác." });
                }
            }

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, _mapper.Map<ProductDTO>(product));
        }   

        // PUT: api/Product/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductDTO productDto)
        {
            if (id != productDto.ProductId)
            {
                return BadRequest("Product ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = _mapper.Map<Product>(productDto);
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                throw;
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException != null && ex.InnerException.Message.Contains("UNIQUE"))
                {
                    return Conflict(new { message = "Tên sản phẩm đã tồn tại trong hệ thống. Vui lòng chọn tên khác." });
                }
            }

            return NoContent();
        }

        // DELETE: api/Product/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
