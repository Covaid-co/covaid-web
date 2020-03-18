import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Offers } from './Offers';
import { CreateOffer } from './CreateOffer';

import logo from './logo.svg';

import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import './App.css';

const About = () => <span>About</span>;

const Users = () => <span>Users</span>;

class App extends Component {
  state = {
    response: '',
    post: '',
    responseToPost: '',
  };
  
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
  };
  
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();
    
    this.setState({ responseToPost: body });
  };
  
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
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Post to Server:</strong>
          </p>
          <input
            type="text"
            value={this.state.post}
            onChange={e => this.setState({ post: e.target.value })}
          />
          <button type="submit">Submit</button>
        </form>
        <p>{this.state.responseToPost}</p> */}
      </div>
    );
  }
}

export default App;