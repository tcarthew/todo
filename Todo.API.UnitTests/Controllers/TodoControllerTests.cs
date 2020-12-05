using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Todo.API.Controllers;
using Todo.API.Data.Entities;
using Todo.API.Models.Todo;
using Todo.API.Services;
using Xunit;

namespace Todo.API.UnitTests.Controllers
{
  public class TodoControllerTests
  {
    private const string MOCK_TOKEN_SIG = "rNZQndjf1Bf-11c9A7qELIKEiDPTTFBonflNgBN-cCk";
    private static string MOCK_USER_99_TOKEN = 
      $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1laWQiOiI5OSIsImp0aSI6IjRkNmI4MTEwLTMxODYtNDc3ZC1iMDc5LTVlOWIzMGJkNjNkOCIsInJvbGUiOiJVc2VyIiwiZXhwIjoxNjA1OTY1MDA2fQ.{MOCK_TOKEN_SIG}";
    private readonly User User99 = new User() {
      Id = 99,
      Email = "99@test.com",
      UserName = "99@test.com"
    };
    private static string MOCK_USER_98_TOKEN = 
      $"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJuYW1laWQiOiI5OCIsImp0aSI6IjRkNmI4MTEwLTMxODYtNDc3ZC1iMDc5LTVlOWIzMGJkNjNkOCIsInJvbGUiOiJVc2VyIiwiZXhwIjoxNjA1OTY1MDA2fQ.{MOCK_TOKEN_SIG}";
    private readonly User User98 = new User() {
      Id = 98,
      Email = "98@test.com",
      UserName = "98@test.com"
    };

    private DefaultHttpContext _mockHttpContext;

    public TodoControllerTests()
    {
      this._mockHttpContext = new DefaultHttpContext();
    }

    private Mock<IUserService> CreateMockUserService(bool setUpInvalidLogin = false)
    {
      var mockUserService = new Mock<IUserService>();

      mockUserService.Setup(m => m.GetUserById(It.IsAny<long>())).ReturnsAsync((long id) => {
        if (setUpInvalidLogin || (id == 98)){
          return this.User98;
        }
        if (id == 99){
          return this.User99;
        }

        return null;
      });

      return mockUserService;
    }

    private Mock<ITodoService> CreateMockTodoService()
    {
      var mockTodoService = new Mock<ITodoService>();
      var todos =  new List<TodoItem>() {
        new TodoItem() { Id = 2, Title = "Test 2", Description = "Test 2", User = User99 },
        new TodoItem() { Id = 2, Title = "Test 3", Description = "Test 3", User = User99 },
      };

      mockTodoService.Setup(m => m.Create(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<User>())).ReturnsAsync((string title, string desc, User user) => 
        new TodoItem() { 
          Id = 1, 
          Title = title,
          Description = desc,
          LastUpdate = new DateTime(2020, 12, 1, 12, 0, 0),
          User = user
        });
      mockTodoService.Setup(m => m.GetById(It.IsAny<int>())).ReturnsAsync((int id) => {
        if (id == -1) {
          return null;
        }

        return new TodoItem() { 
            Id = 1,
            Title = "Test",
            Description = "Test",
            LastUpdate = new DateTime(2020, 12, 1, 12, 0, 0),
            User = User99
          };
        });
      mockTodoService.Setup(m => m.GetAll(It.IsAny<long>())).Returns((long id) => todos.Where(t => t.User.Id == id).ToList());
      mockTodoService.Setup(m => m.Update(It.IsAny<TodoItem>()));
      mockTodoService.Setup(m => m.Delete(It.IsAny<int>())).ReturnsAsync(new TodoItem() {
        Id = 1,
        Title = "Test",
        Description = "Test",
        LastUpdate = new DateTime(2020, 12, 1, 12, 0, 0),
        User = User99
      });

      return mockTodoService;
    }

    private TodoController CreateTestController(string userToken = "", bool setUpInvalidLogin = false)
    {
      var testController = new TodoController(CreateMockUserService(setUpInvalidLogin).Object, CreateMockTodoService().Object);
      var mockControllerContext = new ControllerContext() { HttpContext = this._mockHttpContext  };

      if (!string.IsNullOrEmpty(userToken)){
        _mockHttpContext.Request.Headers["Authorization"] = $"bearer {userToken}";
      }
      
      testController.ControllerContext = mockControllerContext;

      return testController;
    }

    #region Create Tests

