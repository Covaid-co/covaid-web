import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Geocode from "react-geocode";

import { findAssociations, getMyLocation, setNeighborhood, setLatLongCookie } from './location_tools/LocationHelpers'
import NewLocationSetting from './location_tools/NewLocationSetting';
import GetLocation from './components_homepage/GetLocation';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { removeCookies } from './Helpers';
import { cookieNames } from './constants';
import RequestPage1 from './RequestPage1';
import RequestPage2 from './RequestPage2';
import { generateURL } from './Helpers'


export default function RequestPage(props) {

    const [showModal, setShowModal] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [associations, setAssociations] = useState([]);
    const [currentAssoc, setCurrentAssoc] = useState({});
    const [firstPage, setFirstPage] = useState({});
    const [locality, setLocality] = useState('');
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        setLocationState();
    }, []);

    const setLocationState = () => {
        getMyLocation().then((stateObj) => {
            const lat = stateObj['latitude'];
            const long = stateObj['longitude'];
            setLatitude(lat);
            setLongitude(long);
            setIsLoaded(true);
            setShowModal(false);

            if (!('neighborhoods' in stateObj)) {
				setNeighborhood(lat, long).then((neighborObj) => {
					setLocality(neighborObj['locality']);
				})
            } else {
                setLocality(stateObj['locality']);
            }

            if (props.org === 'pitt') {
                let params = {'associationID': '5e843ab29ad8d24834c8edbf'}
                var url = generateURL("/api/association/get_assoc/?", params);
                fetch(url).then((response) => {
                    if (response.ok) {
                        response.json().then(association => {
                            setCurrentAssoc(association);
                        });
                    }
                }).catch((e) => {
                    alert('Seems to be server issues. Please try again later.');
                });
            } else {
                findAssociations(lat, long).then((associations) => {
                    setAssociations(associations);
                    if (associations.length > 0) {
                        setCurrentAssoc(associations[0]);
                    }
                });
            }
		});
    }

    const onLocationSubmit = (e, locationString) => {
		e.preventDefault();
		e.stopPropagation();
		return Geocode.fromAddress(locationString).then(
			response => {
				const { lat, lng } = response.results[0].geometry.location;

				removeCookies(cookieNames);
				setLatLongCookie(lat, lng);
				setIsLoaded(true);

				setNeighborhood(lat, lng).then((neighborObj) => {
					setLocality(neighborObj['locality']);
					findAssociations(lat, lng).then((associations) => {
                        setAssociations(associations);
                        if (associations.length > 0) {
                            setCurrentAssoc(associations[0]);
                        }
                    });
				});
				return true;
			}, () => {
				return false;
			}
		);
    }
    
    const refreshLocation = () => {
		removeCookies(cookieNames);
		setIsLoaded(false);
		setLocationState();
    }

    const foundPhoneNumber = () => {
        var res = '(401) 526-8243';
        if (currentAssoc.name === "Pittsburgh Mutual Aid") {
            res = '(412) 301-6127';
        }
        return res;
    }
    
    const requestFormInfo = () => {
        if (props.org === 'pitt') {
            return (
                <>
                    <h1 id="small-header">Pittsburgh Mutual Aid Form</h1>
                    <p id="regular-text">
                        If you need support or have resources to offer as we navigate the COVID-19 crisis as a community, 
                        please use this form. Your responses to this form will only be seen by a team of volunteers working 
                        to match resources with needs. You can find more public resources at <a href="www.pittsburghmutualaid.com" target="_blank">www.pittsburghmutualaid.com</a>.
                    </p>
                    <p id="regular-text">
                        We are prioritizing folks who are sick, disabled, quarantined without pay, elderly, undocumented, 
                        queer, Black, Indigenous, and/or people of color -- including those displaced from Pittsburgh to the nearby areas. 
                    </p>
                    <p id="regular-text">
                        This form is being managed by a group of all-volunteer Pittsburgh community members involved in local organizing efforts. 
                        Thank you for your patience and grace. 
                    </p>
                    <p id="regular-text">
                        If you have questions or need help filling out this form, please contact the moderators:<br/>
                        --> Gabriel M, g.mcmorland@gmail.com <br/>
                        --> Madeline P, madelinejaneee@gmail.com
                    </p>
                    <p id="regular-text">
                        Let’s take care of each other. By us for us. <br/>
                        Vamos a cuidarnos unes a otres. Por nosotres, para nosotres. 
                    </p>
                    <p id="request-calling" style={{borderBottom: '0px solid', marginBottom: 0}}> For those who would rather call in a request, 
                        please call <br /><span id="phoneNumber">{foundPhoneNumber()}</span></p>
                </>
            )
        }
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
            'association': currentAssoc._id,
            'time': secondPage.time,
            'date': secondPage.date,
            'latitude': latitude,
            'longitude': longitude,
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
                                <RequestPage1 setFirstPage={setFirstPage} currentAssoc={currentAssoc}/> :
                                <RequestPage2 currentAssoc={currentAssoc} handleSubmit={handleSubmit}/>
                            }
                        </Container>
                    </Col>
                    <Col lg={3} md={2} sm={0}>
                    </Col>
                </Row>
            </Container>
            <NewLocationSetting locationSubmit={onLocationSubmit}
                                refreshLocation={refreshLocation}
                                showModal={showModal} 
                                hideModal={() => setShowModal(false)}/>
            <GetLocation isLoaded={isLoaded} onLocationSubmit={onLocationSubmit}/>
		</div>,
		<Footer key="2"/>]
	);
}
