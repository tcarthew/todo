import {
    TODO_SET_SELECTED,
    TODO_SET_LIST,
    TODO_LOAD_BEGIN,
    TODO_LOAD_END,
    TODO_SET_ERROR,
    TODO_ADDED,
    TODO_DELETED,
    TODO_EDITED
} from './types';

export const todoSetSelected = (payload) => {
    return {
        type: TODO_SET_SELECTED,
        payload
    }
}

export const todoSetList = (payload) => {
    return {
        type: TODO_SET_LIST,
        payload
    }
}

export const todoSetError = (payload) => {
    return {
        type: TODO_SET_ERROR,
        payload
    }
}

export const todoAdded = (payload) => {
    return {
        type: TODO_ADDED,
        payload
    }
}

export const todoEdited = (payload) => {
    return {
        type: TODO_EDITED,
        payload
    }
}

export const todoDeleted = (payload) => {
    return {
        type: TODO_DELETED,
        payload
    }
}

export const todoLoadBegin = () => ({ type: TODO_LOAD_BEGIN });
export const todoLoadEnd = () => ({ type: TODO_LOAD_END });