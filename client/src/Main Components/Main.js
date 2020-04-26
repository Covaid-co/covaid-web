import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import NavBar from '../components/NavBar'
import NewOffers from '../NewOffers'
import RequestHelp from '../RequestHelp'
import NewLogin from '../NewLogin'
import NewRegister from '../NewRegister'
import GetLocation from '../GetLocation'

import getMyLocation from '../location_tools/LocationHelpers'

import '../HomePage.css'

export default function Main(props) {

    const [mode, setMode] = useState('');
    const [modalInfo, setModalInfo] = useState({});
    const [showRequestHelp, setShowRequestHelp]  = useState(false);

    const [showLogin, setShowLogin] = useState(false);
    const [showRegistration, setShowRegistration] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({})
    const [viewableAssociation, setViewableAssociation] = useState({})

    function updateRequestHelpMode(mode, modalInfo) {
        console.log(currentLocation)
        setMode(mode)
        setModalInfo(modalInfo)
        setShowRequestHelp(true)
    }

    const hideRequestHelp = () => {
      setMode('')
      setModalInfo({})
      setShowRequestHelp(false)
    }

    useEffect(() => { 
        getMyLocation(setCurrentLocation, setViewableAssociation)
    }, [])


    var helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="homeButtons" >
                      Request help
                    </Button>
    var cantFindLink = <></>

    return (
        <>
          <NavBar setShowLogin={setShowLogin} setShowRegistration={setShowRegistration}/>
          <Jumbotron fluid id="jumbo">
            <Container id="jumboContainer">
              <Row>
                <Col md={6} id="jumbo-text">
                  <h1 id="jumboHeading">Mutual-aid for COVID-19</h1>
                  <p id="jumboText">Covaid connects community volunteers with those who need help</p>
                  {helpButton}
                  <br />
                  <Button variant="link" 
                          id="covid-resources" 
                          >
                      <u>View COVID-19 Resources</u>
                  </Button>
                </Col>
                <Col md={6} id="community-bulletin">
                  <p className='location-text'>See who's helping near</p>
                  <p className="volunteer-info">Click a volunteer's offer below for more info</p>
                  <NewOffers latitude={currentLocation.latitude} longitude={currentLocation.longitude} 
                                      handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)} />
                    
                  {cantFindLink}
                </Col>
              </Row>
            </Container>
          </Jumbotron>
          <RequestHelp requestHelpMode={mode} 
                        showRequestHelp={showRequestHelp}
                        hideRequestHelp={hideRequestHelp}
                        volunteer={modalInfo}
                        />
          <NewLogin handleHideLogin={() => setShowLogin(false)} showLogin={showLogin}/>
          <NewRegister handleHideRegistration={() => setShowRegistration(false)} showRegistration={showRegistration} />
          <GetLocation isLoaded={currentLocation.isLoaded}
                       />


          {/* <NewLogin handleShowRegistration={props.handleShowRegistration}
                    handleHideLogin={props.handleHideLogin}
                    showLogin={props.state.showLogin}/> */}




          {/* <RequestHelp requestHelpMode={mode} hideRequestHelp={props.handleHideRequestHelp}
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
                               locationSubmit={props.onLocationSubmit}
                               refreshLocation={props.refreshLocation}
                               associations={props.state.associations} />
          </Container> */}
          <Container id="jumboContainer" className="mobile-bulletin-container">
            <Col xs={12} id="mobile-bulletin">
              <p className='location-text' style={{color: 'black', float: 'left', width: '100%', fontSize: "5vw"}}>
                See who's helping near<br/> 
                
              </p>
              <p className="volunteer-info" style={{color: 'black', float: 'left', fontWeight: 'normal', fontSize: "3vw"}}>Click an offer below for more info</p>
              <NewOffers latitude={currentLocation.latitude} longitude={currentLocation.longitude} />
              {cantFindLink}
              {/* <NewOffers state={props.state} 
                        handleShowRequestHelp={props.handleShowRequestHelp}/>
              {cantFindLink} */}
            </Col>
          </Container>    
        
        </>
    )
}