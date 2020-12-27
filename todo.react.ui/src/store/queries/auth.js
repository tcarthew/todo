import axios from 'axios';

import { loaded, notLoaded } from '../actions/loaded';
import { authenticateUser, authenticateError } from '../actions/auth';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;

export const authenticate = async (dispatch, username, password) => {
  dispatch(notLoaded())
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
