import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { me } from '../store/queries/auth';
import { useFormFieldValues } from '../hooks/useFormFields';
import { updateUserName } from '../store/mutations/user';
import { authenticateMe } from '../store/actions/auth';

const Me = () => {
    const dispatch = useDispatch();
    const { me: profile, error, token } = useSelector(state => state.auth);
    const { user } = useSelector(state => state);
    
    useEffect(() => {
        me(dispatch, token);
    }, []);

    const MeForm = ({ profile, loading, onFormSubmit }) => {
        const [fields, setFieldValue] = useFormFieldValues(profile);
        const handleSubmit = (e) => {
            e.preventDefault();

            if (onFormSubmit){
                onFormSubmit(fields);
            }
        }

        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group text-left">
                    <label>First name</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        name="firstName"
                        placeholder="First Name"
                        value={fields.firstName}
                        onChange={setFieldValue}
                    />
                </div>
                <div className="form-group text-left">
                    <label>Last name</label>
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        name="lastName"
                        placeholder="Last Name"
                        value={fields.lastName}
                        onChange={setFieldValue}
                    />
                </div>
                <div className="form-group text-left">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        autoComplete="none"
                        className="form-control form-control-sm"
                        placeholder="Username"
                        readOnly
                        value={fields.username}
                        onChange={setFieldValue}
                    />
                </div>
                <div className="form-group text-left">
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        autoComplete="none"
                        className="form-control form-control-sm"
                        placeholder="Email"
                        readOnly
                        value={fields.email}
                        onChange={setFieldValue}
                    />
                </div>
                <div className="row justify-content-end">
                    <div className="col-2">
                        {!loading && <button className="btn btn-primary btn-sm" disabled={loading}>Update</button>}
                        {loading &&
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>}
                    </div>
                </div>
            </form>
        )
    }

    const updateProfile = (fields) => {
        const newProfile = {
            ...profile,
            ...fields
        };
        console.log('updating')
        updateUserName(dispatch, newProfile, token)
            .then(() => {
                dispatch(authenticateMe(newProfile));
                console.log('username update not fail')
            })
            .catch(() => {
                console.log('username update fail');
            })
    }

    return (
        <div className="col">
            <div className="row justify-content-begin">
                <div className="col-2">
                    <h1>My Profile</h1>
                    { error || user?.error }
                </div>
            </div>
            <div className="row justify-content-begin">
                <div className="col-6">
                    { profile && <MeForm
                        profile={profile}
                        loading={user?.loading}
                        onFormSubmit={updateProfile}
                    /> }
                </div>
            </div>
        </div>

    );
}

export default Me;
