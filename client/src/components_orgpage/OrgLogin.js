import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "../libs/hooksLib";

import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Cookie from 'js-cookie'
import orgImg from '../assets/org.png'
import requestsImg from '../assets/requests.png'
import mapsImg from '../assets/mapscreen.png'
import orgscreenImg from '../assets/orgscreen.png'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer';
import GetStarted from './GetStarted';

export default function OrgLogin(props) {
    const [fields, handleFieldChange] = useFormFields({
        emailOrg: "",
        email: "",
        passOrg: "",
    });

    const [mode, setMode] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(0);
    const [showForgot, setShowForgot] = useState(false);

    function validateForm() {
        return fields.emailOrg.length > 0 && fields.password.length > 0;
    }

    function validateForgotForm() {
        return fields.email.length > 0;
    }

    useEffect(() => {
        if (props.orgReset) {
            setShowForgot(props.orgReset)
        }
    }, [props.orgReset])

    const handleSubmitForgot = async e => {
        e.preventDefault();
        let form = {
            'email': fields.email,
        };
        // console.log(form)
        fetch('/api/association/emailpasswordresetlink', {
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
            alert('Error');
        });
    };

    const tryLogin = async () => {
        try {
            let form = {
                'association': {
                    'email': fields.emailOrg,
                    'password': fields.passOrg
                }
            };
            const response = await fetch('/api/association/login/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            });
            const responseJSON = await response.json();
            if (!responseJSON.errors) {
                Cookie.set("org_token", responseJSON.user.token);
                props.setShowLogin(false);
                props.login(false);
                return;
            } else {
                form = {
                        'admin': {
                            'email': fields.emailOrg,
                            'password': fields.passOrg
                        }
                    }
                const adminResponse = await fetch('/api/association-admin/login/', {
                    method: 'post',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(form)
                });

                const adminResponseJSON = await adminResponse.json();
                if (!adminResponseJSON.errors) {
                    Cookie.set("admin_token", adminResponseJSON.admin.token);
                    Cookie.set("org_token", adminResponseJSON.admin.orgToken);
                    props.setShowLogin(false);
                    props.login(true);
                    return;
                } else {
                    alert('Login is incorrect. Please try again.');
                }
            }
        } catch (e) {
            alert('Login is incorrect. Please try again.');
        }
    }

    const handleSubmit = async e => {
        e.preventDefault();
        await tryLogin();
    };

    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 'get started') {
            modal = <GetStarted showModal={showModal} hideModal={() => setShowModal(false)}/>;
        }
        return modal;
    }

    const handleShowModal = (type) => {
		setModalType(type);
		setShowModal(true);
	}

    return (<>
        <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
        <Container style={{maxWidth: 1500}}>
            <Row>
                <Col md={6} id="login-container">
                    <h1 id="home-heading">Covaid for Organizations</h1>
                    <p id="home-subheading" style={{fontSize: 16}}>Manage and delegate your volunteers efficiently through our all-in-one platform.</p>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={12}>
                                <Form.Group controlId="emailOrg" bssize="large" style={{marginBottom: 5}}>
                                    <Form.Control type="email" placeholder="Email" value={fields.emailOrg} onChange={handleFieldChange}/>
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group controlId="passOrg" bssize="large">
                                    <Form.Control placeholder="Password" type="password" value={fields.passOrg} onChange={handleFieldChange}/>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button style={{marginTop: 10, width: 150}} id="large-button" type="submit">Sign In</Button>
                        <p id="regular-text" style={{marginTop: 15, color: '#2670FF'}}>Manage a mutual aid initiative?
                            <Button variant="link" id="regular-text" onClick={() => handleShowModal('get started')}
                                    style={{color: '#2670FF', padding: 0, textDecoration: 'underline', marginTop: -2, marginLeft: 5}} >
                                Get Started
                            </Button>
                            {/* <a id="regular-text" onClick={() => handleShowModal('get started')} 
                                style={{color: '#2670FF', marginLeft: 5, textDecoration: 'underline'}} href="#">
                                Get Started</a><br/> */}
                        </p>
                    </Form>
                </Col>
                <Col md={6} style={{marginTop: 50}}>
                    <img id="org-img" alt="" src={orgImg}></img>
                </Col>
            </Row>
            <Row id="orgpage-separator">
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 30, marginBottom: 0}}>&nbsp;</p>
                </Col>
            </Row>
            <Row style={{marginTop: 15}}>
                <Col md={6} id="requests-feature-mobile">
                    <h1 id="home-sub-heading">Track Requests</h1>
                    <p id="home-subheading" style={{fontSize: 16, paddingRight: 0, marginBottom: 0}}>Optimize your workflow with the Covaid request tracker, 
                    an automated system for managing resource requests coming to your organization.</p>
                </Col>

                <Col md={6} id="requests-feature-container" style={{textAlign: 'center'}}>
                    <img id="request-img" alt="" src={requestsImg}></img>
                </Col>
                <Col md={6} id="feature-container">
                    <h1 id="home-sub-heading">Track Requests</h1>
                    <p id="home-subheading" style={{fontSize: 16}}>Optimize your workflow with the Covaid Request Tracker, 
                    an automated system for managing resource requests coming to your organization.</p>
                </Col>
            </Row>
            <Row style={{marginTop: 45}}>
                <Col md={6} id="location-feature-container">
                    <h1 id="home-sub-heading">Location Tracker</h1>
                    <p id="home-subheading" style={{fontSize: 16, paddingRight: 0,  marginBottom: 0}}>Delegate requests by location 
                    and better understand your volunteer base. The map integration also allows organization leaders to view the 
                    general location of in-progress and completed requests.</p>
                </Col>
                <Col md={6} id="map-feature-container">
                    <img id="request-img" alt="" src={mapsImg}></img>
                </Col>
            </Row>
            <Row style={{marginTop: 50, marginBottom: 100}}>
                <Col xs={12} id="org-feature-container">
                    <h1 id="home-sub-heading">Organization Portal</h1>
                    <p id="home-subheading" style={{fontSize: 16, paddingRight: 0,  marginBottom: 0}}>Use the Organization Portal as the one-stop-shop for managing your mutual aid.</p>
                </Col>
                <Col xs={12} style={{textAlign: 'center'}}>
                    <img id="orgscreen-img" alt="" src={orgscreenImg}></img>
                </Col>
                <Col xs={12} id="org-feature-container">
                    <h1 id="home-sub-heading">Take your next step</h1>
                    <p id="home-subheading" style={{fontSize: 20, paddingRight: 0,  marginBottom: 0}}>We’re excited to work 
                    with you and help grow your efforts!</p>
                    <Button style={{marginTop: 10, width: 250}} id="large-button" onClick={() => handleShowModal(7)}>Get Started</Button>
                </Col>
            </Row>
        </Container>
        {getCurrentModal()}
        <Modal show={showForgot} size='sm' style={{marginTop: 110}}>
                    <Modal.Header>
                        <Modal.Title id="small-header" style={{marginLeft: 5}}>Reset your password</Modal.Title>
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
                            <Button id="large-button-empty" onClick={() => {setShowForgot(false);}}>Back to login</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
        <Footer key="2" handleShowModal={handleShowModal}/>
    </>)
}