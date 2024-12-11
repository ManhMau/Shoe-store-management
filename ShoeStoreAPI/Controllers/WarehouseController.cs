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
    public class WarehouseController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public WarehouseController(ShoeStoreContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Warehouse
        [HttpGet]
        [EnableQuery] // Kích hoạt OData
        public async Task<ActionResult<IEnumerable<WarehouseDTO>>> GetWarehouses()
        {
            var warehouses = await _context.Warehouses.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<WarehouseDTO>>(warehouses));
        }

        // GET: api/Warehouse/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<WarehouseDTO>> GetWarehouse(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<WarehouseDTO>(warehouse));
        }

        // POST: api/Warehouse
        [HttpPost]
        public async Task<ActionResult<WarehouseDTO>> CreateWarehouse(WarehouseDTO warehouseDto)
        {
            var warehouse = _mapper.Map<Warehouse>(warehouseDto);
            _context.Warehouses.Add(warehouse);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetWarehouse), new { id = warehouse.WarehouseId }, _mapper.Map<WarehouseDTO>(warehouse));
        }

        // PUT: api/Warehouse/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWarehouse(int id, WarehouseDTO warehouseDto)
        {
            if (id != warehouseDto.WarehouseId)
            {
                return BadRequest("Warehouse ID mismatch.");
            }

            var warehouse = _mapper.Map<Warehouse>(warehouseDto);
            _context.Entry(warehouse).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WarehouseExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }

        // DELETE: api/Warehouse/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(int id)
        {
            var warehouse = await _context.Warehouses.FindAsync(id);
            if (warehouse == null)
            {
                return NotFound();
            }

            _context.Warehouses.Remove(warehouse);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WarehouseExists(int id)
        {
            return _context.Warehouses.Any(e => e.WarehouseId == id);
        }
    }
}
