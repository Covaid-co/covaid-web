import React, {useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Cookie from 'js-cookie'

export default function CovaidNavbar(props) {
    const [toggled, setToggled] = useState(false);
    const [totalVolunteers, setTotalVolunteers] = useState(0);
    const [width, setWidth] = useState(window.innerWidth);
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
            window.open(window.location.protocol + '//' + window.location.host + '/organizationPortal', '_self');
        } else {
            Cookie.remove('token');
            window.open(window.location.protocol + '//' + window.location.host, '_self');
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
        if (width > 767) {
            rightNav = <Form inline style ={{display: 'block', marginRight: '5%', marginBottom: 3}}>
                            <Button variant="outline-light" id='login-button' onClick={() => props.handleShowModal(6)}>
                                Sign In
                            </Button>
                            <Button variant="outline-light" id='register-button' onClick={() => props.handleShowModal(7)}>
                                Volunteer Registration
                            </Button>
                        </Form>
        } else {
            rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                            <Button id="large-button-empty" onClick={() => props.handleShowModal(6)} style={{marginTop: 0, marginBottom: 5}}>
                                Volunteer Login
                            </Button>
                            <Button id='large-button' onClick={() => props.handleShowModal(7)}>
                                Volunteer Registration
                            </Button>
                        </Form>;
        }
    }

    return (
        <Navbar collapseOnSelect onToggle={(e) => setToggled(e)} variant="light" expand="md" id="custom-navbar">
            <Navbar.Brand href = {window.location.protocol + '//' + window.location.host} id="navbar-brand" style={(width < 767) ? {marginTop: 12} : {}}>
                covaid
            </Navbar.Brand>
            <Form inline className="volunteer-badge-mobile">
                {props.totalVolunteers === 0 ? <></> : 
                    <Badge aria-describedby='tooltip-bottom' id='volunteer-mobile'>{totalVolunteers} Volunteers</Badge>
                }
                <Navbar.Toggle aria-controls="basic-navbar-nav" id={toggled ? 'toggledNav1': 'nav1'}/>
            </Form>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => props.handleShowModal(1)}>
                        <p id={toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                    </Nav.Link>
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-border-element'}
                        href = {window.location.protocol + '//' + window.location.host + '/organizationPortal'}>
                        <p id={toggled ? 'navLinkToggled': 'navLinkBorder'}>Organizations</p>
                    </Nav.Link>
                    <Nav.Link className={toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => props.handleShowModal(2)}>
                        <p id={toggled ? 'navLinkToggled': 'navLink'}>FAQs</p>
                    </Nav.Link>
                    <Nav.Link className="volunteer-badge-web">
                        {(props.totalVolunteers === 0 || totalVolunteers === 0) ? <></> :
                        <Badge aria-describedby='tooltip-bottom' id='volunteerBadge'>{
                            props.orgPortal ? props.totalVolunteers : totalVolunteers
                        } Volunteers</Badge>}
                    </Nav.Link>
                </Nav>
                {rightNav}
            </Navbar.Collapse>
        </Navbar>
    );
}