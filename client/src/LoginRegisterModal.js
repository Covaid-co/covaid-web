import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

export default function LoginRegisterModal(props) {
    const [login, setLogin] = useState(false);

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
        title = "Welcome back!";
        body = <Login />;
        footer = <div>
                    <Button 
                        variant="link"
                        onClick={handleClick}
                    >Looking to create an account?</Button>

                </div>
    } else {
        title = "Want to help your community?";
        body = <Register state={props.state}/>
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
                {footer}
            </Modal.Body>
            <Modal.Footer>
                &nbsp;
            </Modal.Footer>
        </div>
    )
}