import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

class TodoItem extends Component {

  state = {
    isCollapsed: true
  };

  handleEdit = () => this.props.onEdit(this.props.todo);
  handleDelete = () => this.props.onDelete(this.props.todo);
  handleToggle = () => this.setState({ isCollapsed: !this.state.isCollapsed });

  render() {
    const { todo } = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0 h5 text-muted" onClick={this.handleToggle}>
            { todo.title }
          </h5>
        </div>
        <div className={`card-body ${this.state.isCollapsed ? 'collapse' : ''}`}>
          <p>{todo.description}</p>
          <div className="d-flex flex-row-reverse">
            <a href="#" className="mr-1" onClick={this.handleDelete}><FontAwesomeIcon icon={ faTrash } size="2x" /></a>
            <a href="#" className="mr-2" onClick={this.handleEdit}><FontAwesomeIcon icon={ faEdit } size="2x" /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoItem;