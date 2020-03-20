import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import Offers from './Offers';
import YourOffer from './YourOffer';
import Login from './Login';
import Register from './Register';
import HelpfulLinks from './HelpfulLinks';

import fetch_a from './util/fetch_auth';

import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'

import Switch from "react-switch";
import Geocode from "react-geocode";
import Cookie from 'js-cookie'

const Users = () => <span>Users</span>;

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
      currentZipCode: ''
    }

    this.getMyLocation = this.getMyLocation.bind(this)
    this.handleChange = this.handleChange.bind(this);
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
          this.setState({isLoggedIn: true});
          this.setState({first_name: user.first_name});
          this.setState({last_name: user.last_name});
        })
        .catch((error) => {
          console.error(error);
        });
  }

  handleChange(checked) {
    let form = {
      'availability': checked
    };
    this.setState({checked : checked});

    fetch_a('/api/users/update/', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form)
    })
    .then((response) => {
        if (response.ok) {
          this.setState({checked : checked});
          console.log("Update successful")
        } else {
          console.log("Update not successful")
        }
    })
    .catch((e) => {
        console.log("Error")
    });
    
  }

  getMyLocation() {
    if (Cookie.get('latitude') && Cookie.get('longitude')) {
      this.setState({
        isLoaded: true,
        latitude: Cookie.get('latitude'),
        longitude: Cookie.get('longitude'),
        // 'latitude': 40.4577988,
        // 'longitude': -79.9235332,
      })
    }
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        Cookie.set('latitude', position.coords.latitude);
        Cookie.set('longitude', position.coords.longitude);
        this.setState({
          isLoaded: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }
  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  setLatLongFromZip() {
    Geocode.fromAddress(this.state.currentZipCode).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        Cookie.set('latitude', lat);
        Cookie.set('longitude', lng);
        this.setState({
          isLoaded: true,
          latitude: lat,
          longitude: lng,
        });
      },
      error => {
        console.error(error);
      }
    );
  }

  handleChangeZip(value) {
    this.setState({currentZipCode: value});
  }

  isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
  }

  validateForm() {
    if (this.state.currentZipCode.length != 5) {
      return false;
    }
    return this.isNumeric(this.state.currentZipCode);
  }

  render() {
    const { isLoaded } = this.state;
    const { isLoggedIn } = this.state;

    var rightNav;
    var yourOffer;
    var toggleSwitch;
    if (isLoggedIn) {
      rightNav = <>
                  <Nav className="mr-sm-2">
                    Hello, {this.state.first_name}
                  </Nav>
                  <Button className="mr-sm-2" onClick={this.logout} variant="outline-danger">
                    Logout
                  </Button>
                </>;
      yourOffer = <Tab eventKey="your-offer" title="Your Offer">
                    <YourOffer state = {this.state}/>
                  </Tab>;
      toggleSwitch = <>
                <h5 style = {{fontWeight: 200}}>Your Availability</h5>
                <label>
                  <Switch onChange={this.handleChange} checked={this.state.checked} />
                </label>
              </>;       
    } else {
      rightNav = <>
                   <Button 
                    onClick={this.handleShowLogin}
                    variant="outline-success"
                    className="mr-sm-2">
                    Sign In
                  </Button>

                  <Button 
                    onClick={this.handleShowRegistration} 
                    variant="outline-success"
                    className="mr-sm-2">
                    Get Started
                  </Button>
                </>;
      yourOffer = <></>
      toggleSwitch = <></>
    }

    if (!isLoaded) {
      return (
        <div className="App">
          <Container style = {{padding: '40px 15px'}}>
              <div className="p-3 mb-5 bg-white">
                  <Spinner animation="border" role="status" style = {{marginBottom: 50}}>
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                  <br></br>
                  <h3 style = {{fontWeight: 300}}>Enter Zip Code if not Redirected</h3>
                  <Row className="justify-content-md-center">
                    <Col md={5}></Col>
                    <Col md={2}>
                      <Form>
                        <br></br>
                        <FormControl type="text" 
                                      value={this.state.currentZipCode} 
                                      onChange={(event) => {this.handleChangeZip(event.target.value)}} 
                                      placeholder="Zip Code" 
                                      className="mr-sm-2" />
                        <br></br>
                        <Button variant="outline-success" disabled={!this.validateForm()} onClick = {this.setLatLongFromZip}>Enter</Button>
                      </Form>
                    </Col>

                    <Col md={5}></Col>
                  </Row>
                </div>
              </Container>
          </div>)
    } else {
      return (
        <div>
        <div className="BottomHalf"></div>
        <div className="App">
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Cov-Aid</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#link">About Us (Under Construction)</Nav.Link>
                <NavDropdown alignRight title="Any issues?" id="basic-nav-dropdown">
                  <NavDropdown.Item>
                    Email: debanik1997@gmail.com
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    Call/Text: 4846249881
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Form inline>
                {rightNav}
              </Form>
            </Navbar.Collapse>
          </Navbar>


          <Container style = {{padding: '40px 15px'}}>
            <h5 style = {{fontWeight: 300, fontStyle: 'italic'}}>Need a hand?</h5>
            <h1 style = {{fontWeight: 300}}>Mutual Aid For COVID-19</h1>
            <br></br>
            {toggleSwitch}
            <br />

            <Row className="justify-content-md-center">
              <Col md={1}></Col>
              <Col md={8}>
                <Tabs defaultActiveKey="offers" id="uncontrolled-tab-example" className="justify-content-center">
                  <Tab eventKey="offers" title="Offers">
                    <Offers state = {this.state}/>
                  </Tab>
                  {yourOffer}
                  <Tab eventKey="links" title="Helpful Links">
                    <HelpfulLinks />
                  </Tab>
                </Tabs>
              </Col>

              <Col md={1}></Col>
            </Row>
          </Container>
          <Modal show={this.state.showLogin} onHide={this.handleHideLogin} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Enter your credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Login />
                </Modal.Body>
            </Modal>
            <Modal show={this.state.showRegistration} onHide={this.handleHideRegistration} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Get Started</Modal.Title>
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