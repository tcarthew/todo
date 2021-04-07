import {
    AUTH_USER,
    AUTH_ERROR,
    AUTH_REGISTER_USER,
    AUTH_ME,
    AUTH_BEGIN,
    AUTH_END
} from '../actions/types';

const INITIAL_STATE = {
    token: '',
    error: '',
    username: '',
    me: undefined,
    loading: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case AUTH_USER:
            updateToken(action.payload);
            return {
                ...state,
                token: action.payload,
                username: '',
                error: '',
            }

        case AUTH_ERROR:
            return {
                ...state,
                error: action.payload,
            }

        case AUTH_REGISTER_USER:
            return {
                ...state,
                username: action.payload.username,
                error: ''
            };

        case AUTH_ME:
            return {
                ...state,
                error: '',
                me: {
                    ...action.payload
                }
            }

        case AUTH_BEGIN:
            return {
                ...state,
                loading: true,
                error: ''
            }

        case AUTH_END:
            return {
                ...state,
                loading: false
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