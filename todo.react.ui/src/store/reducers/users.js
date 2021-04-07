import {
    USER_ERROR,
    USER_LOAD_BEGIN,
    USER_LOAD_END
} from '../actions/types';

const INITIAL_STATE = {
    error: '',
    loading: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case USER_ERROR:
            return {
                ...state,
                error: action.payload
            }

        case USER_LOAD_BEGIN:
            return {
                ...state,
                loading: true
            }


        case USER_LOAD_END:
            return {
                ...state,
                loading: false
            }
    }

    return state;
}
