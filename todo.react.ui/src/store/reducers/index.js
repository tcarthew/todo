import { combineReducers } from "redux";
import { reducer as formReducer } from 'redux-form';

import auth from './auth';
import todos from './todos';

export default combineReducers({
  auth,
  todos,
  form: formReducer
});