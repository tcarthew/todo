import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../store/actions';
import RequiresAuth from '../auth/RequiresAuth';
import TodoItem from './TodoItem';

class TodoItems extends Component {

  componentDidMount() {
    this.props.getTodos(this.props.token);
  }

  addTodo = () => {
    this.props.history.push('/items/add');
  }

  editTodo = (todo) => {
    this.props.history.push(`/items/edit/${todo.id}`);
  }
  deleteTodo = (todo) => {
    this.props.deleteTodo(todo.id, this.props.token, (deletedTodo) => {
      console.log('deleted: ', deletedTodo);
      this.props.history.push('/Items');
    });
  }

  render() {
    const { todos } = this.props;
    const items = todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onEdit={this.editTodo}
        onDelete={this.deleteTodo}
      />
    ));

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <div className="d-flex justify-content-between pt-2 pb-2">
              <div></div>
              <a href="#" className="mr-2" onClick={this.addTodo}><FontAwesomeIcon icon={ faPlus } size="2x" /></a>
            </div>
            <div className="accordion text-left">
            { items }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    errorMessage: state.todos.errorMessage,
    todos: state.todos.items
  }
}

export default compose(
  connect(mapStateToProps, actions)
)(RequiresAuth(TodoItems));