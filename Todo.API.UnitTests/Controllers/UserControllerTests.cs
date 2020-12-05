using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Todo.API.Controllers;
using Todo.API.Data.Entities;
using Todo.API.Models.Auth;
using Todo.API.Services;
using Xunit;

namespace Todo.API.UnitTests.Controllers
{
  public class UserControllerTests
  {
    private const string MOCK_TOKEN_SIG = "rNZQndjf1Bf-11c9A7qELIKEiDPTTFBonflNgBN-cCk";
    private static string MOCK_ADMIN_TOKEN = 
      $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1laWQiOiI5OSIsImp0aSI6IjRkNmI4MTEwLTMxODYtNDc3ZC1iMDc5LTVlOWIzMGJkNjNkOCIsInJvbGUiOiJBZG1pbiIsImV4cCI6MTYwNTk2NTAwNn0.{MOCK_TOKEN_SIG}";
    private DefaultHttpContext _mockHttpContext;

    public UserControllerTests()
    {
      this._mockHttpContext = new DefaultHttpContext();
    }

    private Mock<IUserService> CreateMockUserService()
    {
      var mockUserService = new Mock<IUserService>();

      mockUserService.Setup(m => m.GetUserById(It.IsAny<long>())).ReturnsAsync((long id) => {
        if (id != -1){
          return new User() {
            Id = id,
            Email = "test@test.com",
            UserName = "test@test.com"
          };
        }
        return null;
      });
      mockUserService.Setup(m => m.GetUsers()).Returns((new List<User>() {
        new User() { Id = 1, Email = "test1@test.com", UserName = "test1@test.com" },
        new User() { Id = 1, Email = "test2@test.com", UserName = "test2@test.com" },
        new User() { Id = 1, Email = "test3@test.com", UserName = "test3@test.com" }
      }).AsQueryable());

      return mockUserService;
    }

    private UserController CreateTestController(IUserService userService, bool forAdmin = true)
    {
      var testController = new UserController(CreateMockUserService().Object);
      var mockControllerContext = new ControllerContext() { HttpContext = _mockHttpContext };

      _mockHttpContext.Request.Headers["Authorization"] = $"bearer {MOCK_ADMIN_TOKEN}";
      testController.ControllerContext = mockControllerContext;

      return testController;
    }

    #region GetById Tests

    [Fact]
    public async void GetById_Returns_Unauthorized_IfNotTokenSpecified()
    {
      var testController = CreateTestController(CreateMockUserService().Object);

      testController.Request.Headers.Clear();

      var result = await testController.GetById(1);

      Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async void GetById_Returns_BadRequest_IfInvalidIdSpecified()
    {
      var testController = CreateTestController(CreateMockUserService().Object);
      var result = await testController.GetById(-1);

      Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async void GetById_Returns_200OK_For_ValidUser_And_Id()
    {
      var testController = CreateTestController(CreateMockUserService().Object);
      var result = await testController.GetById(1);

      Assert.IsType<OkObjectResult>(result);

      var userDto = ((OkObjectResult)result).Value as UserDto;
      var expected = "test@test.com";
      var expectedId = 1;

      Assert.NotNull(userDto);
      Assert.Equal(userDto.Id, expectedId);
      Assert.Equal(userDto.Email, expected);
      Assert.Equal(userDto.Username, expected);
    }

    #endregion

    #region GetUsers Tests

    [Fact]
    public void GetUsers_Returns_200OK_And_ListOfUsers()
    {
      var testController = CreateTestController(CreateMockUserService().Object);
      var result = testController.GetUsers();

      Assert.IsType<OkObjectResult>(result);

      var users = ((OkObjectResult)result).Value as List<UserDto>;
      var expected = 3;

      Assert.Equal(users.Count, expected);
      Assert.Equal(users.OfType<UserDto>().Count(), expected);
    }

    #endregion
  }
}