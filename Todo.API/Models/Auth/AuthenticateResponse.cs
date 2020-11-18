using System;

namespace Todo.API.Models.Auth
{
  public class AuthenticateResponse
  {
    public string Token { get; set; }
    public DateTime Expires { get; set; }

    public AuthenticateResponse()
    {
    }

    public AuthenticateResponse(string token, DateTime expires)
    {
      this.Token = token;
      this.Expires = expires;
    }
  }
}