using Todo.API.Data.Entities;
using Todo.API.Services;
using Xunit;

namespace Todo.API.UnitTests.Services
{
  public class TodoServiceTests : TodoTestBase
  {
    public TodoServiceTests()
    {
    }

    [Fact]
    public async void CanCreateTodo()
    {
      using (var context = CreateContext())
      {
        var todoService = new TodoService(context);
        var user = new User() { Email = "test@test.com", PasswordHash = "!@#QWE" };
        var todoItem = await todoService.Create("Test", "Test", user);
        
        Assert.NotNull(todoItem);
        Assert.True(todoItem.Id > 0);

        await todoService.Delete(todoItem.Id);
      }
    }

    [Fact]
    public async void CanGetAllTodosByUserId()
    {
      using (var context = CreateContext())
      {
        var todoService = new TodoService(context);
        var user = new User() { Email = "test@test.com", PasswordHash = "!@#QWE" };
        
        await todoService.Create("Test", "Test", user);
        await todoService.Create("Test1", "Test1", user);

        var todos = todoService.GetAll(user.Id);

        Assert.Equal(2, todos.Count);
      }
    }

    [Fact]
    public async void CanGetTodoById()
    {
      using (var context = CreateContext())
      {
        var todoService = new TodoService(context);
        var user = new User() { Email = "test@test.com", PasswordHash = "!@#QWE" };
        var todo1 = await todoService.Create("Test", "Test", user);
        var todo2 = await todoService.Create("Test1", "Test1", user);

        var getTodo = await todoService.GetById(todo2.Id);

        Assert.Equal(getTodo, todo2);
      }
    }

    [Fact]
    public async void CanUpdateExistingTodo()
    {
      using (var context = CreateContext())
      {
        var todoService = new TodoService(context);
        var user = new User() { Email = "test@test.com", PasswordHash = "!@#QWE" };
        var todo = await todoService.Create("Test", "Test", user);

        todo.Title = "Test Updated";
        todo.IsComplete = true;

        var result = await todoService.Update(todo);
        var updated = await todoService.GetById(todo.Id);

        Assert.Equal(1, result);
        Assert.Equal("Test Updated", updated.Title);
        Assert.True(updated.IsComplete);
      }
    }
  }
}