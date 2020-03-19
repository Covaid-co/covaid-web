import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Offers from './Offers';
import CreateOffer from './CreateOffer';

import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import './App.css';

const Users = () => <span>Users</span>;

class App extends Component {
  constructor() {
    super()

    this.state = {
      latitude: '',
      longitude: '',
      isLoaded: false,
    }

    this.getMyLocation = this.getMyLocation.bind(this)
  }

  componentDidMount() {
    this.getMyLocation()
  }

  getMyLocation() {
    const location = window.navigator && window.navigator.geolocation
    if (location) {
      location.getCurrentPosition((position) => {
        this.setState({
          isLoaded: true,
          // latitude: position.coords.latitude,
          // longitude: position.coords.longitude,
          'latitude': 40.4577988,
          'longitude': -79.9235332,
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
            <Badge pill variant="success">
              Online
            </Badge>
            <br></br>
            <br></br>

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