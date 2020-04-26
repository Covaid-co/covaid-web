import React, {useState, useEffect} from "react";
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { useFormFields } from "./libs/hooksLib"; 
import { generateURL } from './Helpers';
import orgImg from './assets/org.png'
import NavBar from './components/NavBar'
import { validateEmail } from './Helpers';
import Cookie from 'js-cookie'
const queryString = require('query-string');


export default function OrgAdminRegister(props) {
    const [registered, setRegistered] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [name, setName] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => { 
        const assocID = queryString.parse(props.location.search).associationID;
        let params = {'associationID': assocID}
		var url = generateURL( "/api/association/get_assoc/?", params);
        fetch(url)
            .then((response) => {
                if (response.ok) {
                    response.json().then(association => {
                        if (association._id) {
                            setName(association.name)
                            setLoaded(true);
                        }
                    });
                }
            })
            .catch((e) => {
                alert('Seems to be server issues. Please try again later.');
            });
    }, [props.location.search]);

    const handleSubmit = async e => {

        e.preventDefault();
        const AssociationID = queryString.parse(props.location.search).associationID;
        let form = {
            'admin': {
                'first_name': fields.first_name,
                'last_name': fields.last_name,
                'email': fields.email,
                'password': fields.password,
                'association_id': AssociationID
            }
        };

        const response = await fetch('/api/association-admin/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        });

        console.log(response)

        if (response.ok) {
            Cookie.remove('org_token');
            Cookie.remove('admin_token');
            setRegistered(true);
            
        } else {
            alert('Error with admin registration. Please contact us');
        }
    }

    const invalidInput = () => {
        if (fields.first_name.length === 0) {
            return true;
        }
        if (fields.last_name.length === 0) {
            return true;
        }
        if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
                return true;
        }
        if (fields.password.length === 0) {
            return true;
        } 
        if (fields.password !== fields.confirmPassword) {
            return true;
        }
        return false;
    }

    const handleShowModal = () => {

    }

    if (!loaded) {
        return <></>;
    }

    if (registered) {
        return (
            <Redirect to={{
                pathname: '/organizationPortal',
            }} />
        );
    } else {
        return (
            <>
            <NavBar isLoggedIn={false} orgAdmin={true} handleShowModal={handleShowModal} />
            <Container style={{maxWidth: 1500}}>
                <Row>
                    <Col md={6} id="login-container">
                        <h1 id="home-heading">Covaid for {name} Admins</h1>
                        <p id="home-subheading" style={{fontSize: 16}}>Manage and delegate your volunteers efficiently through our all-in-one platform.</p>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={6} style={{paddingRight: 5}}>
                                    <Form.Group controlId="first_name" bssize="large" style={{marginBottom: 5}}>
                                        <Form.Control placeholder="First Name" value={fields.first_name} onChange={handleFieldChange}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={6} style={{paddingLeft: 5}}>
                                    <Form.Group controlId="last_name" bssize="large" style={{marginBottom: 5}}>
                                        <Form.Control placeholder="Last Name" value={fields.last_name} onChange={handleFieldChange}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="email" bssize="large" style={{marginBottom: 5}}>
                                        <Form.Control type="email" placeholder="Email" value={fields.email} onChange={handleFieldChange}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="password" bssize="large" style={{marginBottom: 5}}>
                                        <Form.Control placeholder="Password" type="password" value={fields.password} onChange={handleFieldChange}/>
                                    </Form.Group>
                                </Col>
                                <Col xs={12}>
                                    <Form.Group controlId="confirmPassword" bssize="large" style={{marginBottom: 5}}>
                                        <Form.Control placeholder="Confirm Password" type="password" value={fields.confirmPassword} onChange={handleFieldChange}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button style={{marginTop: 10, width: 200}} disabled={invalidInput()} id="large-button" type="submit">Register as an admin</Button>
                        </Form>
                    </Col>
                    <Col md={6} style={{marginTop: 50}}>
                        <img id="org-img" alt="" src={orgImg}></img>
                    </Col>
                </Row>
            </Container>
            </>
        );
    }
}
