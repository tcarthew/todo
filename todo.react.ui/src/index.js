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
import ItemsList from './todos/ItemsList'
import ItemForm from './todos/ItemForm';

import configureStore from './store/configure';

const history = createBrowserHistory({})
const store = configureStore(history, {
    auth: {
        token: localStorage.getItem('token')
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App>
                <Route path="/" exact component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/me" component={Me} />
                {/* <RouteGuard path="/items/:mode/:id" exact component={ItemForm} />
                <RouteGuard path="/items/:mode" exact component={ItemForm} /> */}
                <RouteGuard path="/items" exact component={ItemsList} />
            </App>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
