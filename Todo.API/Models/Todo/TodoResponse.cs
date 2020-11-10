using System;

namespace Todo.API.Models.Todo
{
  public class TodoResponse
  {
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime LastUpdate { get; set; }
  }
}