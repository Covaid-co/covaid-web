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
        footer = <div style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}>
                    <Button 
                        variant="link"
                        onClick={handleClick}
                        style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}
                    >Looking to create an account?</Button>

                </div>
    } else {
        title = "Want to help your community?";
        body = <Register state={props.state}/>
        footer = <div style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}>
                    <Button 
                        variant="link"
                        onClick={handleClick}
                        style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}
                    >Already have an account?</Button>
                </div>
    }

    return (
        <div>
            <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {footer}
                {body}
            </Modal.Body>
            <Modal.Footer>
                &nbsp;
            </Modal.Footer>
        </div>
    )
}