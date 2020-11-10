using Microsoft.AspNetCore.Identity;

namespace Todo.API.Data.Entities
{
  public class Role: IdentityRole<long>
  {
    public const string RoletypeAdmin = "Admin";
    public const string RoletypeUser = "User";
  }
}