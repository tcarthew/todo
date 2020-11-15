import { AUTH_USER, AUTH_ERROR } from '../actions/types';

const INITIAL_STATE = {
  token: '',
  errorMessage: ''
};

export default function(state = INITIAL_STATE, action) {
  if (action.type === AUTH_USER) {
    updateToken(action.payload);

    return {
      ...state,
      token: action.payload
    }
  }

  if (action.type === AUTH_ERROR) {
    return {
      ...state,
      errorMessage: action.payload
    }
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