import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { register } from '../store/mutations/auth';

const Register = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { loaded } = useSelector(state => state);
  const { errorMessage, username: registeredUsername } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(dispatch, username, password);
  }

  const error = loaded && errorMessage ? <div className="alert alert-danger">{ errorMessage }</div> : null;
  const registered = loaded && registeredUsername;
  const registrationSuccess = 
    <div className="alert alert-success">
      { registeredUsername } registered! Proceed to <Link to="/">Login</Link>
    </div>;
  const registrationForm = 
    <form className="form-center" onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 font-weight-normal">Register</h1>
      { error }
      <div className="form-group text-left">
        <label>Email Address</label>
        <input
          type="text"
          name="username"
          autoComplete="none"
          className="form-control"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group text-left">
        <label>Password</label>
        <input
          type="password"
          name="password"
          autoComplete="none"
          className="form-control"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-lg btn-primary btn-block">Register</button>
    </form>

  return registered ? registrationSuccess : registrationForm;
}

export default Register;
