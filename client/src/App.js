import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import Offers from './Offers';
import YourOffer from './YourOffer';
import Login from './Login';
import Register from './Register';
import HelpfulLinks from './HelpfulLinks';
import Loading from './Loading';

import fetch_a from './util/fetch_auth';

import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Geocode from "react-geocode";

import Cookie from 'js-cookie'

Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");

class App extends Component {
  constructor() {
    super()

    this.state = {
      latitude: '',
      longitude: '',
      isLoaded: false,
      isLoggedIn: false,
      first_name: '',
      last_name: '',
      currentUser: undefined,
      currentUserAvailability: false,
      checked: false,
      showLogin: false,
      showRegistration: false,
      currentZipCode: '',
      currentNeighborhood: ''
    }

    this.getMyLocation = this.getMyLocation.bind(this)
    this.logout = this.logout.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleHideLogin = this.handleHideLogin.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleHideRegistration = this.handleHideRegistration.bind(this);
    this.setLatLongFromZip = this.setLatLongFromZip.bind(this);
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

  componentDidMount() {
    this.getMyLocation();
    if (Cookie.get("token")) {
      this.fetchUser()
    }
  }

  fetchUser(){
    fetch_a('/api/users/current')
      .then((response) => response.json())
      .then((user) => {
        this.setState({ checked: user.availability });
        this.setState({ isLoggedIn: true });
        this.setState({ first_name: user.first_name });
        this.setState({ last_name: user.last_name });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setStateAndNeighborhood(lat, long) {
    this.setState({
      latitude: lat,
      longitude: long
    })
    this.findAndSetNeighborhood(lat, long);
  }

  // Finds lat and long from cookie first and if found will load page
  // lat and long will be updated once geolocation is working
  getMyLocation() {
    if (Cookie.get('latitude') && Cookie.get('longitude')) {
      const lat = Cookie.get('latitude');
      const long = Cookie.get('longitude');
      this.setStateAndNeighborhood(lat, long);
    } else {
      const location = window.navigator && window.navigator.geolocation;
      if (location) {
        location.getCurrentPosition((position) => {
          Cookie.set('latitude', position.coords.latitude);
          Cookie.set('longitude', position.coords.longitude);
          this.setStateAndNeighborhood(position.coords.latitude, position.coords.longitude);
        }, (error) => {
          console.log("No geolocation")
        })
      }
    }
  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  // Set isLoaded to true once a neighborhood is found
  findAndSetNeighborhood(lat, long) {
    Geocode.fromLatLng(lat, long).then(
      response => {
        var foundNeighborhood = '';
        for (var i = 0; i < Math.min(4, response.results.length); i++) {
          const results = response.results[i]['address_components'];
          for (var j = 0; j < results.length; j++) {
            const types = results[j].types;
            if (types.includes('neighborhood') || types.includes('locality')) {
              const currNeighborhoodName = results[j]['long_name'];
              if (foundNeighborhood == '') {
                foundNeighborhood = currNeighborhoodName;
              }
            }
          }
        }
        this.setState({
          isLoaded: true,
          currentNeighborhood: foundNeighborhood
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  setLatLongFromZip(event, zipCode) {
    event.preventDefault();
    event.stopPropagation();
    Geocode.fromAddress(zipCode).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        Cookie.set('latitude', lat);
        Cookie.set('longitude', lng);
        this.setStateAndNeighborhood(lat, lng);
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    const { isLoaded } = this.state;
    const { isLoggedIn } = this.state;

    var rightNav;
    var yourOffer;
    if (isLoggedIn) {
      rightNav = <>
                  <a style = {{marginRight: 20}}><font color="white" style = {{fontWeight: 600, fontSize: 13}}>Hello, {this.state.first_name}</font></a>
                  <Button variant="outline-danger" onClick={this.logout}>
                    <font color="white" style = {{fontWeight: 600, fontSize: 13}}>
                      Logout
                    </font>
                  </Button>
                </>;
      yourOffer = <Tab eventKey="your-offer" title="How can I help?" className="tabColor" id='bootstrap-overide'>
                    <YourOffer state = {this.state}/>
                  </Tab>;    
    } else {
      rightNav = <>
                  <a class="btn" onClick={this.handleShowLogin}><font color="white" style = {{fontWeight: 600, fontSize: 13}}>Sign In</font></a>
                  <Button variant="outline-light" onClick={this.handleShowRegistration}><font color="white" style = {{fontWeight: 600, fontSize: 13}}>Get Started</font></Button>
                </>;
      yourOffer = <></>;
    }

    if (!isLoaded) {
      return (
        <div className="App">
          <Loading setLatLong={this.setLatLongFromZip}/>
        </div>)
    } else {
      return (
        <div>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
          <div className="BottomHalf"></div>
          <div className="App">
            <Navbar variant="light" expand="lg" className = 'customNav'>
              <Navbar.Brand href="#home" style ={{color: 'white', fontWeight: 600, marginLeft: '15%', fontSize: 24}}>Cov-Aid</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav" style = {{marginLeft: 20}}>
                <Nav className="mr-auto">
                  <Nav.Link href="#link" style ={{color: 'white', fontWeight: 600, fontSize: 13}}>About Us</Nav.Link>
                  {/* <NavDropdown alignRight title="Any issues?" id="basic-nav-dropdown">
                    <NavDropdown.Item>
                      Email: debanik1997@gmail.com
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      Call/Text: 4846249881
                    </NavDropdown.Item>
                  </NavDropdown> */}
                </Nav>
                <Form inline style ={{display: 'block', marginRight: '15%'}}>
                  {rightNav}
                </Form>
              </Navbar.Collapse>
            </Navbar>

            <Container style = {{padding: '40px 15px'}}>
              <h5 style = {{fontWeight: 300, fontStyle: 'italic', color: 'white'}}>Need a hand?</h5>
              <h1 style = {{fontWeight: 800, color: 'white'}}>Mutual Aid For COVID-19</h1>
              <h6 style = {{fontWeight: 300, color: 'white'}}><i style={{color: "red", fontSize: 20, marginRight: 5}} class="fa fa-map-marker"></i> {this.state.currentNeighborhood}</h6>
              <br />
              <Row className="justify-content-md-center">
                <Col md={1}></Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="offers" id="uncontrolled-tab-example" className="justify-content-center">
                    <Tab eventKey="offers" title="Community Bulletin" id='bootstrap-overide'>
                      <Offers state = {this.state}/>
                    </Tab>
                    {yourOffer}
                    <Tab eventKey="links" title="Helpful Links" id='bootstrap-overide'>
                      <HelpfulLinks />
                    </Tab>
                  </Tabs>
                </Col>
                <Col md={1}></Col>
              </Row>
            </Container>

            <Modal size="sm" show={this.state.showLogin} onHide={this.handleHideLogin} style = {{marginTop: 60}}>
                  <Modal.Header closeButton>
                  <Modal.Title>Sign in to Cov-Aid</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <Login />
                  </Modal.Body>
              </Modal>

            <Modal show={this.state.showRegistration} onHide={this.handleHideRegistration} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Create Your Account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Register />
                </Modal.Body>
            </Modal>
          </div>
        </div>
      );
    }
  }
}

export default App;