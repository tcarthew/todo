import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const buttonStyle = {
    width: '75px',
    marginLeft: '5px'
}

const ConfirmDialog = ({ title, description, showDialog, onClose }) => {
    const [show, setShow] = useState(false);
    const handleClose = (value = false) => {
        setShow(false);
        if (onClose) {
            onClose(value);
        }
    }

    useEffect(() => {
        setShow(showDialog);
    }, [showDialog])

    return (
        <Modal show={show} onHide={() => handleClose(false)}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {description}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-small btn-default" style={buttonStyle} onClick={() => handleClose(false)}>Cancel</button>
                <button className="btn btn-small btn-primary" style={buttonStyle} onClick={() => handleClose(true)}>OK</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmDialog;