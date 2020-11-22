using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Todo.API.Data;
using Todo.API.Data.Entities;

namespace Todo.API.UnitTests
{
  public class TodoTestBase: IDisposable
  {
    private readonly string connectionString = "Filename=:memory:";
    private SqliteConnection _connection;
    
    private IList<User> _mockUsers = new List<User>()
    {
      new User() { Id = 1, Email = "test1@test.com" },
      new User() { Id = 2, Email = "test2@test.com" }
    };

    public TodoTestBase()
    {
      
    }

    protected TodoDbContext CreateContext() 
    {
      _connection = new SqliteConnection(connectionString);
      _connection.Open();

      return new TodoDbContext(GetOptions(_connection));
    }

    public void Dispose()
    {
      if (_connection != null) {
        _connection.Close();
      }
    }

    protected Mock<UserManager<User>> GetMockUserManager()
    {
      var userManager = new Mock<UserManager<User>>(
        new Mock<IUserStore<User>>().Object,
        new Mock<IOptions<IdentityOptions>>().Object,
        new PasswordHasher<User>(),
        null, 
        null,
        new Mock<ILookupNormalizer>().Object,
        new Mock<IdentityErrorDescriber>().Object,
        new Mock<IServiceProvider>().Object,
        new Mock<ILogger<UserManager<User>>>().Object
      );

      userManager
        .Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
        .ReturnsAsync(IdentityResult.Success)
        .Callback<User, string>((user, b) => _mockUsers.Add(user));
      userManager.Setup(um => um.Users).Returns(_mockUsers.AsQueryable());
      userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>())).ReturnsAsync(It.IsAny<User>());
      userManager.Setup(um => um.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(It.IsAny<User>());
      userManager.Setup(um => um.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(It.IsAny<bool>());
      userManager.Setup(um => um.GetRolesAsync(It.IsAny<User>())).ReturnsAsync(new List<string>() { "User" });

      return userManager;
    }

    protected Mock<IOptions<AppSettings>> GetMockOptionsSettings()
    {
      var options = new Mock<IOptions<AppSettings>>();

      options.Setup(o => o.Value).Returns(new AppSettings() {  Secret = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
      
      return options;
    }

    private DbContextOptions<TodoDbContext> GetOptions(DbConnection connection)
    {
      return new DbContextOptionsBuilder<TodoDbContext>()
        .UseSqlite(_connection)
        .Options;
    }
  }
}