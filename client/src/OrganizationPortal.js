import React, { useState, useEffect } from "react";
import Pusher from 'pusher-js';
import { useToasts } from 'react-toast-notifications'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import UnmatchedRequests from './UnmatchedRequests'
import OrgLogin from './OrgLogin'
import Cookie from 'js-cookie'
import CovaidNavbar from './CovaidNavbar'

import RequestDetails from './components_orgpage/RequestDetails';
import VolunteerDetails from './components_orgpage/VolunteerDetails';
import NewMap from './components_orgpage/NewMap'
import VolunteersModal from './components_orgpage/VolunteersModal';
import AdminModal from './components_orgpage/AdminModal';
import OrgResourcesModal from './OrgResourcesModal';
import { sortFn } from './OrganizationHelpers'
import { generateURL } from './Helpers'
import './OrganizationPage.css'

import fetch_a from './util/fetch_auth';

export default function OrganiationPortal() {

	const { addToast } = useToasts()
	const [currTabNumber, setCurrTab] = useState(1); 
	const [showLogin, setShowLogin] = useState(false); 
	const [association, setAssociation] = useState({});
	const [volunteers, setVolunteers] = useState([]);
	const [volunteersModal, setVolunteersModal] = useState(false);
	const [adminModal, setAdminModal] = useState(false);
	const [resourceModal, setResourceModal] = useState(false);
	const [allRequests, setAllRequests] = useState([]);
	const [unmatched, setUnmatched] = useState([]);
	const [matched, setMatched] = useState([]);
	const [completed, setCompleted] = useState([]);
	const [requesterMap, setRequesterMap] = useState(true);
	const [volunteerMap, setVolunteerMap] = useState(false);
	const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
	const [requestDetailsModal, setRequestDetailsModal] = useState(false);
	const [currVolunteer, setCurrVolunteer] = useState({});
	const [currRequest, setCurrRequest] = useState({});

	const fetch_requests = (id) => {
			let params = {'association': id}
			var url = generateURL( "/api/request/allRequestsInAssoc?", params);

			// Get all request types for an association
			fetch(url, {
				method: 'get',
				headers: {'Content-Type': 'application/json'},
			}).then((response) => {
				if (response.ok) {
					response.json().then(data => {
						setAllRequests(data);
						var unMatchedArr = [];
						var matchedArr = [];
						var completedArr = [];
						for (var i = 0; i < data.length; i++) {
							if (data[i].status) {
								if (data[i].status.current_status === 'in_progress') {
									matchedArr.push(data[i]);
								} else if (data[i].status.current_status === 'incomplete' || data[i].status.current_status === 'pending') {
									unMatchedArr.push(data[i]);
								} else {
									completedArr.push(data[i]);
								}
							} else {
								unMatchedArr.push(data[i]);
							}
						}
						setUnmatched(unMatchedArr);
						setMatched(matchedArr);
						setCompleted(completedArr);
					});
				} else {
					console.log("Error");
				}
			}).catch((e) => {
				console.log(e);
			});

	}

	function login() {
		// Get association from login
		fetch_a('org_token', '/api/association/current')
			.then((response) => response.json())
			.then((association_response) => {
				setAssociation(association_response);
				console.log(association_response);
				var pusher = new Pusher('ed72954a8d404950e3c8', {
					cluster: 'us2',
					forceTLS: true
				  });
				var channel = pusher.subscribe(association_response._id);
				channel.bind('general', function(data) {
					fetch_requests(association_response._id)
					addToast(data,
						{
							appearance: 'info',
							autoDismiss: true
						}
					)
				});
				channel.bind('complete', function(data) {
					fetch_requests(association_response._id)
					addToast("Someone completed a request!",
						{
							appearance: 'success',
							autoDismiss: true
						}
					)
				});

				// All requests for an association
				fetch_requests(association_response._id);
				
				// Get all volunteers for an association
				let params = {'association': association_response._id}
				var url = generateURL("/api/users/allFromAssoc?", params);
				fetch(url, {
					method: 'get',
					headers: {'Content-Type': 'application/json'},
				}).then((response) => {
					if (response.ok) {
						response.json().then(data => {
							var resVolunteer = data.map((volunteer) => {
								volunteer.latitude = volunteer.latlong[1];
								volunteer.longitude = volunteer.latlong[0];
								return volunteer;
							});
							resVolunteer.sort(function(a, b) {
								const x = String(a.first_name.toLowerCase())
            					const y = String(b.first_name.toLowerCase())
								return sortFn(x, y, false);
							});
							setVolunteers(resVolunteer);
						});
					} else {
						console.log(response);
					}
				}).catch((e) => {
					console.log(e);
				});
			}).catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		if (Cookie.get("org_token")) {
			login();
		} else {
			setShowLogin(true);
			var pusher = new Pusher('ed72954a8d404950e3c8', {
				cluster: 'us2',
				forceTLS: true
			  });
			var channel = pusher.subscribe(association._id ? association._id : "");
			channel.bind('general', function(data) {
				fetch_requests(association._id)
				addToast(data,
					{
						appearance: 'info',
						autoDismiss: true
					}
				)
			});
			channel.bind('complete', function(data) {
				fetch_requests(association._id)
				addToast("Someone completed a request!",
					{
						appearance: 'success',
						autoDismiss: true
					}
				)
			});
		}
	}, []);

	const displayTab = (tabNumber) => {
		if (tabNumber === currTabNumber) {
			return {'display': 'block', paddingLeft: 15, paddingTop: 15};
		} else {
			return {'display': 'none', paddingLeft: 15, paddingTop: 15};
		}
	}

	const displayCount = (tabNumber, arr) => {
		return <div className={"request-count request-count-" + tabNumber}>{arr.length}</div>
	}

	const tabID = (tabNumber) => {
		return (tabNumber === currTabNumber) ? 'tab-button-selected' : 'tab-button';
	}

	return (<>
		<CovaidNavbar isLoggedIn={true} totalVolunteers={volunteers.length} orgPortal={true} first_name={association.name} handleShowModal={() => {}}/>
		<div style ={{zoom: '95%'}}>
			<Jumbotron fluid id="jumbo-volunteer" style={{paddingBottom: 50, paddingTop: 60}}>
				<Container style={{maxWidth: 1500}}>
					<Row>
						<Col lg={1} md={1} sm={0}></Col>
						<Col>
							<h1 id="home-heading" style={{marginTop: 0}}>Welcome back, {association.name}</h1>
							<p id="regular-text">This is your organization portal, a place for you to manage volunteers and requests in your area</p>
							<Button id="medium-button" onClick={()=>{setAdminModal(true)}}>
								Manage Organization
							</Button>{' '}
							<Button id="medium-button" onClick={()=>{setVolunteersModal(true)}}>
								View List Volunteers
							</Button><br/>
							<Button variant="link" id="resources-link" onClick={()=>{setResourceModal(true)}}>
								+ Add a link to your community's resources
							</Button>
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<Container id="volunteer-info" style={{maxWidth: 2000}}>
				<Row className="justify-content-md-center">
					<Col lg={6} md={12} sm={12}>
						<Container style={{padding: 0,  marginLeft: 0}}>
							{/* <Button id={tabID(1)} onClick={() => {setCurrTab(1)}}>Unmatched {displayCount(1, unmatched)}</Button>
							<Button id={tabID(2)} onClick={() => {setCurrTab(2)}}>Matched {displayCount(2, matched)}</Button>
							<Button id={tabID(3)} onClick={() => {setCurrTab(3)}}>Completed {displayCount(3, completed)}</Button> */}
							<Button id={tabID(1)} onClick={() => {setCurrTab(1)}}>Unmatched ({unmatched.length})</Button>
							<Button id={tabID(2)} onClick={() => {setCurrTab(2)}}>Matched ({matched.length})</Button>
							<Button id={tabID(3)} onClick={() => {setCurrTab(3)}}>Completed ({completed.length})</Button>
						</Container>
						<Container id="newOfferContainer" style={displayTab(1)}>
							<UnmatchedRequests association={association}
												requests={unmatched}
												unmatched={unmatched}
												matched={matched}
												completed={completed}
												setRequests={setUnmatched}
												setUnmatched={setUnmatched}
												setMatched={setMatched}
												setCompleted={setCompleted}
												volunteers={volunteers}
												mode={1}/>
						</Container>
						<Container id="newOfferContainer" style={displayTab(2)}>
							<UnmatchedRequests association={association}
												requests={matched}
												unmatched={unmatched}
												matched={matched}
												completed={completed}
												setRequests={setMatched}
												setUnmatched={setUnmatched}
												setMatched={setMatched}
												setCompleted={setCompleted}
												volunteers={volunteers}
												mode={2}/>
						</Container>
						<Container id="newOfferContainer" style={displayTab(3)}>
							<UnmatchedRequests association={association}
												requests={completed}
												unmatched={unmatched}
												matched={matched}
												completed={completed}
												setRequests={setCompleted}
												setUnmatched={setUnmatched}
												setMatched={setMatched}
												setCompleted={setCompleted}
												volunteers={volunteers}
												mode={3}/>
						</Container>
					</Col>
					<Col lg={6} md={12} sm={12} style={{marginTop: 10}}>
						<Container id="newOfferContainer" style={{'display': 'block'}}>
							<Col xs={12} style={{color: 'black', marginBottom: 10}}>
								<p id="map-title">Volunteer/Requester Map</p>
								<Button id={!volunteerMap ? "volunteer-not-selected" : "volunteer-selected"} onClick={() => setVolunteerMap(!volunteerMap)}>
									Volunteer
								</Button>
								<Button id={!requesterMap ? "requester-not-selected" : "requester-selected"} onClick={() => setRequesterMap(!requesterMap)}>
									Requester
								</Button>
							</Col>
							<NewMap requests={allRequests} volunteers={volunteers} mode={currTabNumber}
									unmatched={unmatched} matched={matched} completed={completed}
									requesterMap={requesterMap} volunteerMap={volunteerMap}
									volunteerDetailModal={volunteerDetailModal} association={association}
									setVolunteerDetailsModal={setVolunteerDetailsModal}
									currVolunteer={currVolunteer} setCurrVolunteer={setCurrVolunteer}
									requestDetailsModal={requestDetailsModal} setRequestDetailsModal={setRequestDetailsModal} 
                            		currRequest={currRequest} setCurrRequest={setCurrRequest}/>
						</Container>
					</Col>
				</Row>
			</Container>
			<VolunteersModal volunteersModal={volunteersModal}
							 setVolunteersModal={setVolunteersModal}
							 volunteers={volunteers}
							 association={association}
							 preVerify={true}/>
			<AdminModal adminModal={adminModal}
						setAdminModal={setAdminModal}
						association={association}
						setAssociation={setAssociation}/>
			<OrgResourcesModal resourceModal={resourceModal}
							setResourceModal={setResourceModal}
							association={association}
							setAssociation={setAssociation}/>
			<VolunteerDetails volunteerDetailModal={volunteerDetailModal}
						setVolunteerDetailsModal={setVolunteerDetailsModal}
						currVolunteer={currVolunteer}/>
			<RequestDetails requestDetailsModal={requestDetailsModal} 
								setRequestDetailsModal={setRequestDetailsModal} 
								currRequest={currRequest}
								setCurrRequest={setCurrRequest}
								association={association}
								unmatched={unmatched}
								matched={matched}
								completed={completed}
								setUnmatched={setUnmatched}
								setMatched={setMatched}
								setCompleted={setCompleted}
								mode={currTabNumber}
								volunteers={volunteers}/>
		</div>
		<OrgLogin showLogin={showLogin} setShowLogin={setShowLogin} login={login} />
	</>
	);
}
