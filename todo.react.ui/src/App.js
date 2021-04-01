import React, { useState } from 'react';

import Header from './Header';
import FormDialog from './dialogs/FormDialog';
import Register from './auth/Register';


const App = ({ children }) => {
    const [showDialog, setShowDialog] = useState(undefined);
    const [message, setMessage] = useState('');

    const registerUser = () => {
        console.log('registerUser');
        setMessage(undefined)
        setShowDialog(true);
    }
    const registerNewUser = (data) => {
        setMessage(`${data.username} successfully registered`)
    }
    const cancelRegisterNewUser = () => {
        setShowDialog(false);
    }

    return (
        <div className="row">
            <div className="container-fluid">
                <div className="row">
                    <Header
                        onRegisterUser={registerUser} />
                </div>
                <div className="row justify-content-center">
                    {message && <span className="alert alert-success">{message}</span> }
                </div>
                <div className="row justify-content-center">
                    {children}
                </div>
                <FormDialog
                    title="Register User"
                    showDialog={showDialog}
                    onSuccess={registerNewUser}
                    onCancel={cancelRegisterNewUser}>
                    <Register />
                </FormDialog>
            </div>
        </div>
    );
}

export default App;
