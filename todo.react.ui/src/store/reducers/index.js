import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import auth from './auth';
import todos from './todos';
import users from './users';

const configureReducers = (history) => combineReducers({
  auth,
  todos,
  users,
  router: connectRouter(history)
});

export default configureReducers