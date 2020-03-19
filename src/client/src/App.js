import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import Offers from './Offers';
import CreateOffer from './CreateOffer';
import Login from './Login';
import Register from './Register';

import fetch_a from './util/fetch_auth';

import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Switch from "react-switch";

const Users = () => <span>Users</span>;

class App extends Component {
  constructor() {
    super()

    this.state = {
      latitude: '',
      longitude: '',
      isLoaded: false,
      currentUser: undefined,
      currentUserAvailability: false,
      checked: false 
    }

    this.getMyLocation = this.getMyLocation.bind(this)
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.getMyLocation()
    this.fetchUser()
  }

  fetchUser(){
    fetch_a('/api/users/current')
        .then((response) => response.json())
        .then((responseJson) => {
          const { user } = responseJson;
          this.setState({ checked: user.availability });
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

    fetch_a('/api/users/update_availability/', {
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

  render() {
    const { isLoaded } = this.state;

    if (!isLoaded) {
      return <div>Loading ... </div>;
    } else {
      return (
        <div className="App">
          <Container style = {{padding: '40px 15px'}}>
            <h1 style = {{fontWeight: 300}}>Corona-Aid</h1>
            <h5 style = {{fontWeight: 200}}>Your Availability</h5>
            <label>
              <Switch onChange={this.handleChange} checked={this.state.checked} />
            </label>
            <br />
            <br />

            <Row className="justify-content-md-center">
              <Col md={1}></Col>
              <Col md={8}>
                <Tabs defaultActiveKey="offers" id="uncontrolled-tab-example" className="justify-content-center">
                  <Tab eventKey="offers" title="Offers">
                    <Offers state = {this.state}/>
                  </Tab>
                  <Tab eventKey="create-offer" title="Create Offer">
                    <CreateOffer state = {this.state}/>
                  </Tab>
                  <Tab eventKey="faq" title="FAQ">
                    <Users />
                  </Tab>
                  <Tab eventKey="login" title="Login">
                  <Login />
                  </Tab>
                  <Tab eventKey="register" title="Register">
                    <Register />
                  </Tab>
                </Tabs>
              </Col>

              <Col md={1}></Col>
            </Row>
          </Container>
          {/* <div>
            <input type="text" value={latitude} />
            <input type="text" value={longitude} />
          </div> */}
        </div>
      );
    }
  }
}

export default App;