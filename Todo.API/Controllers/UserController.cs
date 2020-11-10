using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data.Entities;
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

    [Authorize()]
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

      var tokenIdClaim = Token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.NameId);
      var roleClaim = Token.Claims.FirstOrDefault(c => c.Type == "role");
      var role = roleClaim.Value; 

      if ((tokenIdClaim == null) || ((role != Role.RoletypeAdmin) && (Convert.ToInt64(tokenIdClaim.Value) != id))) {
        return Unauthorized();
      }

      var user = await _userService.GetUserById(id);

      if (user == null)
      {
        return BadRequest();
      }

      return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    [ProducesResponseType(typeof(IList<User>), StatusCodes.Status200OK)]
    public IActionResult GetUsers()
    {
      var users = _userService.GetUsers().ToList();

      return Ok(users);
    }
  }
}