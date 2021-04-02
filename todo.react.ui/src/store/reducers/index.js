import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

import auth from './auth';
import todos from './todos';

const configureReducers = (history) => combineReducers({
  auth,
  todos,
  router: connectRouter(history)
});

export default configureReducers