import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from './store/actions'

class Header extends Component {

  onLogoutClick = () => {
    this.props.logout(() => {
      this.props.history.push("/");
    });
  }

  renderLinks() {
    if (this.props.token) {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/items">Items</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/me">My Profile</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={this.onLogoutClick}>Logout</Link>
          </li>
        </ul>
      );
    }

    return (
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">Todo</a>

        <div className="collapse navbar-collapse">
          {this.renderLinks()}
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default withRouter(connect(mapStateToProps, actions)(Header));