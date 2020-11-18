import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import * as actions from '../store/actions';

class Login extends Component {

  onSubmit = (formProps) => {
    this.props.login(formProps, () => {
      this.props.history.push('/items');
    });
  }

  componentDidMount() {
    this.props.change('username', this.props.username);
  }

  render() {
    const { handleSubmit, errorMessage, username } = this.props;
    const error = errorMessage ? <div className="alert alert-danger">{ errorMessage }</div> : null;
    const registered = username ? 
      <div className="alert alert-success">
        User <strong>{ username }</strong> successfully registered. Proceed to login.
      </div> : null;
    
    return (
      <form className="form-todo" onSubmit={ handleSubmit(this.onSubmit) }>
        <h1 className="h3 mb-3 font-weight-normal">Login</h1>
        { registered }
        { error }
        <label className="sr-only">Username</label>
        <Field
          name="username"
          type="text"
          component="input"
          autoComplete="none"
          className="form-control"
          placeholder="Username"
        />
        <label className="sr-only">Password</label>
        <Field
          name="password"
          type="password"
          component="input"
          autoComplete="none"
          className="form-control"
          placeholder="Password"
        />
        <button className="btn btn-lg btn-primary btn-block">Login</button>
        <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return { 
    errorMessage: state.auth.errorMessage,
    username: state.auth.username
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'loginForm' })
)(Login);