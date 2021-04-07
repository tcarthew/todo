import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history'

import App from './App';
import reportWebVitals from './reportWebVitals';
import RouteGuard from './RouteGuard';

import Login from './containers/Login';
import Me from './containers/Me';
import ItemsList from './containers/ItemsList'

import configureStore from './store/configure';

const history = createBrowserHistory({})
const store = configureStore(history, {
    auth: {
        token: localStorage.getItem('token')
    },
    using: {
        error: '',
        loading: false
    }
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App>
                <Route path="/" exact component={Login} />
                <Route path="/me" component={Me} />
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
