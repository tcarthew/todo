
import { 
  TODO_ADD,
  TODO_LIST,
  TODO_ERROR,
  TODO_GET,
  TODO_UPDATE,
  TODO_DELETE
} from './types';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

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

    dispatch({ type: TODO_ADD, payload: response.data });
    onComplete();
  } catch (err) {
    console.log('error: ', err);
    dispatch({ type: TODO_ERROR, payload: err?.response?.data });
  }
}

export const updateTodo = (formProps, token, onComplete) => async (dispatch) => {
  try {
    await axios.put(`${TODOS_URL}/${formProps.id}`, { ...formProps }, getConfig(token));
    dispatch({ type: TODO_UPDATE, payload: null });
    onComplete();
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
