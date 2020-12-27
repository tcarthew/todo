import {
  AUTH_USER,
  AUTH_ERROR,
  AUTH_REGISTER_USER,
  AUTH_ME
} from './types';

export const authenticateUser = (payload) => {
  return {
    type: AUTH_USER,
    payload
  }
}

export const authenticateError = (payload) => {
  return {
    type: AUTH_ERROR,
    payload
  }
}

export const authenticateRegisterUser = (payload) => {
  return {
    type: AUTH_REGISTER_USER,
    payload
  }
}

export const authenticateMe = (payload) => {
  return {
    type: AUTH_ME,
    payload
  }
}

export const authenticateLogout = () => {
  return authenticateUser('');
}
