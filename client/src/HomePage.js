import React, { useState, useEffect } from "react";
import fetch_a from './util/fetch_auth';
import PropTypes from 'prop-types';
import Cookie from 'js-cookie'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import CitySupport from './components_homepage/CitySupport';
import CommunityBulletin from './components_homepage/CommunityBulletin';
import NewLogin from './components_modals/NewLogin';
import RequestHelp from './request_help/RequestModal';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import GetLocation from './location_tools/GetLocation';
import HelpfulLinks from './components_modals/HelpfulLinks';
import NewLocationSetting from './location_tools/NewLocationSetting';
import { generateURL } from './Helpers';
import { cantFindLink, supportButton, volunteerButton } from './HomePageHelpers'
import './HomePage.css';

/**
 * Main Homepage Component for covaid
 */

export default function HomePage(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({});

    const [mode, setMode] = useState('general');
    const [modalInfo, setModalInfo] = useState({});
    const [volunteers, setVolunteers] = useState([]);
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        // Find 20 nearest volunteers once props are set
        if (props.latitude !== '' && props.longitude !== '' && props.currentAssoc) {
            let params = {'latitude': props.latitude, 'longitude': props.longitude}
            var url = generateURL("/api/users/all?", params);
            fetch(url).then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        const res = data.filter(volunteer => volunteer.offer.tasks.length > 0);
                        setVolunteers(res.slice(0, Math.min(res.length, 20)));
                        setPageLoaded(true);
                    });
                }
            }).catch((e) => {
                alert(e);
            });
        }

        if (Object.keys(currentUser).length === 0 && Cookie.get('token')) {
            fetchUser();
        }
    }, [props.latitude, props.longitude, props.currentAssoc, currentUser]);

    const showModalType = (type) => {
        setModalType(type);
        setShowModal(true);
    }

    const handleHideModal = () => {
        setShowModal(false);
    }

    // Show request modal in either general or bulletin mode
    function updateRequestHelpMode(mode, modalInfo) {
        showModalType('request');
        setMode(mode);
        setModalInfo(modalInfo);
    }

    // Get current user based on token
    const fetchUser = () => {
		fetch_a('token', '/api/users/current')
		.then((response) => response.json())
		.then((user) => {
            setCurrentUser(user);
            setLoggedIn(true);
		}).catch((error) => {
			console.error(error);
		});
	}

    // Find current modal component based on current modal type
    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 'resources') {
            modal = <HelpfulLinks showModal={showModal} hideModal={handleHideModal} currentAssoc={props.currentAssoc}/>;
        } else if (modalType === 'location') {
            modal = <NewLocationSetting locationSubmit={props.onLocationSubmit} refreshLocation={props.refreshLocation}
                                        showModal={showModal} hideModal={handleHideModal}/>
        } else if (modalType === 'location-request') {
            modal = <NewLocationSetting locationSubmit={props.onLocationSubmit} refreshLocation={props.refreshLocation}
                                        showModal={showModal} hideModal={() => {setModalType('request')}}/>
        } else if (modalType === 'signin') {
            modal = <NewLogin showModal={showModal} hideModal={handleHideModal}/>
        } else if (modalType === 'request') {
            modal = <RequestHelp requestHelpMode={mode} showModal={showModal} hideModal={handleHideModal} 
                                 locality={props.locality} zipcode={props.zipcode} volunteer={modalInfo} currentAssoc={props.currentAssoc}
                                 latitude={props.latitude} longitude={props.longitude} showModalType={showModalType}/>
        }
        return modal;
    }

    return ([
        <div key="1" className="App" style={{height: '100%'}}>
            <NavBar pageLoaded={pageLoaded} isLoggedIn={loggedIn} first_name={currentUser.first_name} handleShowModal={showModalType}/>
            <Jumbotron fluid id="jumbo">
                <Container id="jumboContainer">
                    <Row>
                        <Col md={6} id="jumbo-text">
                            <h1 id="home-heading">Mutual aid for COVID&#8209;19</h1>
                            <p id="home-subheading">Covaid connects community volunteers with those who need support</p>
                            {supportButton(props.currentAssoc, updateRequestHelpMode)}{' '}
                            {volunteerButton(loggedIn)}<br/>
                            <Button variant="link" id="underlined-link" onClick={() => showModalType('resources')}>
                                <u>View COVID-19 Resources</u>
                            </Button>
                        </Col>
                        <Col md={6} id="community-bulletin">
                            <p id='location-text'>Volunteers around 
                                <button id="change-location" onClick={() => showModalType('location')}> {props.locality}</button>
                            </p>
                            <p id="volunteer-info">Click an offer below for more info</p>
                            <CommunityBulletin volunteers={volunteers} resources={props.resources} mobile={false}
                                               handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
                            {cantFindLink(props.currentAssoc, updateRequestHelpMode)}
                        </Col>
                    </Row>
                </Container>
            </Jumbotron>
            <GetLocation isLoaded={props.isLoaded} onLocationSubmit={props.onLocationSubmit}/>
            <Container id={loggedIn ? "location-container-logged" : "location-container"}>
                <CitySupport currentAssoc={props.currentAssoc}/>
            </Container>
            <Container id="jumboContainer" className={"mobile-bulletin-container"}>
                <Col xs={12} id="mobile-bulletin">
                    <p id="requestCall" style={{marginTop: 15, marginBottom: 10}}></p>
                    <p id='location-text' style={{color: 'black', float: 'left', width: '100%', fontSize: "5vw"}}>Volunteers around 
                        <button id="change-location" onClick={() => showModalType('location')}> {props.locality}</button>
                    </p>
                    <p id="volunteer-info" style={{color: 'black', float: 'left', width: '100%', fontSize: "3vw"}}>
                        Click an offer below for more info
                    </p>
                    <CommunityBulletin volunteers={volunteers} resources={props.resources} mobile={true}
                                       handleShowRequestHelp={(modalInfo) => updateRequestHelpMode('bulletin', modalInfo)}/>
                    {cantFindLink(props.currentAssoc, updateRequestHelpMode)}
                </Col>
            </Container>
            {getCurrentModal()}
        </div>,
        <Footer key="2"/>
    ]);
}

HomePage.propTypes = {
    refreshLocation: PropTypes.func,
    onLocationSubmit: PropTypes.func,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    neighborhoods: PropTypes.arrayOf(PropTypes.string),
    locality: PropTypes.string,
    zipcode: PropTypes.string,
    currentAssoc: PropTypes.object,
    isLoaded: PropTypes.bool,
    resources: PropTypes.arrayOf(PropTypes.string)
};