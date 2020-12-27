import { AUTH_USER, AUTH_ERROR, AUTH_REGISTER_USER, AUTH_ME } from '../actions/types';

const INITIAL_STATE = {
  token: '',
  errorMessage: '',
  username: '',
  me: null,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case AUTH_USER:
      updateToken(action.payload);
      return {
        ...state,
        token: action.payload,
        username: '',
        errorMessage: '',
      }
    
    case AUTH_ERROR:
      return {
        ...state,
        errorMessage: action.payload,
      }

    case AUTH_REGISTER_USER:
      return {
        ...state,
        username: action.payload.username,
        errorMessage: ''
      };

    case AUTH_ME:
      return {
        ...state,
        errorMessage: '',
        me: {
          ...action.payload
        }
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