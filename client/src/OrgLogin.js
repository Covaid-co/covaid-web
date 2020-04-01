import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Cookie from 'js-cookie'

export default function OrgLogin(props) {
    const [fields, handleFieldChange] = useFormFields({
        email: "",
        password: "",
    });

    function validateForm() {
        return fields.email.length > 0 && fields.password.length > 0;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        let form = {
            'association': {
                'email': fields.email,
                'password': fields.password
            }
        };
        fetch('/api/association/login/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    console.log("Login successful")
                    Cookie.set("org_token", data.user.token);
                    props.handleHideLogin()
                    props.login()
                });
            } else {
                alert('Incorrect Login!')
            }
        })
        .catch((e) => {
            alert('Incorrect Login!')
        });
      };

    return (
        <Modal show={props.showLogin} size='sm' style={{marginTop: 110}}>
            <Modal.Header>
                <Modal.Title>Login to your portal</Modal.Title>
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
                                    onChange={handleFieldChange}
                                />

                            </Form.Group>
                        </Col>
                        <Col xs={12}>
                            <Form.Group controlId="password" bssize="large">
                                <Form.Control 
                                    placeholder="Password"
                                    value={fields.password}
                                    onChange={handleFieldChange}
                                    type="password"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Button style={{marginTop: 10}} id="nextPage" disabled={!validateForm()} type="submit">Sign In</Button>
                    {/* <p id="or">--- o r ---</p>
                    <Button id="createAccount" onClick={() => {props.handleHideLogin(); props.handleShowRegistration();}}>Volunteer Sign Up</Button> */}
                </Form>
            </Modal.Body>
        </Modal>
    )


}