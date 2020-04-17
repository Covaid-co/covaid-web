import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Geocode from "react-geocode";
import Badge from 'react-bootstrap/Badge'
import fetch_a from './util/fetch_auth';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './Home.css'
import './styling/NewHomePage.css';

import HomePage from './HomePage'

import { Redirect, withRouter } from 'react-router-dom'
import { findAssociations, getMyLocation, setNeighborhood } from './location_tools/LocationHelpers'
import { removeCookies } from './Helpers';
import { cookieNames } from './constants';

import Cookie from 'js-cookie'

Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: '',
      longitude: '',
      zipCode: '',
      state: [],
      neighborhoods: [],
      locality: '',
      isLoaded: false,
      isLoggedIn: false,
      first_name: '',
      last_name: '',
      currentUser: undefined,
      showModal: false,
      modalType: '',
      width: 0,
      totalVolunteers: 0,
      justVerified: false,
      associations: [],
      currentAssoc: {},
      toggled: false
    }

    window.addEventListener("resize", this.update);
  
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.logout = this.logout.bind(this);
    this.refreshLocation = this.refreshLocation.bind(this);
  }

  handleShowModal(modalType) {
    this.setState({modalType: modalType});
    this.setState({showModal: true});
  }
  
  handleHideModal() {
    this.setState({showModal: false});
  }

  componentDidMount() {
    if (this.props.location.verified) {
      this.handleShowModal(6);
      this.setState({justVerified: true});
    }
    getMyLocation(this);
    this.update();
    if (!this.state.isLoggedIn && Cookie.get("token")) {
      this.fetchUser()
    }
    fetch('/api/users/totalUsers')
      .then((res) => res.json())
      .then((res) => {
        this.setState({totalVolunteers: res.count});
      });
  }

  update = () => {
    this.setState({
      width: window.innerWidth
    });
  };

  fetchUser(){
    fetch_a('token', '/api/users/current')
      .then((response) => response.json())
      .then((user) => {
        this.setState({ currentUser: user });
        this.setState({ isLoggedIn: true });
        this.setState({ first_name: user.first_name });
        this.setState({ last_name: user.last_name });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  refreshLocation() {
    removeCookies(cookieNames);
    this.setState({isLoaded: false});
    getMyLocation(this);
  }

  onLocationSubmit = (e, locationString) => {
    e.preventDefault();
    e.stopPropagation();
    return Geocode.fromAddress(locationString).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        removeCookies(cookieNames);
        setNeighborhood(lat, lng, this);
        findAssociations(lat, lng, this);
        return true;
      }, () => {
        return false;
      }
    );
  }

  render() {
    var rightNav;
    if (this.state.isLoggedIn) {
      if (this.state.toggled) {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                    <Button variant="outline-danger" id='logoutButton' onClick={this.logout} style={{width: '100%'}}>
                      Logout
                    </Button>
                  </Form>;
      } else {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block', marginRight: '5%'}}>
                    {(this.state.width > 767) ? <span id="hello-name">Hello, {this.state.first_name}</span> : <></>}
                    <Button variant="outline-danger" id='logoutButton' onClick={this.logout}>
                      Logout
                    </Button>
                  </Form>;
      }
    } else {
      if (this.state.width > 767) {
        rightNav = <Form inline style ={{display: 'block', marginRight: '5%'}}>
                      <Button variant="outline-light" id='login-button' onClick={() => this.handleShowModal(6)}>
                        Sign In
                      </Button>
                      <Button variant="outline-light" id='register-button' onClick={() => this.handleShowModal(7)}>
                        Volunteer Registration
                      </Button>
                    </Form>
      } else {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                    <Button variant="outline-light" id='loginButton' onClick={() => this.handleShowModal(6)} style={{width: '100%'}}>
                      <font id = "login">
                        Volunteer Login
                      </font>
                    </Button>
                    <Button variant="outline-light" id='register-button-mobile' onClick={() => this.handleShowModal(7)}>
                        Volunteer Registration
                    </Button>
                  </Form>;
      }
    }

    return (
      <>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

        <div className="App">
          <Navbar collapseOnSelect onToggle={(e) => this.setState({toggled: e})} variant="light" expand="md" id="custom-navbar">
            <Navbar.Brand href = {window.location.protocol + '//' + window.location.host} id="navbar-brand">
              covaid
            </Navbar.Brand>
            <Form inline className="volunteer-badge-mobile">
              <Badge aria-describedby='tooltip-bottom' id='volunteer-mobile'>{this.state.totalVolunteers} Volunteers</Badge>
              <Navbar.Toggle aria-controls="basic-navbar-nav" id={this.state.toggled ? 'toggledNav1': 'nav1'}/>
            </Form>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => this.handleShowModal(1)}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navbar-border-element'}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLinkBorder'}>Organizations</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navbar-element'} onClick={() => this.handleShowModal(2)}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>FAQs</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navbar-element'}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>Feedback</p>
                </Nav.Link>
                <Nav.Link className="volunteer-badge-web">
                  <Badge aria-describedby='tooltip-bottom' id='volunteerBadge'>{this.state.totalVolunteers} Volunteers</Badge>
                </Nav.Link>
              </Nav>
              {rightNav}
            </Navbar.Collapse>
          </Navbar>
          <HomePage state={this.state} 
                    setState={this.setState}
                    setVolunteerPortal={() => this.props.history.push('/volunteerPortal')}
                    handleShowModal={this.handleShowModal} 
                    onLocationSubmit={this.onLocationSubmit}
                    refreshLocation={this.refreshLocation}
                    handleHideModal={this.handleHideModal}/>
      </div>
    </>);
  }
}

export default withRouter(Home);