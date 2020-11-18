namespace Todo.API.Models.Auth
{
  public class UserDto
  {
    public long? Id { get; set; }
    public string Email { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }

    public UserDto()
    {
    }

    public UserDto(long id, string email, string username)
      : this()
    {
      this.Id = id;
      this.Email = email;
      this.Username = username;
    }
  }
}