import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Cookie from 'js-cookie'
import orgImg from './assets/org.png'
import CovaidNavbar from './CovaidNavbar'
import AboutUs from './components_modals/AboutUs'
import HowItWorks from './components_modals/HowItWorks'
import Feedback from './components_modals/Feedback'
import Footer from './components/Footer';
import NewLogin from './NewLogin';

export default function OrgLogin(props) {
    const [fields, handleFieldChange] = useFormFields({
        emailOrg: "",
        passOrg: "",
    });

    const [mode, setMode] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(0);
    const [adminChecked, setAdminChecked] = useState(false);

    function validateForm() {
        return fields.emailOrg.length > 0 && fields.password.length > 0;
    }

    function validateForgotForm() {
        return fields.emailOrg.length > 0;
    }

    const handleSubmitForgot = async e => {
        e.preventDefault();
        let form = {
            'email': fields.emailOrg,
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
            alert('Error')
        });
      };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!adminChecked) {
            let form = {
                'association': {
                    'email': fields.emailOrg,
                    'password': fields.passOrg
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
                        props.setShowLogin(false);
                        props.login(false);
                    });
                } else {
                    alert('Incorrect Login!')
                }
            })
            .catch((e) => {
                alert('Incorrect Login!')
            });
        } else {
            let form = {
                'admin': {
                    'email': fields.emailOrg,
                    'password': fields.passOrg
                }
            }
            fetch('/api/association-admin/login/', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            })
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        console.log("Login successful")
                        console.log(data.admin);
                        Cookie.set("admin_token", data.admin.token);
                        Cookie.set("org_token", data.admin.orgToken);
                        props.setShowLogin(false);
                        props.login(true);
                    });
                } else {
                    alert('Incorrect Login!')
                }
            })
            .catch((e) => {
                alert('Incorrect Login!')
            });
        }
      };




    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 1) {
            modal = <AboutUs showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalType === 2) {
            modal = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if  (modalType === 4) {
            modal = <Feedback showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalType === 6) {
            modal = <NewLogin showModal={showModal} hideModal={() => setShowModal(false)}/>
        }
        return modal;
    }

    const handleShowModal = (type) => {
		setModalType(type);
		setShowModal(true);
	}

    return (<>
        <CovaidNavbar isLoggedIn={false} totalVolunteers={0} orgPortal={true} handleShowModal={handleShowModal}/>
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
                                <Form.Check
                                    type="checkbox"
                                    style={{marginTop: 5}}
                                    checked={adminChecked}
                                    onChange={() => setAdminChecked(!adminChecked)}
                                    id='default-checkbox'
                                    label="Admin Login (use your personal admin account)"
                                />
                            </Col>
                        </Row>
                        <Button style={{marginTop: 10, width: 150}} id="large-button" type="submit">Sign In</Button>
                    </Form>
                </Col>
                <Col md={6} style={{paddingLeft: 50}}>
                    <img id="org-image" src={orgImg} style={{width: 480, marginTop: 50}}></img>
                </Col>
            </Row>
        </Container>
        {getCurrentModal()}
        <Footer key="2" handleShowModal={handleShowModal}/>
    </>)

      if (mode) {
        return (
            <Modal show={props.showLogin} size='sm' style={{marginTop: 110}}>
                <Modal.Header>
                    <Modal.Title id="small-header" style={{marginLeft: 5}}>
                        Login to your portal
                    </Modal.Title>
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
                        <Button style={{marginTop: 10}} id="large-button" disabled={!validateForm()} type="submit">Sign In</Button>
                        <Button id="large-button-empty" onClick={() => {setMode(!mode);}}>Reset your password</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )
    } else {
        return (
            <Modal show={props.showLogin} size='sm' style={{marginTop: 110}}>
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
                            <Button id="large-button-empty" onClick={() => {setMode(!mode);}}>Back to login</Button>
                        </Form>
                    </Modal.Body>
                </Modal>
        )
    }
}