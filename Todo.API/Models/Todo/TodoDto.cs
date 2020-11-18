using System;
using Todo.API.Models.Auth;

namespace Todo.API.Models.Todo
{
  public class TodoDto
  {
    public long? Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime? LastUpdate { get; set; }

    public UserDto User { get; set; }
  }
}