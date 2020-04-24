import React, { useState, useEffect } from "react";
import Pusher from 'pusher-js';
import { useToasts } from 'react-toast-notifications'
import AccountInfo from './components_volunteerpage/AccountInfo'
import YourOffer from './components_volunteerpage/YourOffer'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import PendingVolunteerRequests from './components_volunteerpage/PendingVolunteerRequests';
import CompletedVolunteerRequests from './components_volunteerpage/CompletedVolunteerRequests';
import AboutUs from './components_modals/AboutUs'
import HowItWorks from './components_modals/HowItWorks'
import Feedback from './components_modals/Feedback'
import { generateURL } from './Helpers';
import CovaidNavbar from './CovaidNavbar'
import VolunteerLogin from './components_volunteerpage/VolunteerLogin'
import VolunteerBeacons from './components_volunteerpage/VolunteerBeacons'
import './VolunteerPage.css'
import fetch_a from './util/fetch_auth'
import Footer from './components/Footer'

import {UserType} from './constants'


export default function VolunteerPortal(props) {

	const [tabNum, setTabNum] = useState(1);
	const [user, setUser] = useState({});
	const [foundUser, setFoundUser] = useState(false);
	const [pendingRequests, setPendingRequests] = useState([]);
	const [acceptedRequests, setAcceptedRequests] = useState([]);
	const [completedRequests, setCompletedRequests] = useState([]);
	const [beacons, setBeacons] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState(0);
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const { addToast } = useToasts();

	const fetchPendingRequests = (id) => {
        let params = {'volunteerID': id}
		var url = generateURL( "/api/request/allPendingRequestsInVolunteer?", params);
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
					setPendingRequests(data)
                });
            } else {
                console.log("Error");
            }
        }).catch((e) => {
            console.log(e)
        });
	  }

	const fetchAcceptedRequests = (id) => {
        let params = {'volunteerID': id}
		var url = generateURL( "/api/request/allAcceptedRequestsInVolunteer?", params);
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
					setAcceptedRequests(data)
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
	}

	const fetchCompletedRequests = (id) => {
		let params = {'volunteerID': id}
		var url = generateURL( "/api/request/allCompletedRequestsInVolunteer?", params);
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
					setCompletedRequests(data)
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
	}

	const fetchBeacons = () => {
		fetch_a('token', '/api/beacon/user', {
            method: 'get',
        }).then((response) => {
			if (response.ok) {
				response.json().then(data => {
					setBeacons(data);
				});
			} else {
				console.log("Error");
			}
		}).catch((e) => {
			console.log(e);
		});
	}

	const fetchUser = () => {
		fetch_a('token', '/api/users/current')
			.then((response) => response.json())
			.then((user) => {
				setUser(user);
				setFoundUser(true);

				var pusher = new Pusher('ed72954a8d404950e3c8', {
					cluster: 'us2',
					forceTLS: true
				});
			  
				var channel = pusher.subscribe(user._id);
				channel.bind('direct-match', function(data) {
					fetchPendingRequests(user._id);
					addToast('You have a new pending request!',
						{
							appearance: 'info',
							autoDismiss: true
						}
					)
				});
				fetchPendingRequests(user._id);
				fetchAcceptedRequests(user._id);
				fetchCompletedRequests(user._id);
				fetchBeacons();
		})
		.catch((error) => {
			setLoginError(true);
		});
	}

	const moveRequestFromPendingToInProgress = (request) => {
		setPendingRequests(pendingRequests.filter(pendingRequest => pendingRequest._id !== request._id));
		setAcceptedRequests(acceptedRequests.concat(request))
	}
	const rejectAPendingRequest = (request) => {
		setPendingRequests(pendingRequests.filter(pendingRequest => pendingRequest._id !== request._id));
		setAcceptedRequests(acceptedRequests.filter(acceptedRequest => acceptedRequest._id !== request._id));
	}

	const completeAnInProgressRequest = (request) => {
		request.completed_date = Date.now()
		setAcceptedRequests(acceptedRequests.filter(acceptedRequest => acceptedRequest._id !== request._id))
		setCompletedRequests(completedRequests.concat(request))
		setTabNum(3);
	}

	useEffect(() => {
		fetchUser();
	}, []);

	const handleShowModal = (type) => {
		setModalType(type);
		setShowModal(true);
	}

    const getCurrentModal = () => {
        var modal = <></>;
        if (modalType === 1) {
            modal = <AboutUs showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if (modalType === 2) {
            modal = <HowItWorks showModal={showModal} hideModal={() => setShowModal(false)}/>;
        } else if  (modalType === 4) {
            modal = <Feedback showModal={showModal} hideModal={() => setShowModal(false)}/>;
        }
        return modal;
	}

	if (foundUser) {

		return (<>
			<div className="App">
				<CovaidNavbar isLoggedIn={true} first_name={user.first_name} handleShowModal={handleShowModal}/>
				<div id="bgImage"></div>
				<Jumbotron fluid id="jumbo-volunteer">
					<Container style={{maxWidth: 1500}}>
						<Row>
							<Col lg={1} md={1} sm={0}></Col>
							<Col>
								<h1 id="home-heading" style={{marginTop: 0}}>Welcome back, {user.first_name}!</h1>
								<p id="regular-text" style={{fontSize: 20}} >This is your volunteer portal, a place for you to manage your offer and handle requests</p>
								<Button id="medium-button" onClick={()=>{setShowAccountModal(true)}}>
									View Profile Information
								</Button>{' '}
							</Col>
						</Row>
					</Container>
				</Jumbotron>
				<Container id="volunteer-info">
					<Row lg={1}></Row>
					<Row className="justify-content-md-center">
						<Col lg={1}></Col>
						<Col lg={6} md={8} sm={10} style={{marginTop: -44}}>
							<Container style={{padding: 0, marginLeft: 0}}> 
								<Button id={tabNum===1 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(1)}}>
									Your Offer
								</Button>
								<Button id={tabNum===2 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(2)}}>
									Pending ({pendingRequests.length}) / Active ({acceptedRequests.length})
								</Button>
								<Button id={tabNum===3 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(3)}}>
									Completed ({completedRequests.length})
								</Button>
							</Container>
							<Container id="newOfferContainer"
								style={tabNum===1 ? {'display': 'block'} : {'display': 'none'}}>
								{foundUser ? <YourOffer user={user} /> : <></>}
							</Container>
							<Container id="newOfferContainer"
								style={tabNum===2 ? {'display': 'block'} : {'display': 'none'}}>
								<PendingVolunteerRequests user={user} 
									pendingRequests={pendingRequests}
									acceptedRequests={acceptedRequests} 
									moveRequestFromPendingToInProgress={moveRequestFromPendingToInProgress} 
									rejectAPendingRequest={rejectAPendingRequest} 
									completeAnInProgressRequest={completeAnInProgressRequest} />
							</Container>
							<Container id="newOfferContainer"
								style={tabNum===3 ? {'display': 'block'} : {'display': 'none'}}>
								<CompletedVolunteerRequests user={user} 
									completedRequests={completedRequests} />
							</Container>
						</Col>
						<Col lg={4} md={8} sm={10} style={{marginTop: -28}}>
							<h5 id="volunteer-offer-status" style={{fontSize: 24, fontWeight: "bold", color: "black"}}>Organization Beacons</h5>
							<Container id="newOfferContainer"
								style={{'display': 'block', marginTop: 10}}>
								<VolunteerBeacons beacons={beacons} volunteer={user} fetchBeacons={fetchBeacons}/>
							</Container>
						</Col>
						<Col lg={1}></Col>
					</Row>
				</Container>
				{getCurrentModal()}
			</div>
			<Footer key="2" handleShowModal={handleShowModal}/>
			<AccountInfo user={user} showAccountModal={showAccountModal} setShowAccountModal={setShowAccountModal} />
			</>
		);
	} else if (loginError)  {
		return <VolunteerLogin />;
	} else {
		return <></>;
	}
}
