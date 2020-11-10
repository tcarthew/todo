using Todo.API.Services;

namespace Todo.API.UnitTests.Services
{
  public class TodoServiceTests : TodoTestBase
  {
    private ITodoService _todoService;

    public TodoServiceTests()
    {
      _todoService = new TodoService(_context);
      _context.Database.EnsureCreated();
    }
  }
}