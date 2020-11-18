namespace Todo.API.Models.Auth
{
  public class UserResponse
  {
    public long Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }

    public UserResponse(long id, string username, string email)
    {
      this.Id = id;
      this.Username = username;
      this.Email = email;
    }
  }
}