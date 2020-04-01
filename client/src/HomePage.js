import React, { useState } from "react";
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
import GetLocation from './GetLocation';

import './HomePage.css'

export default function HomePage(props) {
    const [mode, setMode] = useState('');
    const [modalInfo, setModalInfo] = useState({});

    function updateRequestHelpMode(mode, modalInfo) {
      props.handleShowRequestHelp()
      setMode(mode)
      setModalInfo(modalInfo)
    }

    var helpButton = <></>
    if (!props.state.isLoggedIn) {
      helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="homeButtons" >
                      Request Help
                    </Button>
    }

    return (
        <div>
          <Jumbotron fluid id="jumbo">
            <Container id="jumboContainer">
              <Row>
                <Col md={6} id="jumbo-text">
                  <h1 id="jumboHeading">Mutual-aid for COVID-19</h1>
                  <p id="jumboText">Covaid connects community volunteers with those who need help</p>
                  {helpButton}{' '}
                  {props.volunteerButton}
                  <br />
                  <Button variant="link" 
                          id="covid-resources" 
                          onClick={() => props.handleShowModal(4)}>
                      <u>View COVID-19 Resources</u>
                  </Button>
                </Col>
                <Col md={6} id="community-bulletin">
                  <p className='location-text'>See who's helping near {props.state.locality}</p>
                  <p className="volunteer-info">Click a volunteer's offer below for more info</p>
                  <NewOffers state={props.state} 
                            handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}
                            clickOnUser={props.clickOnUser}/>
                </Col>
              </Row>
            </Container>
          </Jumbotron>
          <RequestHelp requestHelpMode={mode} hideRequestHelp={props.handleHideRequestHelp}
                        state={props.state} volunteer={modalInfo}/>
          <NewLogin handleShowRegistration={props.handleShowRegistration}
                    handleHideLogin={props.handleHideLogin}
                    showLogin={props.state.showLogin}/>
          <NewRegister handleHideRegistration={props.handleHideRegistration}
                        state={props.state}
                        setState={props.setState}/>
          <GetLocation state={props.state}
                       setLatLong={props.setLatLong}/>
          <Container id="location-container">
              <LocationSetting state={props.state} 
                               setState={props.setState} 
                               handleLocationChange={props.handleLocationChange} 
                               locationSubmit={props.onLocationSubmit}
                               refreshLocation={props.refreshLocation}
                               associations={props.state.associations} />
          </Container>
          <Container id="jumboContainer" className="mobile-bulletin-container">
            <Col xs={12} id="mobile-bulletin">
              <p className='location-text' style={{color: 'black', float: 'left', width: '100%', fontSize: "5vw"}}>
                See who's helping near {props.state.locality}<br/> 
                
              </p>
              <p className="volunteer-info" style={{color: 'black', float: 'left', fontWeight: 'normal', fontSize: "3vw"}}>Click an offer below for more info</p>
              <NewOffers state={props.state} 
                        handleShowRequestHelp={props.handleShowRequestHelp}
                        clickOnUser={props.clickOnUser}/>
            </Col>
          </Container>    
        </div>
    );
}
