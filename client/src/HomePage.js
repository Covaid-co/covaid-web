import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import CitySupport from './components_homepage/CitySupport';
import NewOffers from './NewOffers';
import NewRegister from './NewRegister';
import NewLogin from './NewLogin';
import RequestHelp from './RequestHelp';
import GetLocation from './GetLocation';
import AboutUs from './components_modals/AboutUs'
import HowItWorks from './components_modals/HowItWorks'
import HelpfulLinks from './components_modals/HelpfulLinks';
import Feedback from './components_modals/Feedback'
import NewLocationSetting from './location_tools/NewLocationSetting';
import { generateURL } from './Helpers'
import { defaultResources } from './constants'
import './HomePage.css';

export default function HomePage(props) {

    const [mode, setMode] = useState('');
    const [modalInfo, setModalInfo] = useState({});
    const [volunteers, setVolunteers] = useState([]);
    const [resources, setResources] = useState([]);

    var rad = function(x) {
        return x * Math.PI / 180;
    };

    function calcDistance(latA, longA, latB, longB) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(latB - latA);
        var dLong = rad(longB - longA);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(latA)) * Math.cos(rad(latB)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    }

    useEffect(() => {
        let params = {'latitude': props.state.latitude, 'longitude': props.state.longitude, 'radius': 20, limit: 20}
        var url = generateURL("/api/users/byLocation?", params);
        async function fetchData() {
            const response = await fetch(url);
            console.log("HELLO")
            response.json().then((users) => {
                console.log(users)
                for (var i = 0; i < users.length; i++) {
                    const coords = users[i].location_info.location.coordinates;
                    const distance = calcDistance(props.state.latitude, props.state.longitude, coords[0], coords[1]);
                    users[i]['distance'] = distance;
                }
                users.sort(function(a, b){return a['distance'] - b['distance']});
                setVolunteers(users);
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
        props.handleShowModal(8);
        setMode(mode);
        setModalInfo(modalInfo);
    }

    const supportButton = () => {
        var helpButton = <Button onClick={() => updateRequestHelpMode('general')} id="request-button" >
                            Request support
                        </Button>
        if (props.state.currentAssoc.name === "Baltimore Mutual Aid") {
            helpButton = <></>;
        }
        return helpButton;
    }

    const volunteerButton = () => {
        var volButton = <Button onClick={props.setVolunteerPortal} id="request-button">
                            Volunteer portal
                        </Button>
        if (!props.state.isLoggedIn) {
            volButton = <></>;
        }
        return volButton;
    }

    const getCurrentModal = () => {
        var modal = <></>;
        if (props.state.modalType === 1) {
            modal = <AboutUs showModal={props.state.showModal} hideModal={props.handleHideModal}/>;
        } else if (props.state.modalType === 2) {
            modal = <HowItWorks showModal={props.state.showModal} hideModal={props.handleHideModal}/>;
        } else if  (props.state.modalType === 3) {
            modal = <HelpfulLinks showModal={props.state.showModal} 
                                  hideModal={props.handleHideModal}
                                  associationCity={props.state.currentAssoc.city}
                                  associationLinks={props.state.currentAssoc.links}/>;
        } else if  (props.state.modalType === 4) {
            modal = <Feedback showModal={props.state.showModal} hideModal={props.handleHideModal}/>;
        } else if (props.state.modalType === 5) {
            modal = <NewLocationSetting locationSubmit={props.onLocationSubmit}
                                        refreshLocation={props.refreshLocation}
                                        showModal={props.state.showModal} 
                                        hideModal={props.handleHideModal}/>
        } else if (props.state.modalType === 6) {
            modal = <NewLogin showModal={props.state.showModal} hideModal={props.handleHideModal}/>
        } else if (props.state.modalType === 7) {
            modal = <NewRegister showModal={props.state.showModal} 
                                 hideModal={props.handleHideModal}
                                 state={props.state}
                                 setState={props.setState}/>
        } else if (props.state.modalType === 8) {
            modal = <RequestHelp requestHelpMode={mode} 
                                 showModal={props.state.showModal} 
                                 hideModal={props.handleHideModal}
                                 state={props.state} 
                                 volunteer={modalInfo}/>
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
                            {volunteerButton()}
                            <br />
                            <Button variant="link" id="underlined-link" onClick={() => props.handleShowModal(3)}>
                                <u>View COVID-19 Resources</u>
                            </Button>
                        </Col>
                        <Col md={6} id="community-bulletin">
                            <p id='location-text'>Volunteers around 
                                <button id="change-location" onClick={() => props.handleShowModal(5)}> {props.state.locality}</button>
                            </p>
                            <p id="volunteer-info">Click an offer below for more info</p>
                            <NewOffers volunteers={volunteers} state={props.state} resources={resources} mobile={false}
                                        handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
                            {cantFindLink}
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
            <GetLocation state={props.state}
                        onLocationSubmit={props.onLocationSubmit}
                        hideModal={props.handleHideModal}/>
            <Container id="location-container">
                <CitySupport state={props.state} associations={props.state.associations}/>
            </Container>
            <Container id="jumboContainer" className={props.state.isLoggedIn ? "mobile-loggged-container" : "mobile-bulletin-container"}>
                    <Col lg={12} md={12}>
                        <p id="requestCall" style={{marginTop: 20, marginBottom: 20}}></p>
                    </Col>
                <Col xs={12} id="mobile-bulletin">
                    <p id='location-text' style={{color: 'black', float: 'left', width: '100%', fontSize: "5vw"}}>Volunteers around 
                        <button id="change-location" onClick={() => props.handleShowModal(5)}> {props.state.locality}</button>
                    </p>
                    <p id="volunteer-info" style={{color: 'black', float: 'left', width: '100%', fontSize: "3vw"}}>
                        Click an offer below for more info
                    </p>
                    <NewOffers volunteers={volunteers} state={props.state} resources={resources} mobile={true}
                                handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
                    {cantFindLink}
                </Col>
            </Container>
            {getCurrentModal()}
        </div>
    );
}
