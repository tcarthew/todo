using System.Collections.Generic;
using System.Threading.Tasks;
using Todo.API.Data.Entities;

namespace Todo.API.Services
{
  public interface ITodoService
  {
    Task<TodoItem> Create(string title, string description, User user);
    IList<TodoItem> GetAll(long userId);
    Task<TodoItem> GetById(int id);
    Task<int> Update(TodoItem item);
    Task<TodoItem> Delete(int id);
  }  
}