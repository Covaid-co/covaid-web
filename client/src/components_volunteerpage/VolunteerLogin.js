import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "../libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Cookie from 'js-cookie'
import orgImg from '../assets/org.png'
import CovaidNavbar from '../CovaidNavbar'
import AboutUs from '../components_modals/AboutUs'
import HowItWorks from '../components_modals/HowItWorks'
import Feedback from '../components_modals/Feedback'
import Footer from '../components/Footer'

export default function OrgLogin(props) {
    const [fields, handleFieldChange] = useFormFields({
        emailOrg: "",
        passOrg: "",
    });

    const [mode, setMode] = useState(true);
    const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState(0);

    function validateForm() {
        return fields.emailOrg.length > 0 && fields.password.length > 0;
    }

    function validateForgotForm() {
        return fields.emailOrg.length > 0;
    }

    // const handleSubmitForgot = async e => {
    //     e.preventDefault();
    //     let form = {
    //         'email': fields.emailOrg,
    //     };
    //     // console.log(form)
    //     fetch('/api/association/emailpasswordresetlink', {
    //         method: 'post',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(form)
    //     })
    //     .then((response) => {
    //         if (response.ok) {
    //             alert("Check your email for password link!")
    //         } else {
    //             alert('Error sending link!')
    //         }
    //     })
    //     .catch((e) => {
    //         alert('Error')
    //     });
    //   };

    const handleSubmit = async e => {
        e.preventDefault();
        let form = {
            'user': {
                'email': fields.emailOrg,
                'password': fields.passOrg
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
                    window.location.href = window.location.href;
                });
            } else {
                if (response.status === 403) {
                    alert("Check your email for a verification link prior to logging in.")
                } else {
                    alert("Incorrect password.")
                }
            }
        })
        .catch((e) => {
            alert('Seems to be some issues on our end, please try again later.')
        });
    };


    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 1) {
            modal = <AboutUs showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalType === 2) {
            modal = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if  (modalType === 4) {
            modal = <Feedback showModal={showModal} hideModal={() => setShowModal(false)}/>;
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
                    <h1 id="home-heading">Covaid for Volunteers</h1>
                    <p id="home-subheading" style={{fontSize: 16}}>Manage your offer and handle requests through Covaid</p>
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
                    </Form>
                </Col>
                <Col md={6} style={{paddingLeft: 50}}>
                    <img src={orgImg} style={{width: 480, marginTop: 50}}></img>
                </Col>
            </Row>
            </Container>
            {getCurrentModal()}
            <Footer key="2" handleShowModal={() => {}}/>
        </>
    )
}