import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

export default function LoginRegisterModal() {
    const [login, setLogin] = useState(true);

    function handleClick(e) {
        e.preventDefault();
        if (login) {
            setLogin(false);
        } else {
            setLogin(true);
        }
    }

    var body;
    var title;
    var footer;
    if (login) {
        title = "Sign in to Cov-Aid";
        body = <Login />;
        footer = <div>
                    <Button 
                        variant="link"
                        onClick={handleClick}
                    >Looking to create an account?</Button>

                </div>
    } else {
        title = "Create an account to post offers";
        body = <Register />
        footer = <div>
                    <Button 
                        variant="link"
                        onClick={handleClick}
                    >Already have an account?</Button>
                </div>
    }

    return (
        <div>
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            <Modal.Footer>
                {footer}
            </Modal.Footer>
        </div>
    )
}