import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Cookie from 'js-cookie'
import { validateEmail } from './Helpers'

export default function NewLogin(props) {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: ""
    });

    const [mode, setMode] = useState(true);

    function validateForm() {
        return validateEmail(fields.email) && fields.password.length > 0;
    }

    function validateForgotForm() {
        return fields.email.length > 0;
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
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    Cookie.set("token", data.user.token);
                    props.hideModal();
                    window.location.href = window.location.protocol + '//' + window.location.host + '/volunteerPortal';
                });
            } else {
                if (response.status === 403) {
                    alert("Check your email for a verification link prior to logging in.")
                } else if (response.status === 401) {
                    alert("Incorrect password.")
                }
            }
        })
        .catch((e) => {
            alert('Seems to be some issues on our end, please try again later.')
        });
    };

    const handleSubmitForgot = async e => {
        e.preventDefault();
        let form = {
            'email': fields.email,
        };
        console.log(form)
        fetch('/api/users/emailpasswordresetlink', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                alert("Check your email for password link!")
            } else {
                alert('Error sending link!')
            }
        })
        .catch((e) => {
            alert('Error')
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
            <Modal show={props.showModal} dialogClassName="location-set-modal" onHide={props.hideModal} style={{marginTop: 110}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Reset your password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitForgot}>
                        <Row>
                            <Col xs={12}>
                                <Form.Group controlId="email" bssize="large">
                                    <Form.Control 
                                        type="email"
                                        placeholder="Enter your email"
                                        value={fields.email}
                                        onChange={handleFieldChange}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{marginTop: 10}} id="large-button" disabled={!validateForgotForm()} type="submit">
                            Send me a password reset link
                        </Button>
                        <p id="or">---------</p>
                        <Button id="large-button-empty" onClick={() => setMode(!mode)}>Back to login</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    }
}