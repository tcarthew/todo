import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import configureReducers from './reducers'

export default function configureStore(history, initialState) {
  return createStore(
    configureReducers(history),
    initialState,
    composeWithDevTools(applyMiddleware(thunk, routerMiddleware(history)))
  );
}