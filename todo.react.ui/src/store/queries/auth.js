import axios from 'axios';
import { push } from 'connected-react-router';

import {
    authenticateUser,
    authenticateError,
    authenticateMe,
    authenticateBegin,
    authenticateEnd
} from '../actions/auth';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;
const ME_URL = `${AUTH_URL}/me`;

export const authenticate = async (dispatch, user) => {
  dispatch(authenticateBegin());
  try {
    const payload = {
      email: user.username,
      password: user.password
    };
    const response = await axios.post(AUTH_URL, payload);

    dispatch(authenticateUser(response.data.token));
    dispatch(push('/items'));
  } catch (err) {
    dispatch(authenticateError('Invalid username or password'));
  } finally {
    dispatch(authenticateEnd());
  }
}

export const me = async (dispatch, token) => {
  dispatch(authenticateBegin());
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
    dispatch(authenticateEnd());
  }
}
