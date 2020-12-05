using Moq;
using Todo.API.Controllers;
using Todo.API.Data.Entities;
using Todo.API.Models.Auth;
using Todo.API.Services;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;

namespace Todo.API.UnitTests.Controllers
{
  public class AuthenticationControllerTests
  {
    private const string DUMMY_TOKEN_SIG = "rNZQndjf1Bf-11c9A7qELIKEiDPTTFBonflNgBN-cCk";
    private string DUMMY_TOKEN = 
      $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1laWQiOiI5OSIsImp0aSI6IjRkNmI4MTEwLTMxODYtNDc3ZC1iMDc5LTVlOWIzMGJkNjNkOCIsInJvbGUiOiJVc2VyIiwiZXhwIjoxNjA1OTY1MDA2fQ.{DUMMY_TOKEN_SIG}";
    private const string INVALID_DUMMY_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJqdGkiOiI0ZDZiODExMC0zMTg2LTQ3N2QtYjA3OS01ZTliMzBiZDYzZDgiLCJyb2xlIjoiVXNlciIsImV4cCI6MTYwNTk2NTAwNn0.pSOaczagbN5E-Kexym7g61GJTA7zbyMGKaGV8vk_jmg";
    private const int INTERNAL_SERVER_ERROR = 500;
    private DefaultHttpContext _mockHttpContext;
    
    public AuthenticationControllerTests()
    {
      this._mockHttpContext = new DefaultHttpContext();
    }

    private Mock<IUserService> CreateMockUserService(User stubGetUser, User stubCreateUser, bool throwsErrorOnCreate = false)
    {
      var mockUserService = new Mock<IUserService>();

      mockUserService.Setup(m => m.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync(stubGetUser);
      mockUserService.Setup(m => m.GetUserById(It.IsAny<Int64>())).ReturnsAsync(stubGetUser);

      if (!throwsErrorOnCreate) {
        mockUserService.Setup(m => m.CreateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).ReturnsAsync(stubCreateUser);
      }
      
      if (throwsErrorOnCreate){
          mockUserService.Setup(m => m.CreateAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>())).Throws(new Exception("Test Error"));
      }
      
      mockUserService.Setup(m => m.CreateAuthorizationToken(It.IsAny<User>())).ReturnsAsync(CreateDummyToken());

      return mockUserService;
    }

    private SecurityToken CreateDummyToken()
    {
      return new JwtSecurityTokenHandler().ReadToken(DUMMY_TOKEN) as JwtSecurityToken;
    }

    private SecurityToken CreateInvalidDummyToken()
    {
      return new JwtSecurityTokenHandler().ReadToken(INVALID_DUMMY_TOKEN) as JwtSecurityToken;
    }

    #region Register Tests

    [Fact]
    public async void Register_Returns_422Error_WithEmptyUserDto()
    {
      var testUserService = CreateMockUserService(null, null);
      var testController = new AuthenticationController(testUserService.Object);
      var result = await testController.Register(new UserDto());

      Assert.IsType<UnprocessableEntityObjectResult>(result);
    }

    [Fact]
    public async void Register_Returns_422Error_ForDuplicateUser()
    {
      var testUser = new User() { 
        Id = 1,
        Email = "test@test.com",
        UserName = "test@test.com"
      };
      var testUserService = CreateMockUserService(testUser, testUser);
      var testController = new AuthenticationController(testUserService.Object);
      var result = await testController.Register(new UserDto() {
        Email = "test@test.com",
        Password = "test123"
      });

      Assert.IsType<UnprocessableEntityObjectResult>(result);
    }

    [Fact]
    public async void Register_Returns_500Error_ForException()
    {
      var testCreateUser = new User() { 
        Id = 1,
        Email = "test@test.com",
        UserName = "test@test.com"
      };
      var testUserService = CreateMockUserService(null, testCreateUser, true);
      var testController = new AuthenticationController(testUserService.Object);
      var result = await testController.Register(new UserDto() {
        Email = "test@test.com",
        Password = "test123"
      });

      Assert.IsType<ObjectResult>(result);
      Assert.Equal(((ObjectResult)result).StatusCode.GetValueOrDefault(), INTERNAL_SERVER_ERROR);
    }

