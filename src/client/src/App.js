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

import Switch from "react-switch";
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
      currentUser: undefined,
      currentUserAvailability: false,
      checked: false,
      showLogin: false,
      showRegistration: false
    }

    this.getMyLocation = this.getMyLocation.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.logout = this.logout.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleHideLogin = this.handleHideLogin.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleHideRegistration = this.handleHideRegistration.bind(this);
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
    const location = window.navigator && window.navigator.geolocation
    console.log(location)
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          isLoaded: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // 'latitude': 40.4577988,
          // 'longitude': -79.9235332,
        })
      }, (error) => {
        this.setState({ latitude: 'err-latitude', longitude: 'err-longitude' })
      })
    }
  }

  logout() {
    Cookie.remove('token');
    window.location.reload(false);
  }

  render() {
    const { isLoaded } = this.state;
    const { isLoggedIn } = this.state;

    var rightNav;
    var yourOffer;
    var toggleSwitch;
    if (isLoggedIn) {
      rightNav = <>
                  <Button onClick={this.logout} variant="outline-danger">
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
                    variant="outline-success">
                    Sign In
                  </Button>
                  <Button 
                    onClick={this.handleShowRegistration} 
                    variant="outline-success">
                    Get Started
                  </Button>
                </>;
      yourOffer = <></>
      toggleSwitch = <></>
    }

    if (!isLoaded) {
      return <div>Loading ... </div>;
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
                <Nav.Link href="#link">About Us</Nav.Link>
              </Nav>
              <Form inline>
                {rightNav}
              </Form>
            </Navbar.Collapse>
          </Navbar>


          <Container style = {{padding: '40px 15px'}}>
            <h1 style = {{fontWeight: 300}}>Need a hand?</h1>
            {toggleSwitch}
            <br />
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