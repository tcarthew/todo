using System;

namespace Todo.API.Models.Auth
{
  public class AuthenticateDto
  {
    public string Token { get; set; }
    public DateTime Expires { get; set; }

    public AuthenticateDto()
    {
    }

    public AuthenticateDto(string token, DateTime expires)
      : this()
    {
      this.Token = token;
      this.Expires = expires;
    }
  }
}