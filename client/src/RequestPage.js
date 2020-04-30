import React, { useState, useEffect } from "react";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import NewLocationSetting from './location_tools/NewLocationSetting';
import GetLocation from './components_homepage/GetLocation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import RequestPage1 from './RequestPage1';
import RequestPage2 from './RequestPage2';
import PittHeader from './association_request_headers/PittHeader';
import DefaultHeader from './association_request_headers/DefaultHeader';


export default function RequestPage(props) {

    const [showModal, setShowModal] = useState(false);
    const [firstPage, setFirstPage] = useState({});
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setShowModal(false);
        console.log(props.locationProps)
    }, [props.locationProps]);
    
    const requestFormInfo = () => {
        var topHeader = <DefaultHeader/>;
        if (props.org === 'pitt') {
            topHeader = <PittHeader/>;
        }
        return (
            <>
                {topHeader}
                <p id='regular-text' style={{marginBottom: 0}}>Current Location: 
                    <button id="change-location" onClick={() => setShowModal(true)}> 
                        {props.locationProps.locality + ', ' + props.locationProps.zipcode} 
                        <FontAwesomeIcon style={{color: "red", marginLeft: 5}} icon={faMapMarkerAlt}/> 
                    </button>
                </p>
            </>
        )
    }

    const handleSubmit = (secondPage) => {
        let form = {
            'requester_first': firstPage.name,
            'requester_phone': firstPage.phone,
            'requester_email': firstPage.email,
            'details': secondPage.details,
            'payment': secondPage.payment,
            'resource_request': firstPage.resources,
            'languages': secondPage.languages,
            'association': props.locationProps.currentAssoc._id,
            'time': secondPage.time,
            'date': secondPage.date,
            'latitude': props.locationProps.latitude,
            'longitude': props.locationProps.longitude,
            'status': "pending"
        };

        fetch('/api/request/create_request', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Request successfully created");
                setCompleted(true);
            } else {
                console.log("Request not successful")
            }
        })
        .catch((e) => {
            console.log(e);
        });
    }

    if (completed) {
        return ([
            <div className="App" key="1">
                <NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
                <Container style={{maxWidth: 1500}}>
                    <Row>
                        <Col lg={3} md={2} sm={0}>
                        </Col>
                        <Col lg={6} md={8} sm={12}>
                            <Container id="newOfferContainer" style={{marginBottom: 0}}>
                                <p id="regular-text" style={{marginBottom: 5}}>
                                    Your request has been saved and you should receive an email soon 
                                    from a matched volunteer who can support you!
                                </p>
                            </Container>
                        </Col>
                        <Col lg={3} md={2} sm={0}>
                        </Col>
                    </Row>
                </Container>
            </div>,
            <Footer key="2"/>
        ]);
    }

	return ([
		<div className="App" key="1">
			<NavBar isLoggedIn={false} totalVolunteers={0} orgPortal={true}/>
            <Container style={{maxWidth: 1500}}>
                <Row>
                    <Col lg={2} md={2} sm={0}>
                    </Col>
                    <Col lg={8} md={8} sm={12}>
                        <Container id="newOfferContainer" style={{marginBottom: 15}}>
                            {requestFormInfo()}
                        </Container>
                    </Col>
                    <Col lg={3} md={2} sm={0}>
                    </Col>
                </Row>
                <Row>
                    <Col lg={3} md={2} sm={0}>
                    </Col>
                    <Col lg={6} md={8} sm={12}>
                        <Container id="newOfferContainer" style={{marginBottom: 0}}>
                            {Object.keys(firstPage).length === 0 ?
                                <RequestPage1 setFirstPage={setFirstPage} currentAssoc={props.locationProps.currentAssoc}/> :
                                <RequestPage2 currentAssoc={props.locationProps.currentAssoc} handleSubmit={handleSubmit}/>
                            }
                        </Container>
                    </Col>
                    <Col lg={3} md={2} sm={0}>
                    </Col>
                </Row>
            </Container>
            <NewLocationSetting locationSubmit={props.onLocationSubmit}
                                refreshLocation={props.refreshLocation}
                                showModal={showModal} 
                                hideModal={() => setShowModal(false)}/>
            <GetLocation isLoaded={props.isLoaded} onLocationSubmit={props.onLocationSubmit}/>
		</div>,
		<Footer key="2"/>]
	);
}
