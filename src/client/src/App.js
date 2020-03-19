import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Offers from './Offers';
import CreateOffer from './CreateOffer';
import Login from './Login';
import Register from './Register';

import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Switch from "react-switch";

import './App.css';
import fetch_a from './util/fetch_auth';

const Users = () => <span>Users</span>;

class App extends Component { 

  constructor() {
    super();
    this.state = { 
      currentUser: undefined,
      currentUserAvailability: false,
      checked: false 
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.fetchUser()
    // this.setState({data : data});
    // console.log(this.state.currentUser)
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

  render() {
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
                  <Offers />
                </Tab>
                <Tab eventKey="create-offer" title="Create Offer">
                  <CreateOffer />
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
      </div>
    );
  }
}

export default App;