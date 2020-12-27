import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history'

import App from './App';
import reportWebVitals from './reportWebVitals';
import RouteGuard from './RouteGuard';

import Login from './auth/Login';
import Register from './auth/Register';
import Me from './auth/Me';
import TodoItems from './todos/TodoItems';
import TodoItemAddEdit from './todos/TodoItemAddEdit';

import configureStore from './store/configure';

const history = createBrowserHistory({})
const store = configureStore(history, {
  loaded: false,
  auth: {
    token: localStorage.getItem('token')
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
          <App>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/me" component={Me} />
            <RouteGuard path="/items/:mode/:id" exact component={TodoItemAddEdit} />
            <RouteGuard path="/items/:mode" exact component={TodoItemAddEdit} />
            <RouteGuard path="/items" exact component={TodoItems} />
          </App>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
