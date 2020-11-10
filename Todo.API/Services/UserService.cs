using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Todo.API.Data;
using Todo.API.Data.Entities;

namespace Todo.API.Services
{
  public class UserService : IUserService
  {
    private readonly UserManager<User> _userManager;
    private readonly TodoDbContext _context;
    private readonly AppSettings _appSettings;

    public UserService(UserManager<User> userManager, TodoDbContext context, IOptions<AppSettings> appSettings)
    {
      this._userManager = userManager;
      this._context = context;
      this._appSettings = appSettings.Value;
    }

    public async Task<User> CreateAsync(string email, string password, string role = Role.RoletypeUser)
    {
      var user = new User()
      {
        Email = email,
        EmailConfirmed = true,
        UserName = email,
        SecurityStamp = Guid.NewGuid().ToString()
      };

      var result = await _userManager.CreateAsync(user, password);
      await _context.SaveChangesAsync();
      await _userManager.AddToRoleAsync(user, role);
      await _context.SaveChangesAsync();

      return user;
    }

    public IQueryable<User> GetUsers()
    {
      return _userManager.Users;
    }

    public Task<User> GetUserByEmailAsync(string email)
    {
      return _userManager.FindByEmailAsync(email);
    }

    public Task<User> GetUserById(long userId)
    {
      return _userManager.FindByIdAsync(userId.ToString());
    }

    public Task<bool> CheckPasswordAsync(User user, string password)
    {
      return _userManager.CheckPasswordAsync(user, password);
    }

    public async Task<SecurityToken> CreateAuthorizationToken(User user)
    {
      var roles = await _userManager.GetRolesAsync(user);
      var claims = new List<Claim>()
      {
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
      };

      claims.AddRange(roles.Select(r => new Claim("role", r)));

      var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._appSettings.Secret));

      return new JwtSecurityToken(
        expires: DateTime.Now.AddMinutes(15),
        claims: claims,
        signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
      );  
    }
  }
}
