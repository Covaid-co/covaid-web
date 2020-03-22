import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import Offers from './Offers';
import YourOffer from './YourOffer';
import LoginRegisterModal from './LoginRegisterModal';
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
import FormControl from 'react-bootstrap/FormControl'
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
      cookieSet: false,
      searchedLocation: '',
      currentState: '',
      width: 0,
    }

    window.addEventListener("resize", this.update);
    
    this.offerElement = React.createRef();

    this.handleHideLocation = this.handleHideLocation.bind(this);
    this.handleShowLocation = this.handleShowLocation.bind(this);
    this.handleHidePrompt = this.handleHidePrompt.bind(this);
    this.getMyLocation = this.getMyLocation.bind(this)
    this.logout = this.logout.bind(this);
    this.refreshLocation = this.refreshLocation.bind(this);
    this.handleShowLogin = this.handleShowLogin.bind(this);
    this.handleHideLogin = this.handleHideLogin.bind(this);
    this.handleShowRegistration = this.handleShowRegistration.bind(this);
    this.handleHideRegistration = this.handleHideRegistration.bind(this);
    this.handleShowWorks = this.handleShowWorks.bind(this);
    this.handleHideWorks = this.handleHideWorks.bind(this);
    this.handleShowAbout = this.handleShowAbout.bind(this);
    this.handleHideAbout = this.handleHideAbout.bind(this);
    this.setLatLongFromZip = this.setLatLongFromZip.bind(this);
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

  handleShowWorks() {
    this.setState({showWorks: true});
  }

  handleHideWorks() {
    this.setState({showWorks: false})
  }

  handleShowAbout() {
    this.setState({showAbout: true});
  }

  handleHideAbout() {
    this.setState({showAbout: false})
  }

  componentDidMount() {
    this.getMyLocation();
    this.update();
    if (!this.state.isLoggedIn && Cookie.get("token")) {
      this.fetchUser()
    }
  }

  update = () => {
    this.setState({
      width: window.innerWidth
    });
  };

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

  updateNeighborhood(shouldUpdate) {
    if (shouldUpdate) {
      this.setState({
        latitude: this.state.nonCookieLat,
        longitude: this.state.nonCookieLong,
        currentNeighborhood: this.state.nonCookieNeighborhood,
        zipCode: this.state.nonCookieZip
      });
      // console.log(this.offerElement);
      // this.offerElement.current.refreshOffers(this.state.nonCookieLat, this.state.nonCookieLong);
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
        for (var i = 0; i < Math.min(4, response.results.length); i++) {
          const results = response.results[i]['address_components'];
          // console.log(results);
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

        // // if cookie is set, need to prompt user to pick which location to use
        // if (this.state.cookieSet && Cookie.get('zipcode') !== foundZipCode) {
        //   this.setState({
        //     nonCookieLat: latitude,
        //     nonCookieLong: longitude,
        //     nonCookieZip: foundZipCode,
        //     nonCookieNeighborhood: foundNeighborhood,
        //     promptChangeZip: true
        //   });
        // } 
        // if (!this.state.cookieSet) {
        //   console.log("not set yet");
        //   Cookie.set('latitude', latitude);
        //   Cookie.set('longitude', longitude);
        //   Cookie.set('zipcode', foundZipCode);
        //   Cookie.set('neighborhood', foundNeighborhood);
        //   this.setState({
        //     isLoaded: true,
        //     latitude: latitude,
        //     longitude: longitude,
        //     currentNeighborhood: foundNeighborhood,
        //     zipCode: foundZipCode
        //   });
        // } else {
        //   this.setState({isLoaded: true});
        // }
      },
      error => {
        console.error(error);
      }
    );
  }

  // Finds lat and long from cookie first and if found will load page
  // lat and long will be updated once geolocation is working
  getMyLocation() {
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
      }, (error) => {
        console.log("No geolocation");
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

  handleLocationChange = (e) => {
      this.setState({
          searchedLocation: e.target.value
      })
  }

  onLocationSubmit = (e) => {
      e.preventDefault();
      this.handleHideLocation();
      console.log(this.state.searchedLocation);
      Geocode.fromAddress(this.state.searchedLocation).then(
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
    Geocode.fromAddress(zipCode).then(
      response => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setNeighborhood(lat, lng, zipCode);
      },
      error => {
        console.error(error);
      }
    );
  }

  render() {
    const { isLoaded } = this.state;
    const { isLoggedIn } = this.state;

    var bulletin;
    var offer;
    var link;
    if (this.state.width < 575) {
      bulletin = "Bulletin";
      offer = "My Offer";
      link = "Links";
    } else {
      bulletin = "Community Bulletin";
      offer = "My Offer";
      link = "Helpful Links";
    }

    var rightNav;
    var yourOffer;
    var howHelp;
    if (isLoggedIn) {
      rightNav = <>
                  <span id = "name" 
                        style = {{color: 'white', 
                                  marginRight: 20, 
                                  marginBottom: 15, 
                                  fontWeight: 600, 
                                  fontSize: 13,
                                  marginTop: 8}}>
                    {/* <font color="white" style = {{fontWeight: 600, fontSize: 13}}> */}
                      Hello, {this.state.first_name}
                    {/* </font> */}
                  </span>
                  <Button variant="outline-danger" id = 'logoutButton' onClick={this.logout}>
                    <font id = "logout" style = {{color: 'white', fontWeight: 600, fontSize: 13}}>
                      Logout
                    </font>
                  </Button>
                </>;
      yourOffer = <Tab eventKey="your-offer" title={offer} className="tabColor" id='bootstrap-overide'>
                    <YourOffer state = {this.state}/>
                  </Tab>;  
      howHelp = <><h5>My Offer</h5>
       <p style={{fontWeight: 300}}>Under this tab, logged-in users can create their own offers for support. They can choose 
       their primary neighborhood to support, provide more details regarding their offer, and update their availability status (whether or not they want their offer to be displayed on the community bulletin.).</p></>  
    } else {
      rightNav = <>
                  <Button variant="outline-light" 
                          style={{outlineWidth: "thick"}}
                          id = 'howHelpButton'
                          onClick={this.handleShowRegistration}>
                    <font id ="help" 
                          style = {{color:"white", 
                                    fontWeight: 600,
                                    fontSize: 16}}>
                      How can I help?
                    </font>
                  </Button>
                </>;
      yourOffer = <></>;
      howHelp = <></>
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
            <Navbar variant="light" expand="sm" className = 'customNav'>
              <Navbar.Brand id="home" 
                            style ={{color: 'white', 
                                     fontWeight: 600, 
                                     marginLeft: '10%', 
                                     fontSize: 24,
                                     marginRight: 20}}>
                Cov-Aid
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link 
                    id = "navLink1"
                    style ={{color: 'white', fontWeight: 600, fontSize: 13, whiteSpace: "nowrap"}} 
                    onClick={this.handleShowAbout}>
                    About Us
                  </Nav.Link>
                  <Nav.Link 
                    id = "navLink2"
                    style ={{color: 'white', fontWeight: 600, fontSize: 13, whiteSpace: "nowrap"}} 
                    onClick={this.handleShowWorks}>
                    How It Works
                  </Nav.Link>
                </Nav>
                <Form inline id = "getStarted" style ={{display: 'block', marginRight: '10%'}}>
                  {rightNav}
                </Form>
              </Navbar.Collapse>
            </Navbar>

            <Container style = {{padding: '40px 15px'}}>
              <h1 style = {{fontWeight: 700, color: 'white'}}>Mutual aid for COVID-19</h1>
              <h5 style = {{fontWeight: 300, fontStyle: 'italic', color: 'white', marginBottom: 40}}>Need a hand?</h5>
              <h6 style = {{fontWeight: 300, color: 'white'}}>
                {/* <i style={{color: "#e22447", fontSize: 25, marginRight: 5}} className="fa fa-map-marker"></i>  */}
                <Button variant="success"
                        size="sm"
                        onClick={this.handleShowLocation}
                        style = {{fontSize: '85%', 
                                  position: 'relative',
                                  bottom: 5,
                                  padding: '.1rem .2rem',
                                  fontWeight: 700}}>
                  {this.state.currentNeighborhood}
                </Button>{' '}
                <Button onClick={this.refreshLocation} style={{width: "30px",
                                height: "30px",
                                padding: "6px 0px",
                                borderRadius: "15px",
                                textAlign: "center",
                                fontSize: "12px",
                                lineHeight: "1.22857",
                                position: "relative",
                                top: "50%",
                                transform: "translateY(-15%)"}}variant="danger" size="sm">
                  <i class="fa fa-refresh" aria-hidden="true"></i>
                </Button>{' '}
              </h6>
              {/* <Form inline onSubmit={(e) => this.onLocationSubmit(e)} style={{marginTop: "10px", marginBottom: "30px", display: "inline-block"}}>
                <FormControl 
                  type="text" 
                  value={this.state.searchedLocation} 
                  onChange={e => this.handleLocationChange(e)}
                  placeholder="Enter city or zipcode" 
                  className="mr-sm-2" />
                <Button type="submit" variant="success"><i class="fa fa-search" aria-hidden="true"></i></Button>
              </Form> */}
              <br />
              <Row className="justify-content-md-center">
                <Col md={1}></Col>
                <Col md={8}>
                  <Tabs defaultActiveKey="offers" id="uncontrolled-tab-example" className="justify-content-center">
                    <Tab eventKey="offers" title={bulletin} id='bootstrap-overide'>
                      <Offers state = {this.state}/>
                    </Tab>
                    {yourOffer}
                    <Tab eventKey="links" title={link} id='bootstrap-overide'>
                      <HelpfulLinks />
                    </Tab>
                  </Tabs>
                </Col>
                <Col md={1}></Col>
              </Row>
            </Container>
            <Modal show={this.state.showRegistration} onHide={this.handleHideRegistration} style = {{marginTop: 60}}>
              <LoginRegisterModal state = {this.state}/>
            </Modal>

            <Modal show={this.state.showWorks} onHide={this.handleHideWorks} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>How It Works</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h5>The Community Bulletin</h5>
                  <p style={{fontWeight: 300}}>The community bulletin is home to all offers of mutual aid being made by your community. 
                    Each entry represents an offer by a particular user, and displays information regarding what tasks
                     this user can help undertake. More information about each offer, such as contact information, can be found by clicking the offer.</p>
                  {howHelp}
                  <h5>Questions?</h5>
                  <p style={{fontWeight: 300, fontStyle: 'italic'}}>Direct any questions or concerns to 
                  debanik1997@gmail.com or lijeffrey39@gmail.com</p>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.showAbout} onHide={this.handleHideAbout} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>About Us</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>We're 2 college seniors who both recently had our final semesters taken away by COVID-19.
                     Wanting to play our part, we created  <font style = {{fontStyle: 'italic'}}> Cov-Aid</font>
                     , a tool to help provide mutual aid to elderly, immune-compromised, and those with underlying 
                     illnesses in this time of distress. 
                  </p>
                </Modal.Body>
            </Modal>

            <Modal size="sm"
                  show={this.state.showLocation} 
                  onHide={this.handleHideLocation} 
                  style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                  <Modal.Title>Choose a Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form inline onSubmit={(e) => this.onLocationSubmit(e)} style={{marginTop: "10px", marginBottom: "30px", display: "inline-block"}}>
                    <FormControl 
                      type="text" 
                      value={this.state.searchedLocation} 
                      onChange={e => this.handleLocationChange(e)}
                      placeholder="Enter city or zipcode" 
                      className="mr-sm-2" />
                    <Button type="submit" variant="success"><i class="fa fa-search" aria-hidden="true"></i></Button>
                  </Form>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.promptChangeZip} style = {{marginTop: 50, maxHeight: '100%', overflowY: 'auto'}}>
                <Modal.Header>
                  <Modal.Title>Confirm Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p style={{fontWeight: 300, fontStyle: 'italic'}}>
                    Uh oh. It seems like you have moved. Confirm which neighborhood is your current location!
                  </p>
                  <br></br>
                  <Row className="justify-content-md-center">
                    <Col md={6} style = {{textAlign: 'right'}}>
                      <Button variant="success" onClick={() => this.updateNeighborhood(false)}>{this.state.currentNeighborhood}</Button>
                    </Col>
                    <Col md={6} style = {{textAlign: 'left'}}>
                      <Button variant="success" onClick={() => this.updateNeighborhood(true)}>{this.state.nonCookieNeighborhood}</Button>
                    </Col>
                  </Row>
                </Modal.Body>
            </Modal>
          </div>
        </div>
      );
    }
  }
}

export default App;