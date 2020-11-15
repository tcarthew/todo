import { AUTH_USER, AUTH_ERROR } from './types';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;

export const login = (formProps, onComplete) => async (dispatch) => {
  try {
    const payload = {
      Email: formProps.username,
      Password: formProps.password
    };
    const response = await axios.post(AUTH_URL, payload);

    dispatch({ type: AUTH_USER, payload: response.data.jwtToken });
    onComplete();
  } catch (err) {
    console.log('error: ', err);
    dispatch({ type: AUTH_ERROR, payload: 'error' });
  }
}

export const logout = (onComplete) => {
  return {
    type: AUTH_USER,
    payload: ''
  };
}