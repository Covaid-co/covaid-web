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

import PendingVolunteerRequests from './PendingVolunteerRequests';
import InProgressVolunteerRequests from './InProgressVolunteerRequests';
import AboutUs from './components_modals/AboutUs'
import HowItWorks from './components_modals/HowItWorks'
import Feedback from './components_modals/Feedback'
import { generateURL } from './Helpers';
import CovaidNavbar from './CovaidNavbar'
import './VolunteerPage.css'
import fetch_a from './util/fetch_auth'


export default function VolunteerPortal(props) {

	const [tabNum, setTabNum] = useState(1);
	const [user, setUser] = useState({});
	const [foundUser, setFoundUser] = useState(false);
	const [pendingRequests, setPendingRequests] = useState([]);
	const [acceptedRequests, setAcceptedRequests] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState(0);
	const { addToast } = useToasts();

	const fetchPendingRequests = (id) => {
        // let params = {'volunteerID': id}
		// var url = generateURL( "/api/request/allPendingRequestsInVolunteer?", params);
        // fetch(url, {
        //     method: 'get',
        //     headers: {'Content-Type': 'application/json'},
        // }).then((response) => {
        //     if (response.ok) {
        //         response.json().then(data => {
		// 			setPendingRequests(data)
        //         });
        //     } else {
        //         console.log("Error");
        //     }
        // }).catch((e) => {
        //     console.log(e)
        // });
	  }

	const fetchAcceptedRequests = (id) => {
        // let params = {'volunteerID': id}
		// var url = generateURL( "/api/request/allAcceptedRequestsInVolunteer?", params);
        // fetch(url, {
        //     method: 'get',
        //     headers: {'Content-Type': 'application/json'},
        // }).then((response) => {
        //     if (response.ok) {
        //         response.json().then(data => {
		// 			setAcceptedRequests(data)
        //         });
        //     } else {
        //         console.log("Error")
        //     }
        // }).catch((e) => {
        //     console.log(e)
        // });
	}

	const fetchUser = () => {
		fetch_a('token', '/api/users/current')
			.then((response) => response.json())
			.then((user) => {
				console.log(user)
				setUser(user)
				setFoundUser(true)

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
		})
		.catch((error) => {
			console.error(error);
		});
	}

	const returnToHome = () => {
		window.open(window.location.protocol + '//' + window.location.host, '_self');
	}

	const moveRequestFromPendingToInProgress = (request) => {
		setPendingRequests(pendingRequests.filter(pendingRequest => pendingRequest._id !== request._id));
		setAcceptedRequests(acceptedRequests.concat(request))
		setTabNum(3)
	}
	const rejectAPendingRequest = (request) => {
		setPendingRequests(pendingRequests.filter(pendingRequest => pendingRequest._id !== request._id));
	}

	const completeAnInProgressRequest = (request) => {
		setAcceptedRequests(acceptedRequests.filter(acceptedRequest => acceptedRequest._id !== request._id))
		setTabNum(1)
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
	
	if (!foundUser) {
		return <></>
	}
	
	return (
		<> 
			<CovaidNavbar isLoggedIn={true} first_name={user.personal_info.first_name} handleShowModal={handleShowModal}/>
			<Jumbotron fluid id="jumbo-volunteer">
				<Container style={{maxWidth: 1500}}>
					<Row>
						<Col lg={2} md={1} sm={0}></Col>
						<Col>
							<h1 id="home-heading" style={{marginTop: 0}}>Welcome back, {user.personal_info.first_name}!</h1>
							<p id="regular-text">This is your volunteer portal, a place for you to manage your offer and handle requests</p>
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<Container id="volunteer-info">
				<Row className="justify-content-md-center">
					<Col lg={1}></Col>
					<Col lg={6} md={8} sm={10}>
						<Container style={{padding: 0, marginLeft: 0}}> 
							<Button id={tabNum===1 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(1)}}>
								Your Offer
							</Button>
							<Button id={tabNum===2 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(2)}}>
								Pending ({pendingRequests.length})
								{/* <div className={"request-count request-pending-count"}>{pendingRequests.length}</div> */}
							</Button>
							<Button id={tabNum===3 ? "tab-button-selected" : "tab-button"} onClick={() => {setTabNum(3)}}>
								Active ({acceptedRequests.length})
								{/* <div className={"request-count request-active-count"}>{acceptedRequests.length}</div> */}
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
								moveRequestFromPendingToInProgress={moveRequestFromPendingToInProgress} 
								rejectAPendingRequest={rejectAPendingRequest} />
						</Container>
						<Container id="newOfferContainer"
							style={tabNum===3 ? {'display': 'block'} : {'display': 'none'}}>
							<InProgressVolunteerRequests 
								user={user} 
								acceptedRequests={acceptedRequests} 
								completeAnInProgressRequest={completeAnInProgressRequest}/>
						</Container>
					</Col>
					<Col lg={4} md={8} sm={10}>
						<Container id="newOfferContainer"
							style={{'display': 'block', marginTop: 41}}>
							{foundUser ? <AccountInfo user={user}/> : <></>}
						</Container>
					</Col>
					<Col lg={1}></Col>
				</Row>
			</Container>
			{getCurrentModal()}
		</>
	);
}
