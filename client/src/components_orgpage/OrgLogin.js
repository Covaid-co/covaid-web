import React, {useState, useEffect} from 'react';
import { useFormFields } from "../libs/hooksLib";
import PropTypes from 'prop-types';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Cookie from 'js-cookie'
import orgImg from '../assets/orgNew.png'
import requestsImg from '../assets/requests.png'
import mapsImg from '../assets/mapscreen.png'
import orgscreenImg from '../assets/orgscreen.png'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer';
import GetStarted from './GetStarted';
import ResetPassword from '../components_modals/ResetPassword';

/**
 * Landing Page for non-logged in organizations
 */

export default function OrgLogin(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        emailOrg: "",
        email: "",
        passOrg: "",
    });

    useEffect(() => {
        if (props.orgReset) {
            setShowModal(true);
            setModalType('forgot');
        }
    }, [props.orgReset])

    const handleSubmitForgot = async e => {
        e.preventDefault();
        let form = { 'email': fields.email };
        fetch('/api/association/emailpasswordresetlink', {
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
            alert(e);
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
        } else if (modalType === 'forgot') {
            modal = <ResetPassword showModal={showModal} hideModal={() => setShowModal(false)} 
                        handleSubmitForgot={handleSubmitForgot} fields={fields} handleFieldChange={handleFieldChange}/>
        }
        return modal;
    }

    const handleShowModal = (type) => {
		setModalType(type);
		setShowModal(true);
	}

    return (<div className="App">
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
                    <Button style={{marginTop: 10, width: 250}} id="large-button" onClick={() => handleShowModal('get started')}>Get Started</Button>
                </Col>
            </Row>
        </Container>
        {getCurrentModal()}
        <Footer key="2" handleShowModal={handleShowModal}/>
    </div>)
}

OrgLogin.propTypes = {
    orgReset: PropTypes.bool,
    setShowLogin: PropTypes.func,
    login: PropTypes.func
}