import React, { Component } from 'react';
import { connect } from 'react-redux';

export default RequiresAuth => {
  class ComposedComponent extends Component {
    componentDidMount() {
      this.shouldNavigateAway();
    }

    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      if (!this.props.auth) {
        this.props.history.push('/');
      }
    }

    render() {
      return <RequiresAuth {...this.props} />
    }
  }

  function mapStateToProps(state) {
    return { auth: state.auth.token };
  }

  return connect(mapStateToProps)(ComposedComponent);
}