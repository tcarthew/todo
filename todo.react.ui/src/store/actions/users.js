import {
    USER_ERROR,
    USER_LOAD_BEGIN,
    USER_LOAD_END
} from '../actions/types';

export const userSetError = (payload) => {
    return {
        type: USER_ERROR,
        payload
    }
}

export const userLoadBegin = () => ({ type: USER_LOAD_BEGIN });
export const userLoadEnd = () => ({ type: USER_LOAD_END });