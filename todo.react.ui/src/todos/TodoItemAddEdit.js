import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import * as actions from '../store/actions';
import RequiresAuth from '../auth/RequiresAuth';

class TodoItemAddEdit extends Component {

  cancelSave = (e) => {
    this.props.resetSelectedTodo();
    this.props.history.push('/Items');
    e.preventDefault();
  }

  componentDidMount() {
    if (this.props.match.params) {
      if (this.props.match.params.mode === 'edit') {
        this.props.getTodoById(this.props.token, this.props.match.params.id);
        return;
      }
    }
  }

  onSubmit = (formProps) => {
    const { mode } = this.props.match.params;

    if (mode === 'edit') {
      this.props.updateTodo(formProps, this.props.token, (updated) => {
        console.log('Updated: ', updated);
        this.props.history.push('/Items');
      });
    }

    if (mode === 'add') {
      this.props.createTodo(formProps, this.props.token, () => {
        this.props.history.push('/Items');
      });
    }
  }

  render() {
    const { handleSubmit, errorMessage } = this.props;
    const error = errorMessage ? <div className="alert alert-danger">{errorMessage}</div> : null;

    return (
      <div className="container-fluid">
        <div className="row">
          <form className="col-md form-todo" onSubmit={handleSubmit(this.onSubmit)}>
            <h1 className="h3 mb-3 font-weight-normal">Todo Detail</h1>
            {error}
            <div className="form-group text-left">
              <label>Title</label>
              <Field 
                name="id"
                type="hidden"
                component="input"
              />
              <Field
                name="title"
                type="text"
                component="input"
                autoComplete="none"
                className="form-control"
                placeholder="Title"
              />
            </div>
            <div className="form-group text-left">
              <label>Description</label>
              <Field
                name="description"
                component="textarea"
                className="form-control"
              />
            </div>
            <div className="form-group form-check text-left">
              <Field
                name="isComplete"
                component="input"
                type="checkbox"
                className="form-check-input"
              />
              <label className="form-check-label">Is Complete</label>
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary w-25 mr-2">Save</button>
              <button className="btn btn-warning w-25" onClick={this.cancelSave}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    errorMessage: state.todos.errorMessage,
    initialValues: state.todos.selectedItem
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'todoItemForm', enableReinitialize: true })
)(RequiresAuth(TodoItemAddEdit));
