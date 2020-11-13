namespace Todo.API.Models.Todo
{
    public class TodoUpdateResponse
    {
      public int Updated { get; set; }

      public TodoUpdateResponse(int updated)
      {
        this.Updated = updated;
      }
    }
}