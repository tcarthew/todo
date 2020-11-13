using Microsoft.AspNetCore.Identity;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using Todo.API.Data.Entities;
using Todo.API.Services;
using Xunit;

namespace Todo.API.UnitTests.Services
{
  public class UserServiceTests: TodoTestBase
  {
    private IUserService _userService;
    private Mock<UserManager<User>> _mockUserManager;

    public UserServiceTests()
    {
      _mockUserManager = GetMockUserManager();
      _userService = new UserService(_mockUserManager.Object, CreateContext(), GetMockOptionsSettings().Object);
    }

    [Fact]
    public async void CanCreateUserAsync()
    {
      var user = await _userService.CreateAsync("test@test.com", "1234", "User");

      _mockUserManager.Verify(x => x.AddToRoleAsync(user, "User"), Times.Once);
      Assert.True(user.Email == "test@test.com");
      Assert.True(user.EmailConfirmed);
      Assert.True(user.UserName == user.Email);
    }

    [Fact]
    public async void CanGetUsers()
    {
      var user1 = await _userService.CreateAsync("test@test.com", "1234", "User");
      var users = _userService.GetUsers().ToList();

      _mockUserManager.Verify(x => x.Users, Times.Once);
      Assert.True(users.Count == 3);
    }

    [Fact]
    public async void CanGetUserByEmailAsync()
    {
      var user = await _userService.GetUserByEmailAsync("test@test.com");

      _mockUserManager.Verify(x => x.FindByEmailAsync("test@test.com"), Times.Once);
    }

    [Fact]
    public async void CanGetUserById()
    {
      var user = await _userService.GetUserById(1);

      _mockUserManager.Verify(x => x.FindByIdAsync("1"), Times.Once);
    }

    [Fact]
    public async void CanCheckPasswordAsync()
    {
      var mockUser = new User() { Id = 1 };
      var password = "pass123";
      var result = await _userService.CheckPasswordAsync(mockUser, password);

      _mockUserManager.Verify(x => x.CheckPasswordAsync(mockUser, password), Times.Once);
    }

    [Fact]
    public async void CanCreateAuthorizationToken()
    {
      var mockUser = new User() { Id = 99, Email = "test@test.com" };
      var token = await _userService.CreateAuthorizationToken(mockUser) as JwtSecurityToken;
      
      var tokenEmail = token.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Email);
      var tokenId = token.Claims.Single(c => c.Type == JwtRegisteredClaimNames.NameId);
      var tokenRole = token.Claims.Single(c => c.Type == "role");

      Assert.NotNull(token);
      Assert.True(token.Claims.Count() == 5);
      Assert.True(tokenEmail.Value == mockUser.Email);
      Assert.True(tokenId.Value == mockUser.Id.ToString());
      Assert.True(tokenRole.Value == "User");
      Assert.True(token.Header.ContainsKey("alg") && token.Header["alg"].ToString() == "HS256");
      Assert.True(token.Header.ContainsKey("typ") && token.Header["typ"].ToString() == "JWT");
      Assert.True(token.SignatureAlgorithm == "HS256");
    }
  }
}