    [Fact]
    public async void Create_Fails_When_NoUserLoggedIn()
    {
      var controller = CreateTestController();
      var todoDto = new TodoDto()
        {
          Title = "Test Todo",
          Description = "Test Todo Desc"
        };
      var result = await controller.Create(todoDto);

      Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async void Create_Succeeeds_For_LoggedInUser()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var todoDto = new TodoDto()
        {
          Title = "Test Todo",
          Description = "Test Todo"
        };
      var result = await controller.Create(todoDto);

      Assert.IsType<CreatedAtRouteResult>(result);

      var actualResult = result as CreatedAtRouteResult;
      var expected  = "Todos_GetById";

      Assert.Equal(actualResult.RouteName, expected);
    }

    #endregion

    #region GetById Tests

    [Fact]
    public async void GetById_Fails_CanOnlyGetOwnTodos()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN, true);
      var result = await controller.GetById(1);

      Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async void GetById_Returns200OK()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.GetById(1);

      Assert.IsType<OkObjectResult>(result);

      var actual = (OkObjectResult)result;
      var todo = actual.Value as TodoDto;
      var expectedTodId = 1;
      var expectedUserId = 99;

      Assert.NotNull(todo);
      Assert.Equal(todo.Id, expectedTodId);
      Assert.Equal(todo.User.Id, expectedUserId);
    }

    #endregion

    #region GetAll Tests

    [Fact]
    public async void GetAll_Fails_WhenNoUserLoggedIn()
    {
      var controller = CreateTestController();
      var result = await controller.GetAll();

      Assert.IsType<BadRequestResult>(result);
    }

    [Fact]
    public async void GetAll_Filters_OnLoggedInUser_Zero_For_User98()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN, true);
      var result = await controller.GetAll();

      Assert.IsType<OkObjectResult>(result);

      var actual = (OkObjectResult)result;
      var list = actual.Value as IList<TodoDto>;
      var expected = 0;

      Assert.NotNull(list);
      Assert.Equal(list.Count, expected);
    }

    [Fact]
    public async void GetAll_Filters_OnLoggedInUser_Two_For_User99()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.GetAll();

      Assert.IsType<OkObjectResult>(result);

      var actual = (OkObjectResult)result;
      var list = actual.Value as IList<TodoDto>;
      var expected = 2;

      Assert.NotNull(list);
      Assert.Equal(list.Count, expected);
    }

    #endregion
  
    #region Update Tests

    [Fact]
    public async void Update_Fails_When_Todo_Doesnt_Exist_For_Id()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.Update(-1, new TodoDto());

      Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async void Update_Fails_When_User_LoggedIn_DoesNotMatch_Todo_User()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN, true);
      var result = await controller.Update(1, new TodoDto());

      Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async void Update_Suceeds_For_ValidUser()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.Update(1, new TodoDto() { Title = "test update", Description = "test desc", IsComplete = true });

      Assert.IsType<OkResult>(result);
    }

    #endregion
  
    #region ToggleIsComplete Tests

    [Fact]
    public async void ToggleIsComplete_Fails_When_Todo_Doesnt_Exist_For_Id()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.ToggleIsComplete(-1, new TodoUpdateDto() { Value = false });

      Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async void ToggleIsComplete_Fails_When_User_LoggedIn_DoesNotMatch_Todo_User()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN, true);
      var result = await controller.ToggleIsComplete(1, new TodoUpdateDto() { Value = false });

      Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async void ToggleIsComplete_Succeeds_For_ValidUser()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.ToggleIsComplete(1, new TodoUpdateDto() { Value = false });

      Assert.IsType<OkResult>(result);
    }

    #endregion
  
    #region Delete Tests

    [Fact]
    public async void Delete_Fails__When_Todo_Doesnt_Exist_For_Id()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.Delete(-1);

      Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async void Delete_Fails_When_User_LoggedIn_DoesNotMatch_Todo_User()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN, true);
      var result = await controller.Delete(1);

      Assert.IsType<ForbidResult>(result);
    }

    [Fact]
    public async void Delete_Succeeds_For_ValidUser()
    {
      var controller = CreateTestController(MOCK_USER_99_TOKEN);
      var result = await controller.Delete(1);

      Assert.IsType<OkObjectResult>(result);

      var actual = ((OkObjectResult)result).Value as TodoDto;
      var expectedTitle = "Test";
      var expectedDesc = "Test";

      Assert.Equal(actual.Title, expectedTitle);
      Assert.Equal(actual.Description, expectedDesc);
    }

    #endregion
  }
}