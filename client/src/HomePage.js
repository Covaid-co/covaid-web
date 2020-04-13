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


    var helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="homeButtons" >
                      Request support
                    </Button>
    var cantFindLink = <></>

    
    if (props.state.currentAssoc.name === "Baltimore Mutual Aid") {
      helpButton = <></>
      cantFindLink = <Button variant="link" onClick={() => updateRequestHelpMode('general')} id="general-request-link">Can't find what you're looking for? Click here.</Button>
    }

    return (
        <div>
          <Jumbotron fluid id="jumbo">
            <Container id="jumboContainer">
              <Row>
                <Col md={6} id="jumbo-text" style={{height: 500}}>
                  <h1 id="jumboHeading">Mutual-aid for COVID-19</h1>
                  <p id="jumboText">Covaid connects community volunteers with those who need support</p>
                  {helpButton}{' '}
                  {props.volunteerButton}
                  <br />
                  <Button variant="link" 
                          id="covid-resources" 
                          onClick={() => props.handleShowResourceModal()}>
                      <u>View COVID-19 Resources</u>
                  </Button>
                </Col>
                <Col md={6} id="community-bulletin">
                  <p className='location-text'>See who's helping near {props.state.locality}</p>
                  <p className="volunteer-info">Click a volunteer's offer below for more info</p>
                  <NewOffers state={props.state} 
                            handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}
                            clickOnUser={props.clickOnUser}/>
                  {cantFindLink}
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
            <form id="web-separate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style={{position: 'absolute', marginTop: 5}}>
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="covaidco@gmail.com" />
              <input type="hidden" name="item_name" value="Provide aid during the COVID-19 pandemic" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form>
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
              {cantFindLink}
            </Col>
          </Container>
        </div>
    );
}
