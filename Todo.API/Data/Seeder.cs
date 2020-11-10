using Microsoft.AspNetCore.Identity;
using Todo.API.Data.Entities;

namespace Todo.API.Data
{
  public class Seeder
  {
    private readonly TodoDbContext _context;
    private readonly RoleManager<Role> _roleManager;

    public Seeder(TodoDbContext context, RoleManager<Role> roleManager)
    {
      this._context = context;
      this._roleManager = roleManager;
    }

    public async void Seed()
    {
      await _roleManager.CreateAsync(new Role() { Name = Role.RoletypeAdmin });
      await _context.SaveChangesAsync();
      await _roleManager.CreateAsync(new Role() { Name = Role.RoletypeUser });
      await _context.SaveChangesAsync();
    }
  }
}