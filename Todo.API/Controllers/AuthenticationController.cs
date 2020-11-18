using System;
using System.IdentityModel.Tokens.Jwt;
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
  [Route("api/auth")]
  public class AuthenticationController : BaseController
  {
    public AuthenticationController(IUserService userService)
      : base(userService)
    {
    }

    [HttpPost]
    [AllowAnonymous()]
    [Route("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [Produces("application/json")]
    public async Task<IActionResult> Register([FromBody] UserDto request)
    {
      if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
      {
        return UnprocessableEntity("Email & pasword are required");
      }

      try 
      {
        if (await _userService.GetUserByEmailAsync(request.Email) == null)
        {
          var result = await _userService.CreateAsync(request.Email, request.Password);
          
          return CreatedAtRoute("User_GetById", new { id = result.Id }, null); 
        }
        
        return UnprocessableEntity("Email address is in use");
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Unknown error: {ex.Message}");
      }
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthenticateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Authenticate([FromBody]UserDto request)
    {
      var user = await _userService.GetUserByEmailAsync(request.Email);
      
      if (user == null) {
        user = new User() { Email = "dummy@dummy.com" };
      }

      if (await _userService.CheckPasswordAsync(user, request.Password))
      {
        var token = await _userService.CreateAuthorizationToken(user);
        var response = new AuthenticateDto(new JwtSecurityTokenHandler().WriteToken(token), token.ValidTo);

        return Ok(response);
      }

      return BadRequest();
    }

    [HttpGet]
    [Authorize]
    [Route("me")]
    [ProducesResponseType(typeof(User), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Me()
    {
      if (Token == null)
      {
        return Unauthorized();
      }

      var tokenIdClaim = Token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.NameId);

      if (tokenIdClaim == null)
      {
        return Unauthorized();
      }

      var user = await _userService.GetUserById(Convert.ToInt64(tokenIdClaim.Value));

      if (user == null)
      {
        return BadRequest();
      }

      return Ok(new UserDto(user.Id, user.Email, user.UserName));
    }
  }
}