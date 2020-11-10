using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Todo.API.Data.Entities;

namespace Todo.API.Data
{
  public class Seeder
  {
    private readonly TodoDbContext _context;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<Role> _roleManager;

    public Seeder(TodoDbContext context, UserManager<User> userManager, RoleManager<Role> roleManager)
    {
      this._context = context;
      this._userManager = userManager;
      this._roleManager = roleManager;
    }

    public async void Seed()
    {
      if (_roleManager.Roles.Count() > 0)
      {
        return;
      }
      
      await _roleManager.CreateAsync(new Role() { Name = Role.RoletypeAdmin });
      await _context.SaveChangesAsync();
      await _roleManager.CreateAsync(new Role() { Name = Role.RoletypeUser });
      await _context.SaveChangesAsync();
      await CreateAdminUser();
    }

    private async Task<User> CreateAdminUser()
    {
      var user = new User()
      {
        Email = "admin@test.com",
        EmailConfirmed = true,
        UserName = "admin@test.com",
        SecurityStamp = Guid.NewGuid().ToString()
      };

      var result = await _userManager.CreateAsync(user, "test123");
      await _context.SaveChangesAsync();
      await _userManager.AddToRoleAsync(user, Role.RoletypeAdmin);
      await _context.SaveChangesAsync();

      return user;
    }
  }
}
