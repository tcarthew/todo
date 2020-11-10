using System;
using System.IdentityModel.Tokens.Jwt;
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
  public class AuthenticationController : ControllerBase
  {
    private IUserService _userService;
    public AuthenticationController(IUserService userService)
    {
      this._userService = userService;
    }

    [HttpPost]
    [AllowAnonymous()]
    [Route("register")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status422UnprocessableEntity)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [Produces("application/json")]
    public async Task<IActionResult> Register([FromBody] UserRequest request)
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
        
        return UnprocessableEntity("Email address is in user");
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Unknown error: {ex.Message}");
      }
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthenticateResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Authenticate([FromBody]UserRequest request)
    {
      var user = await _userService.GetUserByEmailAsync(request.Email);
      
      if (user == null) {
        user = new User() { Email = "dummy@dummy.com" };
      }

      if (await _userService.CheckPasswordAsync(user, request.Password))
      {
        var token = await _userService.CreateAuthorizationToken(user);
        var response = new AuthenticateResponse(new JwtSecurityTokenHandler().WriteToken(token), token.ValidTo);

        return Ok(response);
      }

      return BadRequest();
    }
  }
}