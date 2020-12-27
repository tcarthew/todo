import axios from 'axios';

import { loaded, notLoaded } from '../actions/loaded';
import { authenticateRegisterUser, authenticateError } from '../actions/auth';

const API_URL = 'http://localhost:5000';
const REGISTER_URL = `${API_URL}/api/auth/register`;

export const register = async (dispatch, username, password) => {
  dispatch(notLoaded());
  try {
    const payload = {
      email: username,
      password
    };
    
    await axios.post(REGISTER_URL, payload);

    dispatch(authenticateRegisterUser({username}));
  } catch (err) {
    dispatch(authenticateError(err.message));
  }
  finally {
    console.log('dispatch loaded');
    dispatch(loaded());
  }
}