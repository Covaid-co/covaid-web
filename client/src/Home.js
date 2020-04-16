import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import './Home.css'
import HelpfulLinks from './HelpfulLinks';
import VolunteerBadge from './components/VolunteerBadge';
import AboutUs from './AboutUs'
import HowItWorks from './HowItWorks'
import Feedback from './Feedback'
import HomePage from './HomePage'
import { generateURL, removeCookies } from './Helpers';
import { cookieNames } from './constants';

import fetch_a from './util/fetch_auth';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Geocode from "react-geocode";
import Badge from 'react-bootstrap/Badge'
import { Redirect } from 'react-router-dom'

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
      promptChangeZip: false,
      isLoaded: false,
      isLoggedIn: false,
      first_name: '',
      last_name: '',
      currentUser: undefined,
      currentUserAvailability: false,
      checked: false,
      showLogin: false,
      showRegistration: false,
      showWorks: false,
      showAbout: false,
      showFeedback: false,
      showModal: false,
      showResourceModal: false,
      modalType: '',
      cookieSet: false,
      currentState: '',
      width: 0,
      totalVolunteers: 0,
      justVerified: false,
      currentClickedUser: '',
      showRequestHelp: false,
      requestHelpMode: '',
      associations: [],
      currentAssoc: {},
      volunteerPortal: false,
      toggled: false,
      invalidAddressModal: false
    }

    window.addEventListener("resize", this.update);
  
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHideResourceModal = this.handleHideResourceModal.bind(this);
    this.handleShowResourceModal = this.handleShowResourceModal.bind(this);
    this.handleHidePrompt = this.handleHidePrompt.bind(this);
    this.getMyLocation = this.getMyLocation.bind(this)
    this.logout = this.logout.bind(this);
    this.refreshLocation = this.refreshLocation.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleHideLogin = this.handleHideLogin.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleHideRegistration = this.handleHideRegistration.bind(this);
    this.handleShowRequestHelp = this.handleShowRequestHelp.bind(this);
    this.handleHideRequestHelp = this.handleHideRequestHelp.bind(this);
    this.findAssociations = this.findAssociations.bind(this)
    this.toggleNavBar = this.toggleNavBar.bind(this);
    this.setLatLongFromZip = this.setLatLongFromZip.bind(this);
  }

  handleHideRequestHelp() {
    this.setState({showRequestHelp: false});
  }

  handleShowRequestHelp() {
    this.setState({showRequestHelp: true});
  }
    
  handleHidePrompt() {
    this.setState({promptChangeZip: false});
  }

  handleShowLogin() {
    this.setState({showLogin: true});
  }

  handleHideLogin() {
    this.setState({showLogin: false})
  }

  handleShowRegistration() {
    this.setState({showRegistration: true});
  }

  handleHideRegistration() {
    this.setState({showRegistration: false});
  }

  handleShowModal(modalType) {
    this.setState({modalType: modalType})
    this.setState({showModal: true});
  }
  
  handleHideModal() {
    this.setState({showModal: false});
  }

  handleShowResourceModal() {
    this.setState({showResourceModal: true})
  }

  handleHideResourceModal() {
    this.setState({showResourceModal: false})
  }

  componentDidMount() {
    if (this.props.location.verified) {
      this.setState({showLogin: true});
      this.setState({justVerified: true});
    }
    this.getMyLocation();
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

  setLatLongFromZip(event, zipCode) {
    event.preventDefault();
    event.stopPropagation();
    return Geocode.fromAddress(zipCode).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setNeighborhood(lat, lng, zipCode);
        return true;
      },
      error => {
        console.error(error);
        return false;
      }
    );
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
        this.setState({ checked: user.availability });
        this.setState({ isLoggedIn: true });
        this.setState({ first_name: user.first_name });
        this.setState({ last_name: user.last_name });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setNeighborhood(latitude, longitude, zipCode) {
    if (this.state.isLoaded) {
      return;
    }

    Geocode.fromLatLng(latitude, longitude).then(
      response => {
        var foundNeighborhoods = [];
        var foundState = [];
        var foundZipCode = '';
        var prevLocality = '';
        var locality = '';

        this.findAssociations(latitude, longitude, this);
        for (var i = 0; i < Math.min(5, response.results.length); i++) {
          const results = response.results[i]['address_components'];
          for (var j = 0; j < results.length; j++) {
            const types = results[j].types;
            if (types.includes('neighborhood') || types.includes('locality')) {
              const currNeighborhoodName = results[j]['long_name'];
              if (foundNeighborhoods.includes(currNeighborhoodName) === false) {
                foundNeighborhoods.push(currNeighborhoodName);
              }
            }

            if (types.includes('postal_code')) {
              if (foundZipCode === '') {
                foundZipCode = results[j]['long_name'];
              }
            }

            for (var k = 0; k < types.length; k++) {
              const type = types[k];
              if (type.includes('administrative_area_level')) {
                if (locality === '') {
                  locality = prevLocality;
                }
              }
              if (foundState.length === 0 && type === "administrative_area_level_1") {
                foundState = [results[j]['long_name'], results[j]['short_name']];
              }
            }
            prevLocality = results[j]['long_name'];
          }
        }

        if (zipCode !== '') {
          foundZipCode = zipCode;
        }

        var date = new Date();
        date.setTime(date.getTime() + ((60 * 60 * 1) * 1000));
        Cookie.set('latitude', latitude, { expires: date });
        Cookie.set('longitude', longitude, { expires: date });
        Cookie.set('zipcode', foundZipCode, { expires: date });
        Cookie.set('neighborhoods', foundNeighborhoods, { expires: date });
        Cookie.set('locality', locality, { expires: date });
        Cookie.set('state', foundState, { expires: date });
        this.setState({
          isLoaded: true,
          latitude: latitude,
          longitude: longitude,
          neighborhoods: foundNeighborhoods,
          zipCode: foundZipCode,
          locality: locality,
          state: foundState
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  // Set association objects
  findAssociations(lat, long, currentComponent) {
    let params = {'latitude': lat, 'longitude': long}
    const url = generateURL("/api/association/get_assoc/lat_long?", params);
    async function fetchData() {
      const response = await fetch(url);
      response.json().then((data) => {
        currentComponent.setState({associations: data});
        if (data.length > 0) {
          currentComponent.setState({currentAssoc: data[0]})
        } else {
          currentComponent.setState({currentAssoc: {}})
        }
      });
    }
    fetchData();
  }

  // Finds lat and long from cookie first and if found will load page
  // lat and long will be updated once geolocation is working
  getMyLocation() {
    let currentComponent = this;
    const lat = Cookie.get('latitude');
    const long = Cookie.get('longitude');
    const zip = Cookie.get('zipcode');
    const neighborhoods = Cookie.get('neighborhoods');
    const locality = Cookie.get('locality');
    const foundState = Cookie.get('state');
    if (lat && long && zip && neighborhoods && locality && foundState) {
      this.setState({
        cookieSet: true,
        isLoaded: true,
        latitude: lat,
        longitude: long,
        neighborhoods: JSON.parse(neighborhoods),
        locality: locality,
        zipCode: zip,
        state: JSON.parse(foundState)
      });
      this.findAssociations(lat, long, currentComponent);
      return;
    }

    // set actualLat and actualLong for the current users real location
    // only if cookie has been set already
    // ask user to confirm their current location now
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        this.setNeighborhood(position.coords.latitude, position.coords.longitude, '');
        this.findAssociations(position.coords.latitude, position.coords.longitude, currentComponent);
      }, (error) => {
        console.log(error);
      });
    }
  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  refreshLocation() {
    removeCookies(cookieNames);
    this.setState({isLoaded: false, currentAssoc: {}});
    this.getMyLocation();
  }

  onLocationSubmit = (e, locationString) => {
    e.preventDefault();
    if (locationString === "") {
      return;
    }
    Geocode.fromAddress(locationString).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        removeCookies(cookieNames);
        this.setState({isLoaded: false});
        this.setNeighborhood(lat, lng, '');
        this.setState({currentAssoc: {}});
      }, () => {
        this.setState({invalidAddressModal: true})
      }
    );
  }

  toggleNavBar(e) {
    this.setState({toggled: e});
  }

  render() {
		var collapsed = false
		if (this.state.width <= 767) {
			collapsed = true;
		}

    const { isLoggedIn } = this.state;

    var rightNav;
    if (isLoggedIn) {
      if (this.state.toggled) {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                    <Button variant="outline-danger" id='logoutButton' onClick={this.logout} style={{width: '100%'}}>
                      <font id = "logout" style = {{color: '#dc3545', fontWeight: 600, fontSize: 13}}>
                        Logout
                      </font>
                    </Button>
                  </Form>;
      } else {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block', marginRight: '5%'}}>
                    {!collapsed ? <span id="name">
                      Hello, {this.state.first_name}
                    </span> : <></>}
                    <Button variant="outline-danger" id='logoutButton' onClick={this.logout}>
                      <font id = "logout" style = {{color: 'white', fontWeight: 600, fontSize: 15}}>
                        Logout
                      </font>
                    </Button>
                  </Form>;
      }
    } else {
      if (collapsed === false) {
        rightNav = <Form inline style ={{display: 'block', marginRight: '5%'}}>
                    <Button variant="outline-light" id = 'login-button'onClick={this.handleShowLogin}>
                      Sign In
                    </Button>
                    <Button variant="outline-light" id = 'register-button'onClick={this.handleShowRegistration}>
                      Volunteer Registration
                    </Button>
                  </Form>
      } else {
        rightNav = <Form inline id = "getStarted" style ={{display: 'block'}}>
                    <Button variant="outline-light" id='loginButton' onClick={this.handleShowLogin} style={{width: '100%'}}>
                      <font id = "login">
                        Volunteer Login
                      </font>
                    </Button>
                    <Button variant="outline-light" id='register-button-mobile' onClick={this.handleShowRegistration}>
                      {/* <font id = "regi"> */}
                        Volunteer Registration
                      {/* </font> */}
                    </Button>
                  </Form>;
      }
    }

    var portalText = <></>
    var volunteerButton = <></>

    if (isLoggedIn) {
      portalText = <p id="jumboText">Manage your offer of help from the volunteer portal</p>
      volunteerButton =  <Button onClick={() => this.setState({volunteerPortal: true})} id="homeButtons" >
        Volunteer portal
      </Button>
    }
    
    var pageContent = <></>
      pageContent = <HomePage state={this.state} 
                              setState={this.setState}
                              handleShowModal={this.handleShowModal} 
                              handleShowResourceModal={this.handleShowResourceModal}
                              handleHideRequestHelp={this.handleHideRequestHelp}
                              handleShowRegistration={this.handleShowRegistration}
                              handleHideLogin={this.handleHideLogin}
                              handleHideRegistration={this.handleHideRegistration}
                              onLocationSubmit={this.onLocationSubmit}
                              handleShowRequestHelp={this.handleShowRequestHelp}
                              requestHelpMode={this.requestHelpMode}
                              volunteerButton={volunteerButton}
                              refreshLocation={this.refreshLocation}
                              setLatLong={this.setLatLongFromZip}
                              portalText={portalText}/>

    var modal = <></>
    switch(this.state.modalType) {
      case 1:
        modal = <AboutUs />
        break;
      case 2:
        modal = <HowItWorks />
        break;
      case 3:
        modal = <Feedback handleHide={this.handleHideModal}/>
        break;
      default:
        modal = <></>
    }

    if (this.state.volunteerPortal) {
      const route = 'volunteerPortal'
      return <Redirect to={route} />
    }
    
    return (
      <>
        <link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>

        <div className="App">
          <Navbar collapseOnSelect 
                  onToggle={this.toggleNavBar}
                  variant="light" 
                  expand="md"
                  className = {this.state.toggled ? 'customNavToggled': 'customNav'}>
            <Navbar.Brand className={'home'} href = {window.location.protocol + '//' + window.location.host}
              style={this.state.toggled ? {'color': '#194bd3'} : {'color': 'white'}}>
              covaid
            </Navbar.Brand>
            <Form inline className="volunteer-badge-mobile">
              <Badge aria-describedby='tooltip-bottom' variant="success" id='volunteer-mobile'>{this.state.totalVolunteers} Volunteers</Badge>
              <Navbar.Toggle aria-controls="basic-navbar-nav" id={this.state.toggled ? 'toggledNav1': 'nav1'}/>
            </Form>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navBorder'} 
                          style={this.state.toggled === false ? {marginLeft: '10%'} : {}} onClick={() => this.handleShowModal(2)}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'} style={{textDecoration: 'underline'}}>FAQs</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navBorder'} onClick={() => this.handleShowModal(1)} >
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navBorder'} onClick={() => this.handleShowModal(3)}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>Feedback</p>
                </Nav.Link>
                <Nav.Link className="volunteer-badge-web">
                  <VolunteerBadge totalVolunteers={this.state.totalVolunteers}/>
                </Nav.Link>
              </Nav>
              {rightNav}
            </Navbar.Collapse>
          </Navbar>
          {pageContent}
      </div>

      <Modal size={this.state.modalType === 2 ? "lg" : "md"} show={this.state.showModal} onHide={this.handleHideModal} style = {{marginTop: 10, paddingBottom: 50}} id="general-modal">
        {modal}
      </Modal>

      <Modal size="sm" centered show={this.state.invalidAddressModal} onHide={() => {this.setState({invalidAddressModal: false})}}>
        <Modal.Header closeButton>
          <Modal.Title>Invalid Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter a valid city or zip code</p>
        </Modal.Body>
      </Modal>

      <Modal size="lg" show={this.state.showResourceModal} onHide={this.handleHideResourceModal} style = {{marginTop: 10, paddingBottom: 50}} id="general-modal">
        <HelpfulLinks associationCity={this.state.currentAssoc.city} associationLinks={this.state.currentAssoc.links} />
      </Modal>
    </>);
  }
}

export default Home;