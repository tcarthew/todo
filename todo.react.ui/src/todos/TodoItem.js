const TodoItem = (props) => {
  const { todo, isSelected, onEdit, onDelete } = props;
  const handleEdit = () => onEdit(todo);
  const handleDelete = () => onDelete(todo);

  return (
    <a href="#" className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}>
      <div className="d-flex">
        <div className="flex-grow-1">
          <h5>{todo.title}</h5>
          <p className="mb-1">{todo.description}</p>
        </div>
        <div>
          <button className="btn btn-primary ml-1 btn-block" onClick={handleEdit}>Edit</button>
          <button className="btn btn-danger ml-1 btn-block" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </a>
  );
}

export default TodoItem;