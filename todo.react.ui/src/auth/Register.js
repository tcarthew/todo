import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormFieldValues } from '../hooks/useFormFields';
import { register } from '../store/mutations/auth'

const buttonStyle = {
    width: '75px',
    marginLeft: '5px'
}

const Register = ({ onCancel, onSubmit }) => {
    const [fields, setFieldValue] = useFormFieldValues({
        username: '',
        password: ''
    });
    const dispatch = useDispatch();
    const { error, loading, username } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { username, password } = fields;

        register(dispatch, username, password);
    }

    useEffect(() => {
        if ((username?.length > 0) && !loading) {
            if (onSubmit) {
                onSubmit({ username });
            }
        }
    }, [username, loading])

    return (
        
            <form onSubmit={handleSubmit}>
                <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        {error ? <div className="alert alert-danger">{error}</div> : null}
                        <div className="form-group text-left">
                            <label>Email Address</label>
                            <input
                                type="text"
                                name="username"
                                autoComplete="none"
                                className="form-control form-control-sm"
                                placeholder="Email"
                                value={fields.username}
                                onChange={setFieldValue}
                                required
                            />
                        </div>
                        <div className="form-group text-left">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="none"
                                className="form-control form-control-sm"
                                placeholder="Password"
                                value={fields.password}
                                onChange={setFieldValue}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-8">
                        <button className="btn btn-sm btn-secondary" style={buttonStyle} onClick={onCancel}>Cancel</button>&nbsp;
                        { !loading && <button className="btn btn-sm btn-primary" style={buttonStyle}>Register</button> }
                        { loading &&
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div> }
                    </div>
                </div>
                </div>
            </form>
        
    );
}

export default Register;
