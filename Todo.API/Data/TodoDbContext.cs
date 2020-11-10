using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Todo.API.Data.Entities;

namespace Todo.API.Data 
{
  public class TodoDbContext: IdentityDbContext<User, Role, long>
  {
    public DbSet<TodoItem> TodoItems { get; set; }

    public TodoDbContext(DbContextOptions options)
      : base(options)
    {
      Database.EnsureCreated(); 
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
      base.OnModelCreating(builder);
      builder.Entity<User>(entity => {
        entity.ToTable("Users");
        entity.Property(e => e.PasswordHash).HasColumnName("Password");
        entity.Property(e => e.Id).ValueGeneratedOnAdd();
      });
      builder.Entity<Role>(entity => {
        entity.ToTable("Roles");
      });
    }
  }
}
