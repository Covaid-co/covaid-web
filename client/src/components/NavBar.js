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

    var rightNav = <></>

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