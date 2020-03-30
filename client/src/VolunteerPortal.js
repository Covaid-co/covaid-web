import React, { useState } from "react";
import YourOffer from './YourOffer'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
const queryString = require('query-string');

export default function VolunteerPortal(props) {
    return (
        <div>
          <Jumbotron fluid>
            <Row>
              <Col lg={2} md={1} sm={0}>
              </Col>
              <Col>
                <Container>
                  <h1 id="jumboHeading">Welcome back, {props.state.first_name}!</h1>
                  <p id="jumboText">This is your volunteer portal, a place for you to manage your offers and requests</p>		
                </Container>
              </Col>
            </Row>
          </Jumbotron>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col lg={6} md={8} sm={10}>
              <Container style={{padding: 0}}> 
                <Button id="filterButton" style={{color: 'black'}}>Your Offer</Button>
              </Container>
              <Container className="shadow mb-5 bg-white rounded" id="yourOffer">
                <YourOffer state = {props.state} />
              </Container>
            </Col>
            <Col ></Col>
          </Row>
        </div>
    );
}
