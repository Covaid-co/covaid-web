import React, { useState } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import RequestsDashboard from './RequestsDashboard'

export default function OrganiationPortal() {
    return (<>
        <Navbar collapseOnSelect 
                variant="light" 
                expand="md"
                className = {'customNav'}>
        <Navbar.Brand className={'home'} href = {window.location.protocol + '//' + window.location.host}
            style={{'color': 'white'}}>
            covaid
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
           
        </Navbar.Collapse>
        </Navbar>
        <div>
          <Jumbotron fluid>
            <Row>
              <Col lg={2} md={1} sm={0}>
              </Col>
              <Col>
                <Container>
                  <h1 id="jumboHeading">Welcome back, </h1>
                  <h1 id="jumboHeading">Baltimore Mutual Aid!</h1>
                  <p id="jumboText">This is your organization portal, a place for you to manage volunteers and requests in your area</p>	
                  <Button id="homeButtons" >
                    View list of volunteers
                </Button>{' '}	
                </Container>
              </Col>
            </Row>
          </Jumbotron>
          <Row className="justify-content-md-center">
            <Col></Col>
            <Col lg={6} md={8} sm={10}>
              <Container style={{padding: 0}}> 
                <Button id="filterButton" style={{color: 'black'}}><strong>Requests</strong></Button>
              </Container>
              <Container className="shadow mb-5 bg-white rounded" id="yourOffer">
                  <RequestsDashboard />
              </Container>
            </Col>
            <Col ></Col>
          </Row>
        </div>
                    
        </>
    );
}
