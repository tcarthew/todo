import {
    AUTH_USER,
    AUTH_ERROR,
    AUTH_REGISTER_USER,
    AUTH_ME,
    AUTH_BEGIN,
    AUTH_END
} from './types';

export const authenticateUser = (payload) => ({
    type: AUTH_USER,
    payload
});
export const authenticateError = (payload) => ({
    type: AUTH_ERROR,
    payload
});
export const authenticateRegisterUser = (payload) => ({
    type: AUTH_REGISTER_USER,
    payload
});
export const authenticateMe = (payload) => ({
    type: AUTH_ME,
    payload
})
export const authenticateLogout = () => authenticateUser('');
export const authenticateBegin = () => ({ type: AUTH_BEGIN });
export const authenticateEnd = () => ({ type: AUTH_END });