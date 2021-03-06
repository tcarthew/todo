import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import { authenticateLogout } from './store/actions/auth';

const Header = () => {
  const dispatch = useDispatch();

  const token = useSelector(state => state.auth.token);

  const logoutClick = () => {
    dispatch(authenticateLogout());
    dispatch(push('/'));
  }

  const renderLinks = () => {
    if (token) {
      return (
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/items">Items</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/me">My Profile</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="#" onClick={() => logoutClick()}>Logout</Link>
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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">Todo</a>

      <div className="collapse navbar-collapse">
        { renderLinks() }
      </div>
    </nav>
  )
}

export default Header;
