import {
    TODO_SET_SELECTED,
    TODO_SET_LIST,
    TODO_LOAD_BEGIN,
    TODO_LOAD_END,
    TODO_ADDED,
    TODO_DELETED,
    TODO_EDITED
} from "../actions/types";

const INITIAL_STATE = {
    items: [],
    selected: null,
    error: '',
    loading: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case TODO_SET_SELECTED:
            return {
                ...state,
                selected: action.payload
            }

        case TODO_ADDED:
            return {
                ...state,
                items: [...state.items, action.payload]
            }
        
        case TODO_EDITED:
            const index = state.items.findIndex(i => i.id == action.payload.id);

            if (index !== -1){
                state.items[index] = { ...action.payload }
            }

            return { ...state }

        case TODO_DELETED:
            return {
                ...state,
                items: state.items.filter(i => i.id !== action.payload.id)
            }

        case TODO_SET_LIST:
            return {
                ...state,
                items: [...action.payload],
                errorMessage: ''
            }

        case TODO_LOAD_BEGIN:
            return {
                ...state,
                loading: true
            }

        case TODO_LOAD_END:
            return {
                ...state,
                loading: false
            }

        default:
            return state;
    }
}