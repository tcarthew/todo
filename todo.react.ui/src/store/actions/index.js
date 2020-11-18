
import { 
  AUTH_USER,
  AUTH_ERROR,
  REGISTER_USER,
  TODO_LIST,
  TODO_ERROR,
  TODO_GET,
  TODO_UPDATE,
  TODO_DELETE
} from './types';
import axios from 'axios';

const API_URL = 'http://localhost:5000';
const AUTH_URL = `${API_URL}/api/auth`;
const REGISTER_URL = `${AUTH_URL}/register`;

// auth
export const login = (formProps, onComplete) => async (dispatch) => {
  try {
    const payload = {
      email: formProps.username,
      password: formProps.password
    };
    const response = await axios.post(AUTH_URL, payload);

    dispatch({ type: AUTH_USER, payload: response.data.token });
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

// todos
const TODOS_URL = `${API_URL}/api/todos`;

function getConfig(token) {
  return {
    headers: {
      'Authorization': `bearer ${token}`
    }
  }  
}

export const getTodos = (token) => async (dispatch) => {
  try {
    const response = await axios.get(TODOS_URL, getConfig(token));

    dispatch({ type: TODO_LIST, payload: response.data });
  } catch (err) {
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const getTodoById = (token, id) => async (dispatch) => {
  try {
    const response = await axios.get(`${TODOS_URL}/${id}`, getConfig(token));

    dispatch({ type: TODO_GET, payload: response.data });
  } catch (err) {
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const createTodo = (formProps, token, onComplete) => async (dispatch) => {
  try {
    const response = await axios.post(`${TODOS_URL}`, { ...formProps }, getConfig(token));

    dispatch({ type: TODO_UPDATE, payload: null });
    onComplete(response.data);
  } catch (err) {
    console.log('error: ', err);
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const updateTodo = (formProps, token, onComplete) => async (dispatch) => {
  try {
    const response = await axios.put(`${TODOS_URL}/${formProps.id}`, { ...formProps }, getConfig(token));

    dispatch({ type: TODO_UPDATE, payload: null });
    onComplete(response.data.updated);
  } catch(err) {
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const deleteTodo = (id, token, onComplete) => async (dispatch) => {
  try {
    const response = await axios.delete(`${TODOS_URL}/${id}`, getConfig(token));
    const deleted = response.data;

    deleted.id = id;
    dispatch({ type: TODO_DELETE, payload: deleted });
    onComplete(deleted);
  } catch (err) {
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const resetSelectedTodo = () => {
  return {
    type: TODO_GET,
    payload: null
  }
}
