using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Todo.API.Models.Todo;
using Todo.API.Models.Auth;
using Todo.API.Services;
using System.Linq;

namespace Todo.API.Controllers
{
  [ApiController]
  [Route("api/todos")]
  public class TodoController : BaseController
  {
    private readonly ITodoService _todoService;

    public TodoController(IUserService userService, ITodoService todoService)
      : base(userService)
    {
      _todoService = todoService;
    }

    [Authorize()]
    [HttpPost()]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] TodoDto request)
    {
      var user = await GetUser();

      if (user == null)
      {
        return BadRequest();
      }

      var todo = await _todoService.Create(request.Title, request.Description, user);

      return CreatedAtRoute("Todos_GetById", new { id = todo.Id }, null);
    }

    [Authorize()]
    [HttpGet("{id}", Name = "Todos_GetById")]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(TodoDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
      var user = await GetUser();
      var todo = await _todoService.GetById(id);

      if (user.Id != todo.User.Id)
      {
        return Forbid();
      }

      var response = new TodoDto() 
      {
        Id = todo.Id,
        Title = todo.Title,
        Description = todo.Description,
        IsComplete = todo.IsComplete,
        LastUpdate = todo.LastUpdate,
        User = new UserDto(todo.User.Id, todo.User.UserName, todo.User.Email)
      };

      return Ok(response);
    }

    [Authorize()]
    [HttpGet()]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(IList<TodoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
      var user = await GetUser();

      if (user == null)
      {
        return BadRequest();
      }

      var todos = _todoService
        .GetAll(user.Id)
        .Select(todo => new TodoDto() {
          Id = todo.Id,
          Title = todo.Title,
          Description = todo.Description,
          IsComplete = todo.IsComplete
        }).ToList();

      return Ok(todos);
    }

    [Authorize()]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromRoute]int id, [FromBody] TodoDto request)
    {
      var user = await GetUser();
      var todo = await _todoService.GetById(id);

      if (todo == null)
      {
        return BadRequest("Invalid id");
      }

      if (user.Id != todo.User.Id)
      {
        return Forbid();
      }

      todo.Title = request.Title;
      todo.Description = request.Description;
      todo.IsComplete = request.IsComplete;
      todo.LastUpdate = DateTime.UtcNow;

      var result = await _todoService.Update(todo);

      return Ok();
    }

    [Authorize()]
    [HttpPut("{id}/IsComplete")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ToggleIsComplete([FromRoute]int id, [FromBody]TodoUpdateDto request)
    {
      var user = await GetUser();
      var todo = await _todoService.GetById(id);

      if (todo == null)
      {
        return BadRequest("Invalid id");
      }

      if (user.Id != todo.User.Id)
      {
        return Forbid();
      }

      todo.UpdateField("IsComplete", request.Value);
      
      var result = await _todoService.Update(todo);

      return Ok();
    }

    [Authorize()]
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(TodoDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete([FromRoute]int id)
    {
      var user = await GetUser();
      var todo = await _todoService.GetById(id);

      if (todo == null)
      {
        return BadRequest("Invalid id");
      }

      if (user.Id != todo.User.Id)
      {
        return Forbid();
      }

      todo = await _todoService.Delete(id);

      var response = new TodoDto() 
      {
        Title = todo.Title,
        Description = todo.Description,
        IsComplete = todo.IsComplete,
        LastUpdate = todo.LastUpdate
      };

      return Ok(response);
    }
  }
}