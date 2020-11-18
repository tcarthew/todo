using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data.Entities;
using Todo.API.Models.Auth;
using Todo.API.Services;

namespace Todo.API.Controllers
{
  [ApiController]
  [Route("api/users")]
  public class UserController : BaseController
  {    
    public UserController(IUserService userService)
      : base(userService)
    {
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("{id}", Name = "User_GetById")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetById([FromRoute] long id)
    {
      if (Token == null)
      {
        return Unauthorized();
      }

      var user = await _userService.GetUserById(id);

      if (user == null)
      {
        return BadRequest();
      }

      return Ok(new UserDto(user.Id, user.Email, user.UserName));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [ProducesResponseType(typeof(IList<UserDto>), StatusCodes.Status200OK)]
    public IActionResult GetUsers()
    {
      var users = _userService
        .GetUsers()
        .Select(u => new UserDto(u.Id, u.Email, u.UserName))
        .ToList();

      return Ok(users);
    }
  }
}