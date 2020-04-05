import React, {useState, useEffect } from "react";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import VolunteerBadge from './components/VolunteerBadge'
import AboutUs from './AboutUs'
import HowItWorks from './HowItWorks'
import Feedback from './Feedback'


export default function CovaidNavbar(props) {

    const [toggled, setToggled] = useState(false);
    const [totalVolunteers, setTotalVolunteers] = useState(0);

    const [showNavModal, setShowNavModal] = useState(false)
    const [navModalType, setShowNavModalType] = useState(0)
  
    const showModal = (modalType) => {
        setShowNavModalType(modalType)
        setShowNavModal(true)
    }
  
    const hideModal = () => {
      setShowNavModal(false)
      setShowNavModalType(0)
    }
  
    var modal = <></>
    switch(navModalType) {
      case 1:
        modal = <AboutUs />
        break;
      case 2:
        modal = <HowItWorks />
        break;
      case 3:
        modal = <Feedback handleHide={hideModal}/>
        break;
      default:
        modal = <></>
    }

    const toggleNavBar = (e) => {
        setToggled(e);
    }

    useEffect(() => { 
      fetch('/api/users/totalUsers')
      .then((res) => res.json())
        .then((res) => {
          setTotalVolunteers(res.count)
        });
   }, []);

    return(
      <>
      <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <Navbar collapseOnSelect 
                  onToggle={toggleNavBar}
                  variant="light" 
                  expand="md"
                  className = {toggled ? 'customNavToggled': 'customNav'}>
            <Navbar.Brand className={'home'} href = {window.location.protocol + '//' + window.location.host}
              style={toggled ? {'color': '#194bd3'} : {'color': 'white'}}>
              covaid
            </Navbar.Brand>
            <Form inline className="volunteer-badge-mobile">
              <Badge aria-describedby='tooltip-bottom' variant="success" id='volunteer-mobile'>{totalVolunteers} Volunteers</Badge>
              <Navbar.Toggle aria-controls="basic-navbar-nav" id={toggled ? 'toggledNav1': 'nav1'}/>
            </Form>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link className={toggled ? 'navBorderToggled': 'navBorder'} onClick={() => showModal(1)}>
                  <p id={toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                </Nav.Link>
                <Nav.Link className={toggled ? 'navBorderToggled': 'navBorder'} onClick={() => showModal(2)}>
                  <p id={toggled ? 'navLinkToggled': 'navLink'}>How it works</p>
                </Nav.Link>
                <Nav.Link className={toggled ? 'navBorderToggled': 'navBorder'} onClick={() => showModal(3)}>
                  <p id={toggled ? 'navLinkToggled': 'navLink'}>Feedback</p>
                </Nav.Link>
                <Nav.Link className="volunteer-badge-web">
                  <VolunteerBadge totalVolunteers={totalVolunteers}/>
                </Nav.Link>
              </Nav>
                  <Form inline id = "getStarted" style ={{display: 'block', marginRight: '5%'}}>
                    <Button variant="outline-light" id = 'login-button' onClick={() => props.setShowLogin(true)}>
                      Sign In
                    </Button>
                    <Button variant="outline-light" id = 'register-button' onClick={() => props.setShowRegistration(true)}>
                      Volunteer Registration
                    </Button>
                  </Form>
            </Navbar.Collapse>
          </Navbar>
          <Modal show={showNavModal} onHide={hideModal} style = {{marginTop: 50}} id="general-modal">
            {modal}
          </Modal>
          </>
    );
}