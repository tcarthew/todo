import axios from 'axios';
import {
    todoAdded,
    todoDeleted,
    todoLoadBegin,
    todoLoadEnd,
    todoSetError,
    todoEdited
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

export const createTodo = async (dispatch, formProps, token) => {
    dispatch(todoLoadBegin());
    try {
        const response = await axios.post(`${TODOS_URL}`, { ...formProps }, getConfig(token));
        const itemResponse = await axios.get(response.headers.location, getConfig(token));

        dispatch(todoAdded(itemResponse.data));
    } catch (err) {
        dispatch(todoSetError(err?.response?.data));
    } finally {
        dispatch(todoLoadEnd());
    }
}

export const updateTodo = async (dispatch, formProps, token) => {
    dispatch(todoLoadBegin());
    try {
        await axios.put(`${TODOS_URL}/${formProps.id}`, formProps, getConfig(token));
        dispatch(todoEdited(formProps));
    } catch (err) {
        dispatch(todoSetError(err?.response?.data));
    } finally {
        dispatch(todoLoadEnd());
    }
}

export const deleteTodo = async (dispatch, id, token) => {
    dispatch(todoLoadBegin());
    try {
        await axios.delete(`${TODOS_URL}/${id}`, getConfig(token));
        dispatch(todoDeleted({ id }));
    } catch (err) {
        dispatch(todoSetError(err?.response?.data));
    } finally {
        dispatch(todoLoadEnd());
    }
}
