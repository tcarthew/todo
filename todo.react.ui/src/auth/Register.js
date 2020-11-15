import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import * as actions from '../store/actions';

class Register extends Component {
  onSubmit = (formProps) => {
    this.props.register(formProps, () => {
      this.props.history.push("/");
    });
  }

  render() {
    const { handleSubmit, errorMessage } = this.props;
    const error = errorMessage ? <div className="alert alert-danger">{ errorMessage }</div> : null;

    return (
      <form className="form-todo" onSubmit={handleSubmit(this.onSubmit)}>
        <h1 className="h3 mb-3 font-weight-normal">Register</h1>
        { error }
        <div className="form-group text-left">
          <label>Email address</label>
          <Field
            name="username"
            type="text"
            component="input"
            autoComplete="none"
            className="form-control"
            placeholder="Email"
          />
        </div>
        <div className="form-group text-left">
          <label>Password</label>
          <Field
            name="password"
            type="password"
            component="input"
            autoComplete="none"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <button className="btn btn-lg btn-primary btn-block">Register</button>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'registerForm' })
)(Register);