import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import * as actions from '../store/actions';

class Me extends Component {

  componentDidMount() {
    this.props.getMe(this.props.token);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <form className="col-md">
            <h1 className="h3 mb-3 font-weight-normal">Me</h1>
            <div className="form-group text-left">
              <label>Username</label>
              <Field
                name="username"
                type="text"
                component="input"
                autoComplete="none"
                className="form-control"
                placeholder="Username"
              />
            </div>
            <div className="form-group text-left">
              <label>Email</label>
              <Field
                name="email"
                type="text"
                component="input"
                autoComplete="none"
                className="form-control"
                placeholder="Email"
              />
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    token: state.auth.token,
    initialValues: state.auth.me
  }
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'meForm', enableReinitialize: true })
)(Me);

