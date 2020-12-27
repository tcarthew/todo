import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";

import auth from './auth';
import todos from './todos';
import loaded from './loaded';

const configureReducers = (history) => combineReducers({
  loaded,
  auth,
  todos,
  router: connectRouter(history)
});

export default configureReducers