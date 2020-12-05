using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Data.Entities;
using Todo.API.Services;

namespace Todo.API.Controllers
{
  public class BaseController : ControllerBase
  {
    protected readonly IUserService _userService;

    public BaseController(IUserService userService)
    {
      _userService = userService;
    }

    protected JwtSecurityToken Token
    {
      get {

        if (!Request.Headers.ContainsKey("Authorization"))
        {
          return null;
        }

        var authorization = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]).Parameter;

        return !string.IsNullOrEmpty(authorization) ? new JwtSecurityTokenHandler().ReadJwtToken(authorization) : null;
      }
    }

    protected async Task<User> GetUser()
    {
      var tokenIdClaim = Token != null ? Token.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.NameId) : null;

      if (tokenIdClaim == null)
      {
        return null;
      }
      
      return await _userService.GetUserById(Convert.ToInt64(tokenIdClaim.Value));
    }
  }
}