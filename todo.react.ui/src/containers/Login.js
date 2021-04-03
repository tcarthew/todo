import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { authenticate } from '../store/queries/auth';
import { useFormFieldValues } from '../hooks/useFormFields';

const Login = () => {
    const dispatch = useDispatch();
    const { error, loading } = useSelector(state => state.auth);
    const [fields, setFieldValue] = useFormFieldValues({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        authenticate(dispatch, fields);
    }

    return (
        <div className="col-4">
            <form method="POST" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-12">
                        <h1 className="h3 mb-3 font-weight-normal">Login</h1>
                        {error ? <div className="alert alert-danger">{error}</div> : null}
                        <div className="form-group text-left">
                            <label>Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control form-control-sm"
                                placeholder="Username"
                                autoComplete="none"
                                value={fields.username}
                                onChange={setFieldValue}
                            />
                        </div>
                        <div className="form-group text-left">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-sm"
                                placeholder="Password"
                                autoComplete="none"
                                value={fields.password}
                                onChange={setFieldValue}
                            />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-end">
                    <div className="col-2">
                        { !loading && <button className="btn btn-primary btn-sm" disabled={loading}>Login</button> }
                        { loading &&
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;