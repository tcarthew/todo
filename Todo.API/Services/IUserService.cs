using System.Linq;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Todo.API.Data.Entities;

namespace Todo.API.Services
{
  public interface IUserService
  {
    Task<User> CreateAsync(string email, string password, string role = Role.RoletypeUser);
    IQueryable<User> GetUsers();
    Task<User> GetUserByEmailAsync(string email);
    Task<User> GetUserById(long userId);
    Task<bool> CheckPasswordAsync(User user, string password);
    Task<SecurityToken> CreateAuthorizationToken(User user);
  } 
}