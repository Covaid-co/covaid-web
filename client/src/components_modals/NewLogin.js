import React, {useState} from 'react';
import Cookie from 'js-cookie'
import { useFormFields } from "../libs/hooksLib";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ResetPassword from './ResetPassword';
import { validateEmail } from '../Helpers'
import { currURL } from '../constants';

/**
 * Login modal for volunteers
 */

export default function NewLogin(props) {
    const [mode, setMode] = useState(true);
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    function validateForm() {
        return validateEmail(fields.email) && fields.password.length > 0;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        let form = {
            'user': {
                'email': fields.email,
                'password': fields.password
            }
        };
        fetch('/api/users/login/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    Cookie.set("token", data.user.token);
                    props.hideModal();
                    window.location.href = currURL + '/volunteerPortal';
                });
            } else {
                if (response.status === 403) {
                    alert("Check your email for a verification link prior to logging in.")
                } else if (response.status === 401) {
                    alert("Incorrect password.")
                }
            }
        }).catch(e => {
            alert(e)
        });
    };

    const handleSubmitForgot = async e => {
        e.preventDefault();
        let form = { 'email': fields.email };

        fetch('/api/users/emailpasswordresetlink', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                alert("Check your email for password link!")
            } else {
                alert('Error sending link!')
            }
        }).catch(e => {
            console.log(e);
        });
    };

    if (mode) {
        return (
            <Modal size='sm' show={props.showModal} onHide={props.hideModal} style={{marginTop: 110}}>
                <Modal.Header closeButton>
                    <Modal.Title>Volunteer Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12}>
                                <Form.Group controlId="email" bssize="large">
                                    <Form.Control 
                                        type="email"
                                        placeholder="Email"
                                        value={fields.email}
                                        onChange={handleFieldChange}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group controlId="password" bssize="large">
                                    <Form.Control 
                                        placeholder="Password"
                                        value={fields.password}
                                        onChange={handleFieldChange}
                                        type="password"/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{marginTop: 10}} id="large-button" disabled={!validateForm()} type="submit">
                            Sign In
                        </Button>
                        <Button id="large-button-empty" onClick={() => {setMode(!mode);}}>Reset your password</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    } else {
        return (
            <ResetPassword showModal={props.showModal} hideModal={() => setMode(!mode)} 
                        handleSubmitForgot={handleSubmitForgot} fields={fields} handleFieldChange={handleFieldChange}/>
        )
    }
}