import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import NewLocationSetting from '../location_tools/NewLocationSetting';
import GetLocation from '../location_tools/GetLocation';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import RequestPage1 from './RequestPage1';
import RequestPage2 from './RequestPage2';
import OrgHeader from '../association_request_headers/OrgHeader';
import DefaultHeader from '../association_request_headers/DefaultHeader';
import CurrentLocation from '../location_tools/CurrentLocation';
import { generalRequestText } from '../constants';
import {translations} from '../translations/translations';
import LocalizedStrings from 'react-localization';
 

/**
 * Request Support Main Page
 */

let translatedStrings = new LocalizedStrings({translations});

export default function RequestPage(props) {
    const [showModal, setShowModal] = useState(false);
    const [firstPage, setFirstPage] = useState({});
    const [completed, setCompleted] = useState(false);
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        setShowModal(false);
    }, [props.locationProps]);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    }

    const requestFormInfo = () => {
        var topHeader = <DefaultHeader requestHeaderText={generalRequestText} translations={translatedStrings} language={language} changeLanguage={changeLanguage}/>;
        if (props.locationProps.currentAssoc && Object.keys(props.locationProps.currentAssoc).length > 0) {
            topHeader = <OrgHeader assoc={props.locationProps.currentAssoc} translations={translatedStrings} language={language} changeLanguage={changeLanguage} />;
        }
        return (
            <>
                {topHeader}
                <CurrentLocation locationProps={props.locationProps} translations={translatedStrings} language={language} showModal={() => setShowModal(true)}/>
            </>
        )
    }

    var assoc_id = (props.locationProps.currentAssoc && props.locationProps.currentAssoc._id && props.locationProps.currentAssoc._id.length > 0) 
                        ? props.locationProps.currentAssoc._id : "5e88cf8a6ea53ef574d1b80c";

    const handleSubmit = (secondPage) => {
        let form = {
            request: {
                personal_info: {
                    'requester_name': firstPage.name,
                    'requester_phone': firstPage.phone,
                    'requester_email': firstPage.email,
                    'languages': secondPage.languages,
                },
                request_info: {
                    'resource_request': firstPage.resources,
                    'details': secondPage.details,
                    'payment': secondPage.payment,
                    'time': secondPage.time,
                    'date': secondPage.date,
                },
                location_info: {
                    'type': 'Point',
                    'coordinates': [props.locationProps.longitude, props.locationProps.latitude]
                },
                association: assoc_id,
                status: {
                    volunteer: props.volunteer
                }
            }
        };

        fetch('/api/request/create_request', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("Request successfully created");
                setCompleted(true);
            } else {
                console.log("Request not successful")
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    if (completed) {
        return ([
            <div className="App" key="1">
                <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
                <Container style={{maxWidth: 1500}}>
                    <Row>
                        <Col lg={3} md={2} sm={0}></Col>
                        <Col lg={6} md={8} sm={12}>
                            <Container id="newOfferContainer" style={{marginBottom: 0}}>
                                <h1 id="small-header">{translatedStrings[language].ReceivedYourRequest}</h1>
                                <p id="regular-text" style={{marginBottom: 5}}>
                                    {translatedStrings[language].VolunteerReachOutSoon}
                                </p>
                            </Container>
                        </Col>
                        <Col lg={3} md={2} sm={0}></Col>
                    </Row>
                </Container>
            </div>,
            <Footer key="2"/>
        ]);
    }

	return ([
		<div className="App" key="1">
			<NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
            <Container style={{maxWidth: 2500}}>
                <Row>
                    <Col lg={3} md={2} sm={0}></Col>
                    <Col lg={6} md={8} sm={12}>
                        <Container id="newOfferContainer" style={{marginBottom: 15}}>
                            {requestFormInfo()}
                        </Container>
                    </Col>
                    <Col lg={3} md={2} sm={0}></Col>
                </Row>
                <Row>
                    <Col lg={3} md={2} sm={0}></Col>
                    <Col lg={6} md={8} sm={12}>
                        <Container id="newOfferContainer" style={{marginBottom: 0}}>
                            {Object.keys(firstPage).length === 0 ?
                                <RequestPage1 setFirstPage={setFirstPage} currentAssoc={props.locationProps.currentAssoc} translations={translatedStrings} language={language}/> :
                                <RequestPage2 currentAssoc={props.locationProps.currentAssoc} handleSubmit={handleSubmit} translations={translatedStrings} language={language}/>}
                        </Container>
                    </Col>
                    <Col lg={3} md={2} sm={0}></Col>
                </Row>
            </Container>
            <NewLocationSetting locationSubmit={props.onLocationSubmit} refreshLocation={props.refreshLocation}
                                showModal={showModal} hideModal={() => setShowModal(false)}/>
            <GetLocation isLoaded={props.isLoaded} onLocationSubmit={props.onLocationSubmit}/>
		</div>,
		<Footer key="2"/>]
	);
}

RequestPage.propTypes = {
    locationProps: PropTypes.shape({
        currentAssoc: PropTypes.object,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        zipcode: PropTypes.string,
        locality: PropTypes.string
    })
};