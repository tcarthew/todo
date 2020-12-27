import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';

import { authenticate } from '../store/queries/auth';
import { notLoaded } from '../store/actions/loaded';

const Login = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { errorMessage } = useSelector(state => state.auth);
  const { loaded } = useSelector(state => state);
  const error = loaded && errorMessage ? <div className="alert alert-danger">{ errorMessage }</div> : null;

  useEffect(() => {
    if (loaded){
      dispatch(notLoaded());
      dispatch(push('/items'));
    }
  })

  const handleSubmit = async (e) =>  {
    e.preventDefault();
    authenticate(dispatch, username, password)
  }

  return (
    <form className="form-todo" method="POST" onSubmit={handleSubmit}>
      <h1 className="h3 mb-3 font-weight-normal">Login</h1>
      { error }
      <label className="sr-only">Username</label>
      <input
        type="text"
        name="username"
        autoComplete="none"
        className="form-control"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <label className="sr-only">Password</label>
      <input
        type="password"
        name="password"
        autoComplete="none"
        className="form-control"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-lg btn-primary btn-block">Login</button>
      <p className="mt-5 mb-3 text-muted">&copy; 2020</p>
    </form>
  )
}

export default Login;