import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

import Login from './auth/Login';
import Register from './auth/Register';
import Items from './todos/Items';

import reducers from './store/reducers';

const store = createStore(
  reducers,
  {
    auth: {
      token: localStorage.getItem('token')
    }
  },
  composeWithDevTools(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <Route path="/" exact component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/items" component={Items} />
        </App>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
