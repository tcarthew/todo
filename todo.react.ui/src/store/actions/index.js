import { AUTH_USER, AUTH_ERROR, REGISTER_USER } from './types';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;
const REGISTER_URL = `${AUTH_URL}/register`;

export const login = (formProps, onComplete) => async (dispatch) => {
  try {
    const payload = {
      email: formProps.username,
      password: formProps.password
    };
    const response = await axios.post(AUTH_URL, payload);

    dispatch({ type: AUTH_USER, payload: response.data.jwtToken });
    onComplete();
  } catch (err) {
    console.log('error: ', err.response.data);
    dispatch({ type: AUTH_ERROR, payload: 'Invalid username or password' });
  }
}

export const register = (formProps, onComplete) => async (dispatch) => {
  try {
    const payload = {
      email: formProps.username,
      password: formProps.password
    };
    
    await axios.post(REGISTER_URL, payload);
    dispatch({ type: REGISTER_USER, payload: formProps.username });
    onComplete();
  }
  catch (err) {
    dispatch({ type: AUTH_ERROR, payload: err.response.data });
  }
}

export const logout = (onComplete) => {
  return {
    type: AUTH_USER,
    payload: ''
  };
}