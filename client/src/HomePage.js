import React, { useState } from "react";
import YourOffer from './YourOffer'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import LocationSetting from './LocationSetting';
import NewOffers from './NewOffers';
import NewRegister from './NewRegister';
import NewLogin from './NewLogin';
import RequestHelp from './RequestHelp';

import './HomePage.css'

const queryString = require('query-string');

export default function HomePage(props) {
    return (
        <div>
          <Jumbotron fluid>
            <Container id="jumboContainer">
              <Row>
              <Col xs={6} id="jumbo-text">
                <h1 id="jumboHeading">Mutual-aid for COVID-19</h1>
                <p id="jumboText">Covaid connects community volunteers with those who need help.</p>
                <Button onClick={props.handleShowRequestHelp} id="homeButtons" >
                  Request Help
                </Button>{' '}
                {props.volunteerButton}
                <br />
                <Button variant="link" 
                        id="covid-resources" 
                        onClick={() => props.handleShowModal(4)}>
                    <u>View COVID-19 Resources</u>
                </Button>
              </Col>
              <Col xs={6} id="community-bulletin">
                <p className='location-text'>See who's helping in {props.state.locality}</p>
                <p className="volunteer-info">Click an volunteer's offer below for more info</p>
                <NewOffers state={props.state} 
                          handleShowRequestHelp={props.handleShowRequestHelp}
                          clickOnUser={props.clickOnUser}/>
              </Col>
              </Row>
            </Container>
          </Jumbotron>
          <RequestHelp hideRequestHelp={props.handleHideRequestHelp}
                        state={props.state}/>
          <NewLogin handleShowRegistration={props.handleShowRegistration}
                    handleHideLogin={props.handleHideLogin}
                    state={props.state}/>
          <NewRegister handleHideRegistration={props.handleHideRegistration}
                        state={props.state}
                        setState={props.setState}/>
          <Container style={{marginLeft: '7%'}}>
              <LocationSetting state={props.state} 
                               setState={props.setState} 
                               handleLocationChange={props.handleLocationChange} 
                               locationSubmit={props.onLocationSubmit}
                               refreshLocation={props.refreshLocation} />
              {/* <NewOffers state={props.state} 
                          handleShowRequestHelp={props.handleShowRequestHelp}
                          clickOnUser={props.clickOnUser}/> */}
          </Container>
        </div>
    );
}
