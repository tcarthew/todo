import axios from 'axios';

import { loaded, notLoaded } from '../actions/loaded';
import { authenticateUser, authenticateError, authenticateMe } from '../actions/auth';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;
const ME_URL = `${AUTH_URL}/me`;

export const authenticate = async (dispatch, username, password) => {
  dispatch(notLoaded());
  try {
    const payload = {
      email: username,
      password
    };
    const response = await axios.post(AUTH_URL, payload);

    dispatch(authenticateUser(response.data.token));
  } catch (err) {
    dispatch(authenticateError('Invalid username or password'));
  } finally {
    dispatch(loaded());
  }
}

export const me = async (dispatch, token) => {
  dispatch(notLoaded());
  try {
    const header = {
      headers: {
        'Authorization': `bearer ${token}`
      }
    };
    const response = await axios.get(ME_URL, header);

    dispatch(authenticateMe(response.data));
  } catch (err) {
    dispatch(authenticateError('Unable to retrieve details: ', err.message));
  } finally {
    dispatch(loaded());
  }
}
