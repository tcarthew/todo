import { AUTH_USER, AUTH_ERROR, REGISTER_USER } from '../actions/types';

const INITIAL_STATE = {
  token: '',
  errorMessage: '',
  username: '',
};

export default function(state = INITIAL_STATE, action) {
  if (action.type === AUTH_USER) {
    updateToken(action.payload);

    return {
      ...state,
      token: action.payload,
      username: '',
      errorMessage: ''
    }
  }

  if (action.type === AUTH_ERROR) {
    return {
      ...state,
      errorMessage: action.payload
    }
  }

  if (action.type === REGISTER_USER) {
    return {
      ...state,
      username: action.payload,
      errorMessage: ''
    };
  }

  return state;
}

function updateToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  }

  if (!token) {
    localStorage.removeItem('token');
  }
}