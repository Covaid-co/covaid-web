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

const About = () => <span>About</span>;

const Users = () => <span>Users</span>;

class App extends Component {
  componentDidMount() {

  }
  render() {
    return (
      <div className="App">
        <Container style = {{padding: '40px 15px'}}>
          <h1 style = {{fontWeight: 300}}>Mutual Aid - Coronavirus</h1>
          <Badge pill variant="success">
            Online
          </Badge>{' '}
          <p style = {{padding: 10}}>132 Successful Transactions</p>

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