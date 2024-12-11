using AutoMapper;
using BussinessObject.Dto;
using BussinessObject.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ShoeStoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly ShoeStoreContext _context;
        private readonly IMapper _mapper;

        public UserProfileController(ShoeStoreContext context, IMapper mapper)
        {
            _context=context;
            _mapper=mapper;
        }
        // GET: api/User/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<UserProfileDto>> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(_mapper.Map<UserProfileDto>(user));
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserProfile(int id, UserProfileDto userDto)
        {
            if (id != userDto.UserId)
            {
                return BadRequest("User ID mismatch.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _mapper.Map(userDto, user);

            if (!string.IsNullOrEmpty(userDto.PasswordHash))
            {
                user.PasswordHash = userDto.PasswordHash;
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                throw;
            }

            return NoContent();
        }
        private bool UserExists(int id)
        {
            return _context.Users.Any(u => u.UserId == id);
        }
    }

}
