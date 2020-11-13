using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Todo.API.Data;
using Todo.API.Data.Entities;

namespace Todo.API.Services
{
  public class TodoService : ITodoService
  {
    private readonly TodoDbContext _context;

    public TodoService(TodoDbContext context)
    {
      this._context = context;
    }

    public async Task<TodoItem> Create(string title, string description, User user)
    {
      var todoItem = new TodoItem() {
        Title = title,
        Description = description,
        IsComplete = false,
        LastUpdate = DateTime.UtcNow,
        User = user
      };

      _context.TodoItems.Add(todoItem);
      await _context.SaveChangesAsync();

      return todoItem;
    }

    public async Task<TodoItem> Delete(int id)
    {
      var todoItem = _context.TodoItems.Find(id);

      _context.TodoItems.Remove(todoItem);
      await _context.SaveChangesAsync();

      return todoItem;
    }

    public IList<TodoItem> GetAll(long userId)
    {
      return _context.TodoItems.Where(t => t.User.Id == userId).ToList();
    }

    public async Task<TodoItem> GetById(int id)
    {
      return await _context.TodoItems.FindAsync(id);
    }

    public async Task<int> Update(TodoItem item)
    {
      _context.TodoItems.Update(item);
      
      return await _context.SaveChangesAsync();
    }
  }
}
