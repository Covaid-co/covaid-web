import React, {useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Cookie from 'js-cookie'

import AboutUs from '../components_modals/AboutUs'
import HowItWorks from '../components_modals/HowItWorks'
import MapModal from '../components_modals/MapModal';
import Donate from '../components_modals/Donate';
import { currURL } from '../constants';


export default function CovaidNavbar(props) {
    const [toggled, setToggled] = useState(false);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);
    const [modalName, setModalName] = useState('');
    const [showModal, setShowModal] = useState(false);

    window.addEventListener("resize", () => {
        setWidth(window.innerWidth);
        if (window.innerWidth > 767) {
            setToggled(false);
        }
    });

    useEffect(() => { 
        fetch('/api/users/totalUsers')
        .then((res) => res.json())
        .then((res) => {
            setTotalVolunteers(res.count);
        });
    }, []);

    const logout = () => {
        if (props.orgPortal) {
            Cookie.remove('org_token');
            if (Cookie.get('admin_token')) {
                Cookie.remove('admin_token');
                props.setAdmin({});
            }
            window.open(currURL + '/organizationPortal', '_self');
        } else {
            Cookie.remove('token');
            window.open(currURL, '_self');
        }
    }

    var rightNav;
    if (props.isLoggedIn) {
        if (toggled) {
            rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                        <Button variant="outline-danger" id='logoutButton' onClick={logout} style={{width: '100%'}}>
                            Logout
                        </Button>
                    </Form>;
        } else {
            rightNav = <Form inline id = "getStarted" style ={{display: 'block', marginRight: '5%', marginBottom: 3}}>
                        {(width > 767) ? <span id="hello-name">Hello, {props.first_name}</span> : <></>}
                        <Button variant="outline-danger" id='logoutButton' onClick={logout}>
                            Logout
                        </Button>
                    </Form>;
        }
    } else {
        if (props.orgAdmin || props.orgPortal) {
            rightNav = <></>;
        } else {
            if (width > 767) {
                rightNav = <Form inline style ={{display: 'block', marginRight: '5%', marginBottom: 3}}>
                                <Button variant="outline-light" id='login-button' onClick={() => props.handleShowModal('signin')}>
                                    Sign In
                                </Button>
                                <Button variant="outline-light" id='register-button' onClick={() => props.handleShowModal('register')}>
                                    Volunteer Registration
                                </Button>
                            </Form>
            } else {
                rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                                <Button id="large-button-empty" onClick={() => props.handleShowModal('signin')} style={{marginTop: 0, marginBottom: 5}}>
                                    Volunteer Login
                                </Button>
                                <Button id='large-button' onClick={() => props.handleShowModal('register')}>
                                    Volunteer Registration
                                </Button>
                            </Form>;
            }
        }
    }

    const setCurrModal = (name) => {
        setShowModal(true);
        setModalName(name);
    }

    const getCurrentModal = () => {
        var res = <></>;
        if (modalName === 'about') {
            res = <AboutUs showModal={showModal} hideModal={() => setShowModal(false)}/>; 
        } else if (modalName === 'faq') {
            res = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalName === 'donate') {
            res = <Donate showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalName === 'map') {
            res = <MapModal showModal={showModal} hideModal={() => setShowModal(false)} totalVolunteers={totalVolunteers} mobile={width < 767}/>;
        }
        return res;
    }

    const volunteerBadge = (view) => {
        if (totalVolunteers === 0) {
            return <></>;
        } else {
            const numVolunteers = props.orgPortal ? props.totalVolunteers : totalVolunteers;
            if (props.orgPortal && props.isLoggedIn) {
                if (view === 'mobile') {
                    return <Badge id='volunteer-mobile'>{numVolunteers} Volunteers</Badge>
                } else {
                    return <Badge id='volunteerBadge'>{numVolunteers} Volunteers</Badge>
                }
            } else {
                if (view === 'mobile') {
                    return <Badge id='volunteer-mobile' onClick={() => setCurrModal('map')}>Volunteer Map</Badge>
                } else {
                    return <Badge id='volunteerBadge' onClick={() => setCurrModal('map')}>Volunteer Map</Badge>
                }
            }
        }
    }

    return (<>
        <Navbar collapseOnSelect onToggle={(e) => setToggled(e)} variant="light" expand="md" id="custom-navbar">
            <Navbar.Brand href = {currURL} id="navbar-brand" style={(width < 767) ? {marginTop: 12} : {}}>
                covaid
            </Navbar.Brand>
            <Form inline className="volunteer-badge-mobile">
                {volunteerBadge('mobile')}
                <Navbar.Toggle aria-controls="basic-navbar-nav" id={toggled ? 'toggledNav1': 'nav1'}/>
            </Form>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => setCurrModal('about')}>
                        <p id={toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                    </Nav.Link>
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-border-element'}
                        href = {currURL + '/organizationPortal'}>
                        <p id={toggled ? 'navLinkToggled': 'navLinkBorder'}>Organizations</p>
                    </Nav.Link>
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => setCurrModal('faq')}>
                        <p id={toggled ? 'navLinkToggled': 'navLink'}>FAQs</p>
                    </Nav.Link>
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => setCurrModal('donate')}>
                        <p id={toggled ? 'navLinkToggled': 'navLink'}>Donate</p>
                    </Nav.Link>
                    <Nav.Link className="volunteer-badge-web">
                        {volunteerBadge('desktop')}
                    </Nav.Link>
                </Nav>
                {rightNav}
            </Navbar.Collapse>
        </Navbar>
        {getCurrentModal()}
    </>);
}