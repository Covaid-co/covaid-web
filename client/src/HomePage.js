import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'

import CitySupport from './CitySupport';
import NewOffers from './NewOffers';
import NewRegister from './NewRegister';
import NewLogin from './NewLogin';
import RequestHelp from './RequestHelp';
import GetLocation from './GetLocation';
import AboutUs from './information_modals/AboutUs'
import HowItWorks from './information_modals/HowItWorks'
import Feedback from './information_modals/Feedback'
import NewLocationSetting from './location_tools/NewLocationSetting';
import { generateURL } from './Helpers'
import { defaultResources } from './constants'
import './HomePage.css';

export default function HomePage(props) {

    const [mode, setMode] = useState('');
    const [modalInfo, setModalInfo] = useState({});
    const [volunteers, setVolunteers] = useState([]);
    const [resources, setResources] = useState([]);

    useEffect(() => {
      let params = {'latitude': props.state.latitude, 'longitude': props.state.longitude}
      var url = generateURL("/api/users/all?", params);
      async function fetchData() {
          const response = await fetch(url);
          response.json().then((data) => {
            setVolunteers(data.slice(0, Math.min(data.length, 20)));
          });
      }

      if (props.state.latitude && 
          props.state.longitude && 
          JSON.stringify(props.state.currentAssoc.resources) !== JSON.stringify(resources)) {
          fetchData();
      }

      if (Object.keys(props.state.currentAssoc).length > 0) {
        setResources(props.state.currentAssoc.resources);
      } else {
        setResources(defaultResources);
      }
  }, [props.state.currentAssoc]);


    var cantFindLink = <></>;
    if (props.state.currentAssoc.name === "Baltimore Mutual Aid") {
      cantFindLink = <Button variant="link" onClick={() => updateRequestHelpMode('general')} id="general-request-link">
                      Can't find what you're looking for? Click here.
                    </Button>
    }

    function updateRequestHelpMode(mode, modalInfo) {
      props.handleShowRequestHelp()
      setMode(mode);
      setModalInfo(modalInfo);
    }

    const supportButton = () => {
        var helpButton = <Button 
                            onClick={() => updateRequestHelpMode('general')} 
                            id="request-button">
                            Request support
                        </Button>
        if (props.state.currentAssoc.name === "Baltimore Mutual Aid") {
            helpButton = <></>;
        }
        return helpButton;
    }

    const getCurrentModal = () => {
        var modal = <></>;
        if (props.state.modalType === 1) {
            modal = <AboutUs />;
        } else if (props.state.modalType === 2) {
            modal = <HowItWorks />;
        } else if (props.state.modalType === 3) {
            modal = <Feedback handleHide={props.handleHideModal}/>
        } else if (props.state.modalType === 4) {
            modal = <><Modal.Header closeButton>
                            <Modal.Title>Invalid Address</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Please enter a valid city or zip code</p>
                        </Modal.Body></>;
        } else if (props.state.modalType === 5) {
            modal = <NewLocationSetting locationSubmit={props.onLocationSubmit}
                                        refreshLocation={props.refreshLocation}
                                        showModal={props.state.showModal} 
                                        hideModal={props.handleHideModal}/>
        }
        return modal;
    }

    return (
        <div>
            <Jumbotron fluid id="jumbo" style={{backgroundColor: 'white'}}>
                <Container id="jumboContainer">
                    <Row>
                        <Col md={6} id="jumbo-text" style={{height: 500}}>
                            <h1 id="home-heading">Mutual-aid for COVID-19</h1>
                            <p id="home-subheading">Covaid connects community volunteers with those who need support</p>
                            {supportButton()}{' '}
                            {props.volunteerButton}
                            <br />
                            <Button variant="link" 
                                    id="underlined-link" 
                                    onClick={() => props.handleShowResourceModal()}>
                                <u>View COVID-19 Resources</u>
                            </Button>
                        </Col>
                        <Col md={6} id="community-bulletin">
                            <p id='location-text'>Volunteers around 
                                <button id="change-location" onClick={() => props.handleShowModal(5)}> {props.state.locality}</button>
                            </p>
                            <p id="volunteer-info">Click an offer below for more info</p>
                            <NewOffers volunteers={volunteers} state={props.state} resources={resources}
                                        handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
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
                       onLocationSubmit={props.onLocationSubmit}
                       hideModal={props.handleHideModal}/>
          <Container id="location-container">
            <CitySupport state={props.state} 
                        setState={props.setState}
                        associations={props.state.associations} />
            {/* <form id="web-separate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank" style={{position: 'absolute', marginTop: 5}}>
              <input type="hidden" name="cmd" value="_donations" />
              <input type="hidden" name="business" value="covaidco@gmail.com" />
              <input type="hidden" name="item_name" value="Provide aid during the COVID-19 pandemic" />
              <input type="hidden" name="currency_code" value="USD" />
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
              <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
            </form> */}
          </Container>
          <Container id="jumboContainer" className="mobile-bulletin-container">
                <Col xs={12} id="mobile-bulletin">
                    <p className='location-text' style={{color: 'black', float: 'left', width: '100%', fontSize: "5vw"}}>
                        See who's helping near {props.state.locality}<br/> 
                    </p>
                    <p className="volunteer-info" style={{color: 'black', float: 'left', fontWeight: 'normal', fontSize: "3vw"}}>
                        Click an offer below for more info
                    </p>
                    <NewOffers volunteers={volunteers} state={props.state} resources={resources}
                                handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
                    {cantFindLink}
                </Col>
            </Container>

            {/* <Modal size={props.state.modalType === 2 ? "lg" : "md"} 
                    show={props.state.showModal} onHide={props.handleHideModal} 
                    style = {{marginTop: 10, paddingBottom: 50}} id="general-modal"> */}
            {getCurrentModal()}
            {/* </Modal> */}

        </div>
    );
}
