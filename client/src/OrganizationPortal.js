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
import Maps from './Maps'
import VolunteersModal from './VolunteersModal';
import AdminModal from './AdminModal';
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

	const [allRequests, setAllRequests] = useState([]);
	const [unmatched, setUnmatched] = useState([]);
	const [matched, setMatched] = useState([]);
	const [completed, setCompleted] = useState([]);

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
				var pusher = new Pusher('ed72954a8d404950e3c8', {
					cluster: 'us2',
					forceTLS: true
				  });
				var channel = pusher.subscribe(association_response._id);
				channel.bind('general', function(data) {
					fetch_requests(association_response._id)
					addToast("New unmatched request!",
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

				fetch_requests(association_response._id)
				
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

	const logout = () => {
		Cookie.remove('org_token');
		window.location.reload(false);
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
				addToast("New unmatched request!",
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
			if (tabNumber === 5 || tabNumber === 6) {
				return {'display': 'block', 'paddingBottom': 600};
			}
			return {'display': 'block'};
		} else {
			return {'display': 'none'};
		}
	}

	const displayCount = (tabNumber, arr) => {
		if (tabNumber === currTabNumber) {
			return <div className={"request-count request-count-" + tabNumber}>{arr.length}</div>
		} else {
			return <></>;
		}
	}

	const tabID = (tabNumber) => {
		return (tabNumber === currTabNumber) ? 'tab-button-selected' : 'tab-button';
	}

	return (<>
		<link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
		<Navbar collapseOnSelect variant="light" expand="md" className = 'customNav'>
			<Navbar.Brand className={'home'} href = {window.location.protocol + '//' + window.location.host}
				style={{'color': 'white'}}>
				covaid
			</Navbar.Brand>
			<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
				<Button variant="outline-danger" id='logoutButton' onClick={logout} style={{marginTop: 10, marginRight: '10%'}}>
					<font id = "logout" style = {{color: 'white', fontWeight: 600, fontSize: 13}}>
						Logout
					</font>
				</Button>
			</Navbar.Collapse>
		</Navbar>
		<div style ={{zoom: '95%'}}>
			<Jumbotron fluid id="jumbo-volunteer">
				<Container id="jumbo-container-volunteer">
					<Row>
						<Col lg={2} md={1} sm={0}></Col>
						<Col>
							<h1 id="jumboHeading">Welcome back, </h1>
							<h1 id="jumboHeading">{association.name}</h1>
							<p id="jumboText">This is your organization portal, a place for you to manage volunteers and requests in your area</p>
							<Button id="homeButtons" onClick={()=>{setAdminModal(true)}}>
								Manage Organization
							</Button>{' '}
							<Button id="homeButtons" onClick={()=>{setVolunteersModal(true)}}>
								View List of {volunteers.length} Volunteers
							</Button>
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<Container id="volunteer-info" style={{maxWidth: 2000}}>
				<Row className="justify-content-md-center">
					<Col></Col>
						<Col lg={8} md={10} sm={12}>
							<Container style={{padding: 0,  marginLeft: 0}}>
								<Button id={tabID(1)} onClick={() => {setCurrTab(1)}}>Unmatched {displayCount(1, unmatched)}</Button>
								<Button id={tabID(2)} onClick={() => {setCurrTab(2)}}>Matched {displayCount(2, matched)}</Button>
								<Button id={tabID(3)} onClick={() => {setCurrTab(3)}}>Completed {displayCount(3, completed)}</Button>
								<Button id={tabID(4)} onClick={() => {setCurrTab(4)}}>Request Map</Button>
								<Button id={tabID(5)} onClick={() => {setCurrTab(5)}}>Volunteer Map</Button>
							</Container>
							<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
								style={displayTab(1)}>
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
							<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
								style={displayTab(2)}>
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
							<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
								style={displayTab(3)}>
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
							<Container className="shadow mb-5 bg-white rounded" id="request-view"
								style={displayTab(4)}>
								{Object.keys(association).length === 0 ? <></> : 
									<Maps show={currTabNumber === 4} requests={allRequests} association={association}></Maps>}
							</Container>
							<Container className="shadow mb-5 bg-white rounded" id="request-view"
								style={displayTab(5)}>
								{Object.keys(association).length === 0 ? <></> : 
									<Maps show={currTabNumber === 5} requests={volunteers} association={association}></Maps>}
							</Container>
						</Col>
					<Col></Col>
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
		</div>
		<OrgLogin showLogin={showLogin} setShowLogin={setShowLogin} login={login} />
	</>
	);
}
