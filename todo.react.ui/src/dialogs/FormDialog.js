import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const FormDialog = (props) => {
    const { title, onSuccess, onCancel, showDialog, children } = props;
    const [show, setShow] = useState(false);
    
    const handleHide = () => {
        if (onCancel){
            onCancel();
        }
    }
    const handleSubmit = (data) => {
        setShow(false);

        if (onSuccess){
            onSuccess(data);
        }
    }
    const formView = React.cloneElement(
        React.Children.only(children),
        { 
            onCancel: () => handleHide(),
            onSubmit: (data) => {
                handleSubmit(data);
            }
        }
    );

    useEffect(() => {
        setShow(showDialog)
    }, [showDialog]);

    return (
        <Modal show={show} onHide={handleHide}>
            <Modal.Header closeButton>
                <Modal.Title>{ title }</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { formView }
            </Modal.Body>
        </Modal>
    );
};

export default FormDialog;