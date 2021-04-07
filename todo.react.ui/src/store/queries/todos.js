import axios from 'axios';
import {
    todoLoadBegin,
    todoLoadEnd,
    todoSetList,
    todoSetSelected,
    todoSetError
} from '../actions/todos';

const API_URL = 'http://localhost:5000';
const TODOS_URL = `${API_URL}/api/todos`;

function getConfig(token) {
    return {
        headers: {
            'Authorization': `bearer ${token}`
        }
    }
}

export const getTodos = async (dispatch, token) => {
    dispatch(todoLoadBegin());
    try {
        const response = await axios.get(TODOS_URL, getConfig(token));

        dispatch(todoSetList(response.data));
    } catch (err) {
        dispatch(todoSetError(err?.response?.data));
    } finally {
        dispatch(todoLoadEnd());
    }
}

export const getTodoById = (token, id) => async (dispatch) => {
    dispatch(todoLoadBegin());
    try {
        const response = await axios.get(`${TODOS_URL}/${id}`, getConfig(token));

        dispatch(todoSetSelected(response.data));
    } catch (err) {
        dispatch(todoSetError(err?.response?.data));
    } finally {
        dispatch(todoLoadEnd());
    }
}
