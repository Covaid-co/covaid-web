import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';

export default function LoginRegisterModal(props) {
    const [login, setLogin] = useState(false);
    const [justRegistered, setJustRegistered] = useState(false)

    function handleClick(e) {
        e.preventDefault();
        if (login) {
            setLogin(false);
        } else {
            setLogin(true);
        }
    }

    const switchToLogin = () => {
        setJustRegistered(true);
    }

    var header = <></>;
    var body = <></>;
    var realFooter = <></>;
    if (login) {
        header = <Modal.Header closeButton>
                    <Modal.Title>Welcome Back!</Modal.Title>
                </Modal.Header>;
        body = <Modal.Body>
                    <div style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}>
                        <Button 
                            variant="link"
                            onClick={handleClick}
                            style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}
                        >Looking to create an account?</Button>
                    </div>
                    <Login />
                </Modal.Body>;
    } else if (justRegistered) {
        header = <Modal.Header closeButton style = {{backgroundColor: '#ccebd2', borderBottom: '0 none'}}>
                    <Modal.Title 
                        style = {{color: '#155724'}}>
                        Thank you for signing up to be a volunteer!
                    </Modal.Title>
                </Modal.Header>;
        realFooter = <Modal.Footer 
                        style = {{backgroundColor: '#ccebd2', 
                                color: '#155724', 
                                display: 'block', 
                                borderTop: '0 none',
                                marginTop: -20}}>
                        <p>
                            You should receive a confirmation to register as a volunteer in your email soon. 
                        </p>
                    </Modal.Footer>;
    } else {
        header = <Modal.Header closeButton>
                    <Modal.Title>Want to help your community?</Modal.Title>
                </Modal.Header>;
        body = <Modal.Body>
                    <div style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}>
                        <Button 
                            variant="link"
                            onClick={handleClick}
                            style={{margin: "auto", textAlign:"center", display: "inlineBlock"}}
                        >Already have an account?</Button>
                    </div>
                    <Register state={props.state} switchToLogin={switchToLogin}/>
                </Modal.Body>;
    }

    return (
        <div>
            {header}
            {body}
            {realFooter}
        </div>
    )
}