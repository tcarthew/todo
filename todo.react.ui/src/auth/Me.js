import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { me } from '../store/queries/auth'; 

const Me = () => {
  const dispatch = useDispatch();

  const { loaded } = useSelector(state => state);
  const token = useSelector(state => state.auth.token);
  const profile = useSelector(state => state.auth.me);

  useEffect(() => {
    if (!loaded) {
      me(dispatch, token);
    }
  });
  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="form-center">
          <h1 className="h3 mb-3 font-weight-normal">Me</h1>
          <div className="form-group text-left">
            <label>Username</label>
            <input
              type="text"
              name="username"
              autoComplete="none"
              className="form-control"
              placeholder="Username"
              readOnly
              value={profile?.username}
            />
          </div>
          <div className="form-group text-left">
            <label>Email</label>
            <input
              type="text"
              name="email"
              autoComplete="none"
              className="form-control"
              placeholder="Email"
              readOnly
              value={profile?.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Me;
