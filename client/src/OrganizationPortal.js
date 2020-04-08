import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Navbar from 'react-bootstrap/Navbar'
import UnmatchedRequests from './UnmatchedRequests'
import CompletedRequests from './CompletedRequests'
import MatchedRequests from './MatchedRequests'
import VolunteerList from './VolunteerList';
import OrgLogin from './OrgLogin'
import Cookie from 'js-cookie'
import Maps from './Maps'
import './OrganizationPage.css'

import fetch_a from './util/fetch_auth';

export default function OrganiationPortal(props) {

	const [currTabNumber, setCurrTab] = useState(1); 
	const [showLogin, setShowLogin] = useState(false); 
	const [association, setAssociation] = useState({});
	const [gotAssociation, setGotAssociation] = useState(false)
	const [volunteers, setVolunteers] = useState([]);

	const [unmatched, setUnmatched] = useState([]);
	const [matched, setMatched] = useState([]);
	const [completed, setCompleted] = useState([]);

	function fetchAssociation() {
		fetch_a('org_token', '/api/association/current')
			.then((response) => response.json())
			.then((association_response) => {
				setAssociation(association_response);
				setGotAssociation(true)

				var url = "/api/request/allRequestsInAssoc?";
				let params = {
					'association': association_response._id
				}
				let query = Object.keys(params)
					.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
					.join('&');
				url += query;

				fetch(url, {
					method: 'get',
					headers: {'Content-Type': 'application/json'},
				}).then((response) => {
					if (response.ok) {
						response.json().then(data => {
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
							// console.log(unMatchedArr);
							setUnmatched(unMatchedArr);
							setMatched(matchedArr);
							setCompleted(completedArr);
						});
					} else {
						console.log("Error");
					}
				}).catch((e) => {
					console.log(e)
				});

				var url = "/api/users/allFromAssoc?";
				params = {
					'association': association_response._id
				}
				query = Object.keys(params)
					 .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
					 .join('&');
				url += query;
		
				fetch(url, {
					method: 'get',
					headers: {'Content-Type': 'application/json'},
				}).then((response) => {
					if (response.ok) {
						response.json().then(data => {
							var resVolunteer = data.map((volunteer) => {
								return {'latitude': volunteer.latlong[1], 'longitude': volunteer.latlong[0]}
							})
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

	const handleHideLogin = () => {
		setShowLogin(false);
	}

	const login = () => {
		fetchAssociation();
	  }
	  
	const logout = () => {
		Cookie.remove('org_token');
		window.location.reload(false);
	}

	useEffect(() => {
		if (Cookie.get("org_token")) {
			fetchAssociation()
		} else {
			setShowLogin(true)
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

	const tabID = (tabNumber) => {
		if (tabNumber === currTabNumber) {
			return 'tab-button-selected';
		} else {
			return 'tab-button';
		}
	}

	var map1 = <></>
	var map2 = <></>

	if (gotAssociation) {
		map1 = <Maps show={currTabNumber === 5} requests={unmatched} association={association}>
				</Maps>
		map2 = <Maps show={currTabNumber === 6} requests={volunteers} association={association}>
				</Maps>
	}

	return (<>
		<link href="https://fonts.googleapis.com/css?family=Baloo+Chettan+2:400&display=swap" rel="stylesheet"></link>
		<Navbar collapseOnSelect 
				variant="light" 
				expand="md"
				className = {'customNav'}>
			<Navbar.Brand className={'home'} href = {window.location.protocol + '//' + window.location.host}
				style={{'color': 'white'}}>
				covaid
			</Navbar.Brand>
			<Navbar.Collapse id="basic-navbar-nav">
				
			</Navbar.Collapse>
		</Navbar>
		<div>
			<Jumbotron fluid id="jumbo-volunteer">
				<Container id="jumbo-container-volunteer">
					<Row>
						<Col lg={2} md={1} sm={0}>
						</Col>
						<Col>
							<h1 id="jumboHeading">Welcome back, </h1>
							<h1 id="jumboHeading">{association.name}</h1>
							<p id="jumboText">This is your organization portal, a place for you to manage volunteers and requests in your area</p>
							<Button id="homeButtons">
								View List of 154 Volunteers
							</Button>{' '}
							<Button id="homeButtons">
								Add/View Organization Admins
							</Button>
							{/* <Button variant="outline-danger" id='logoutButton' onClick={logout} style={{width: '10%'}}>
								<font id = "logout" style = {{color: 'white', fontWeight: 600, fontSize: 13}}>
									Logout
								</font>
                    		</Button> */}
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<Container id="volunteer-info">
					<Row className="justify-content-md-center">
						<Col></Col>
							<Col lg={8} md={10} sm={12}>
								<Container style={{padding: 0,  marginLeft: 0}}>
									<Button id={tabID(1)} onClick={() => {setCurrTab(1)}}>Unmatched</Button>
									<Button id={tabID(2)} onClick={() => {setCurrTab(2)}}>Matched</Button>
									<Button id={tabID(3)} onClick={() => {setCurrTab(3)}}>Completed</Button>
									<Button id={tabID(4)} onClick={() => {setCurrTab(4)}}>Volunteers</Button>
									<Button id={tabID(5)} onClick={() => {setCurrTab(5)}}>Request Map</Button>
									<Button id={tabID(6)} onClick={() => {setCurrTab(6)}}>Volunteer Map</Button>
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
									style={displayTab(1)}>
									<UnmatchedRequests state={props.state} 
													   association={association}
													   requests={unmatched}
													   mode={1}/>
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
									style={displayTab(2)}>
									<UnmatchedRequests state={props.state} 
													   association={association}
													   requests={matched}
													   mode={2}/>
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
									style={displayTab(3)}>
									<UnmatchedRequests state={props.state} 
													   association={association}
													   requests={completed}
													   mode={3}/>
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="request-view"
									style={displayTab(4)}>
									<VolunteerList state={props.state} association={association}/>
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="request-view"
									style={displayTab(5)}>
									{map1}
								</Container>
								<Container className="shadow mb-5 bg-white rounded" id="request-view"
									style={displayTab(6)}>
									{map2}
								</Container>
							</Col>
						<Col ></Col>
					</Row>
			</Container>
		</div>

		<OrgLogin showLogin={showLogin} handleHideLogin={handleHideLogin} login={login} />
	</>
	);
}
