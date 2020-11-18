import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

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
        isSelected={todo.id === this.state?.selected?.id}
        onEdit={this.editTodo}
        onDelete={this.deleteTodo}
      />
    ));

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md">
            <div className="d-flex justify-content-between">
              <h1 className="h3 font-weight-normal mt-1 ml-2">Todo Items</h1>
              <button className="btn btn-primary mt-1 mb-1 mr-1" onClick={this.addTodo}>+</button>
            </div>
            <div className="list-group text-left">
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