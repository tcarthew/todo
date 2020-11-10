using System;

namespace Todo.API.Models.Auth
{
  public class AuthenticateResponse
  {
    public string JwtToken { get; set; }
    public DateTime Expires { get; set; }

    public AuthenticateResponse()
    {
    }

    public AuthenticateResponse(string jwtToken, DateTime expires)
    {
      this.JwtToken = jwtToken;
      this.Expires = expires;
    }
  }
}