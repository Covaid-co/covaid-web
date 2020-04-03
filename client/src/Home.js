import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import './Home.css'
import HelpfulLinks from './HelpfulLinks';
import VolunteerBadge from './components/VolunteerBadge';
import VolunteerPortal from './VolunteerPortal'
import AboutUs from './AboutUs'
import HowItWorks from './HowItWorks'
import Feedback from './Feedback'
import HomePage from './HomePage'

import fetch_a from './util/fetch_auth';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Geocode from "react-geocode";
import Badge from 'react-bootstrap/Badge'

import Cookie from 'js-cookie'

Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: '',
      longitude: '',
      zipCode: '',
      currentNeighborhood: '',
      locality: '',
      nonCookieLat: '',
      nonCookieLong: '',
      nonCookieZip: '',
      nonCookieNeighborhood: '',
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
      showLocation: false,
      showFeedback: false,
      showModal: false,
      modalType: '',
      cookieSet: false,
      searchedLocation: '',
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
      toggled: false
    }

    window.addEventListener("resize", this.update);

    this.handleHideLocation = this.handleHideLocation.bind(this);
    this.handleShowLocation = this.handleShowLocation.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleHidePrompt = this.handleHidePrompt.bind(this);
    this.getMyLocation = this.getMyLocation.bind(this)
    this.logout = this.logout.bind(this);
    this.refreshLocation = this.refreshLocation.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleHideLogin = this.handleHideLogin.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleHideRegistration = this.handleHideRegistration.bind(this);
    this.setLatLongFromZip = this.setLatLongFromZip.bind(this);
    this.handleShowRequestHelp = this.handleShowRequestHelp.bind(this);
    this.handleHideRequestHelp = this.handleHideRequestHelp.bind(this);
    this.findAssociations = this.findAssociations.bind(this)
    this.toggleNavBar = this.toggleNavBar.bind(this);
  }

  handleHideRequestHelp() {
    this.setState({showRequestHelp: false});
  }

  handleShowRequestHelp() {
    this.setState({showRequestHelp: true});
  }

  handleShowLocation() {
    this.setState({showLocation: true});
  }

  handleHideLocation() {
    this.setState({showLocation: false});
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

  updateNeighborhood(shouldUpdate) {
    if (shouldUpdate) {
      this.setState({
        latitude: this.state.nonCookieLat,
        longitude: this.state.nonCookieLong,
        currentNeighborhood: this.state.nonCookieNeighborhood,
        zipCode: this.state.nonCookieZip
      });
    }
    this.handleHidePrompt();
  }

  setNeighborhood(latitude, longitude, zipCode) {
    if (this.state.isLoaded) {
      return;
    }

    Geocode.fromLatLng(latitude, longitude).then(
      response => {
        var foundNeighborhood = '';
        var foundZipCode = '';
        var prevLocality = '';
        var locality = '';

        this.findAssociations(latitude, longitude, this);
        for (var i = 0; i < Math.min(4, response.results.length); i++) {
          const results = response.results[i]['address_components'];
          for (var j = 0; j < results.length; j++) {
            const types = results[j].types;
            // find neighborhood from current location

            if (types.includes('neighborhood') || types.includes('locality')) {
              if (foundNeighborhood === '') {
                foundNeighborhood = results[j]['long_name'];
              }
            }
            // find zip code from current location
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
        Cookie.set('neighborhood', foundNeighborhood, { expires: date });
        Cookie.set('locality', locality, { expires: date })
        this.setState({
          isLoaded: true,
          latitude: latitude,
          longitude: longitude,
          currentNeighborhood: foundNeighborhood,
          zipCode: foundZipCode,
          locality: locality
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  // Set association objects
  findAssociations(lat, long, currentComponent) {
    var url = "/api/association/get_assoc/lat_long?";
    let params = {
        'latitude': lat,
        'longitude': long
    }
    let query = Object.keys(params)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
          .join('&');
    url += query;

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
    // If cookie is set, keep that lat and long with associated zip code
    if (Cookie.get('latitude') 
        && Cookie.get('longitude')
        && Cookie.get('zipcode')
        && Cookie.get('neighborhood')
        && Cookie.get('locality')) {
      const lat = Cookie.get('latitude');
      const long = Cookie.get('longitude');
      const zip = Cookie.get('zipcode');
      const neighborhood = Cookie.get('neighborhood');
      const locality = Cookie.get('locality');
      this.setState({
        cookieSet: true,
        isLoaded: true,
        latitude: lat,
        longitude: long,
        currentNeighborhood: neighborhood,
        locality: locality,
        zipCode: zip
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
        // Use actual current lat long to find zip and neighborhood
        this.setNeighborhood(position.coords.latitude, position.coords.longitude, '');
        this.findAssociations(position.coords.latitude, position.coords.longitude, currentComponent);
      }, (error) => {
        
      });
    }

  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  refreshLocation() {
    Cookie.remove('latitude');
    Cookie.remove('longitude');
    Cookie.remove('zipcode');
    Cookie.remove('neighborhood');
    this.setState({isLoaded: false, searchedLocation: ''});
    this.getMyLocation();
  }

  handleLocationChange = (location) => {
      this.setState({
          searchedLocation: location
      })
  }

  onLocationSubmit = (e, location) => {
      e.preventDefault();
      this.handleHideLocation();
      this.setState({searchedLocation: ''});
      Geocode.fromAddress(location).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          Cookie.remove('latitude');
          Cookie.remove('longitude');
          Cookie.remove('zipcode');
          Cookie.remove('neighborhood');
          this.setState({isLoaded: false});
          this.setNeighborhood(lat, lng, '');
        },
        error => {
          alert("Invalid address");
        }
      );
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
        rightNav = <Form inline id = "getStarted" style ={{display: 'block', marginRight: '5%'}}>
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
        Manage your offer
      </Button>
    }

    var pageContent = <></>
    if (this.state.volunteerPortal) {
      pageContent = <VolunteerPortal state={this.state}/>
    } else {
      pageContent = <HomePage state={this.state} 
                              setState={this.setState}
                              handleShowModal={this.handleShowModal} 
                              handleHideRequestHelp={this.handleHideRequestHelp}
                              handleShowRegistration={this.handleShowRegistration}
                              handleHideLogin={this.handleHideLogin}
                              handleHideRegistration={this.handleHideRegistration}
                              handleLocationChange={this.handleLocationChange}
                              onLocationSubmit={this.onLocationSubmit}
                              handleShowRequestHelp={this.handleShowRequestHelp}
                              requestHelpMode={this.requestHelpMode}
                              clickOnUser={this.clickOnUser}
                              volunteerButton={volunteerButton}
                              refreshLocation={this.refreshLocation}
                              setLatLong={this.setLatLongFromZip}
                              portalText={portalText}/>
    }

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
      case 4:
        modal = <>
         <Modal.Header closeButton>
                <Modal.Title>Useful Resources in the Midst of COVID-19</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{paddingTop: 0}}><HelpfulLinks /></Modal.Body>
          </>
        break;
      default:
        modal = <></>
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
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navBorder'} onClick={() => this.handleShowModal(1)} >
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>About us</p>
                </Nav.Link>
                <Nav.Link className={this.state.toggled ? 'navBorderToggled': 'navBorder'} onClick={() => this.handleShowModal(2)}>
                  <p id={this.state.toggled ? 'navLinkToggled': 'navLink'}>How it works</p>
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

      <Modal show={this.state.showModal} onHide={this.handleHideModal} style = {{marginTop: 50}} id="general-modal">
        {modal}
      </Modal>
    </>);
  }
}

export default Home;