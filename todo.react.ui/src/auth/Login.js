import React, { Component } from 'react';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import * as actions from '../store/actions';

class Login extends Component {

  onSubmit = (formProps) => {
    this.props.login(formProps, () => {
      this.props.history.push('/items');
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="form-signin" onSubmit={ handleSubmit(this.onSubmit) }>
        <h1 className="h3 mb-3 font-weight-normal">Login</h1>
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
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'loginForm' })
)(Login);