namespace Todo.API.Models.Todo
{
  public class TodoRequest
  {
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; }
  }
}