    [Fact()]
    public async void Register_Returns_201Created()
    {
      var testCreateUser = new User() { 
        Id = 1,
        Email = "test@test.com",
        UserName = "test@test.com"
      };
      var testUserService = CreateMockUserService(null, testCreateUser, false);
      var testController = new AuthenticationController(testUserService.Object);
      var result = await testController.Register(new UserDto() {
        Email = "test@test.com",
        Password = "test123"
      });
      var expectedRouteName = "User_GetById";

      Assert.IsType<CreatedAtRouteResult>(result);
      Assert.Equal((result as CreatedAtRouteResult).RouteName, expectedRouteName);
      Assert.Equal((result as CreatedAtRouteResult).RouteValues["id"], testCreateUser.Id);
    }

    #endregion

    #region Authenticate test

    [Fact]
    public async void Authenticate_Returns_400BadRequest()
    {
      var mockUserService = CreateMockUserService(null, null);

      mockUserService.Setup(m => m.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<String>())).ReturnsAsync(false);

      var testController = new AuthenticationController(mockUserService.Object);
      var result = await testController.Authenticate(new UserDto() { Email = "test@test.com", Password = "test123" });

      Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async void Authenticate_Returns_200OK_WithJwtToken()
    {
      var testUser = new User() { 
        Id = 1,
        Email = "test@test.com",
        UserName = "test@test.com"
      };
      var mockUserService = CreateMockUserService(testUser, null);

      mockUserService.Setup(m => m.CheckPasswordAsync(It.IsAny<User>(), It.IsAny<String>())).ReturnsAsync(true);

      var testController = new AuthenticationController(mockUserService.Object);
      var result = await testController.Authenticate(new UserDto() { Email = "test@test.com", Password = "test123" });

      Assert.IsType<OkObjectResult>(result);

      var authenticateDto = ((result as OkObjectResult).Value as AuthenticateDto);

      Assert.Equal($"{authenticateDto.Token}{DUMMY_TOKEN_SIG}", DUMMY_TOKEN);
    }

    #endregion

    #region Me

    [Fact]
    public async void Me_Returns_Unauthorized_WhenNoTokenSpecified()
    {
      var testController = new AuthenticationController(CreateMockUserService(null, null).Object);
      var mockControllerContext = new ControllerContext() { HttpContext = _mockHttpContext };

      testController.ControllerContext = mockControllerContext;
      
      var result = await testController.Me();

      Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async void Me_Returns_Unauthorized_TokenHasInvalidId()
    {
      var testController = new AuthenticationController(CreateMockUserService(null, null).Object);
      var mockControllerContext = new ControllerContext() { HttpContext = _mockHttpContext };

      _mockHttpContext.Request.Headers["Authorization"] = $"bearer {INVALID_DUMMY_TOKEN}";
      testController.ControllerContext = mockControllerContext;

      var result = await testController.Me();

      Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async void Me_Returns_BadRequest_WhenNoUserFound()
    {
      var testController = new AuthenticationController(CreateMockUserService(null, null).Object);
      var mockControllerContext = new ControllerContext() { HttpContext = _mockHttpContext };

      _mockHttpContext.Request.Headers["Authorization"] = $"bearer {DUMMY_TOKEN}";
      testController.ControllerContext = mockControllerContext;

      var result = await testController.Me();

      Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async void Me_Returns_200OK_ForValidToken()
    {
      var testUser = new User() { 
        Id = 1,
        Email = "test@test.com",
        UserName = "test@test.com"
      };
      var testController = new AuthenticationController(CreateMockUserService(testUser, null).Object);
      var mockControllerContext = new ControllerContext() { HttpContext = _mockHttpContext };

      _mockHttpContext.Request.Headers["Authorization"] = $"bearer {DUMMY_TOKEN}";
      testController.ControllerContext = mockControllerContext;

      var result = await testController.Me();

      Assert.IsType<OkObjectResult>(result);

      var expected = ((result as OkObjectResult).Value as UserDto);

      Assert.Equal(expected.Id, testUser.Id);
      Assert.Equal(expected.Email, testUser.Email);
    }

    #endregion
  }
}