using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Todo.API.Data.Entities
{
  public class TodoItem
  {
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public bool IsComplete { get; set; }
    public DateTime LastUpdate { get; set; }
    public User User { get; set; }

    public TodoItem()
    {
      this.LastUpdate = DateTime.Now;
      this.IsComplete = false;
    }

    public void UpdateField(string name, object value)
    {
      var property = this.GetType().GetProperty(name);

      if (property == null)
      {
        throw new Exception($"Invalid field specified '{name}'");
      }
      
      property.SetValue(this, value);
    }
  }
}