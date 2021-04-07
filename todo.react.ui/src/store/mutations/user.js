import axios from 'axios';

import {
    userLoadBegin,
    userLoadEnd,
    userSetError
} from '../actions/users';

const API_URL = 'http://localhost:5000';
const USERS_URL = `${API_URL}/api/users`;

function getConfig(token) {
    return {
        headers: {
            'Authorization': `bearer ${token}`
        }
    }
}

export const updateUserName = async (dispatch, { firstName, lastName }, token) => {
    dispatch(userLoadBegin());
    try {
        console.log('putting: ', { firstName, lastName })
        await axios.put(`${USERS_URL}/name`, { firstName, lastName }, getConfig(token));
    } catch (err) {
        console.log('error: ', err);
        dispatch(userSetError(err?.response?.data))
    } finally {
        dispatch(userLoadEnd());
    }
}
