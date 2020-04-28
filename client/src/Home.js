import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Geocode from "react-geocode";
import fetch_a from './util/fetch_auth';
import Cookie from 'js-cookie'

import HomePage from './HomePage'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import { findAssociations, getMyLocation, setNeighborhood, setLatLongCookie } from './location_tools/LocationHelpers'
import { removeCookies } from './Helpers';
import { cookieNames } from './constants';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import './Home.css'
import './styling/NewHomePage.css';

Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			latitude: '',
			longitude: '',
			zipCode: '',
			state: [],
			neighborhoods: [],
			locality: '',
			isLoaded: false,
			isLoggedIn: false,
			first_name: '',
			last_name: '',
			currentUser: undefined,
			showModal: false,
			modalType: '',
			justVerified: false,
			associations: [],
			currentAssoc: {},
			toggled: false
		}

		this.handleHideModal = this.handleHideModal.bind(this);
		this.handleShowModal = this.handleShowModal.bind(this);
		this.refreshLocation = this.refreshLocation.bind(this);
	}

	handleShowModal(modalType) {
		this.setState({modalType: modalType});
		this.setState({showModal: true});
	}
	
	handleHideModal() {
		this.setState({showModal: false});
	}

	setAssociationState(lat, long) {
		this.setState({latitude: lat, longitude: long});
		findAssociations(lat, long).then((associations) => {
			this.setState({'associations': associations});
			if (associations.length > 0) {
				this.setState({'currentAssoc': associations[0]})
			} else {
				this.setState({'currentAssoc': {}});
			}
		});
	}

	setLocationState() {
		getMyLocation().then((stateObj) => {
			this.setState(stateObj);
			this.setState({isLoaded: true});
			this.handleHideModal();
			if (!('neighborhoods' in stateObj)) {
				setNeighborhood(stateObj.latitude, stateObj.longitude).then((neighborObj) => {
					this.setState(neighborObj);
					this.setAssociationState(stateObj.latitude, stateObj.longitude);
				})
			} else {
				this.setAssociationState(stateObj.latitude, stateObj.longitude);
			}
		});
	}

	componentDidMount() {
		if (this.props.location.verified) {
			this.handleShowModal('signin');
			this.setState({justVerified: true});
		}

		// Automatically on load find location
		this.setLocationState();

		if (!this.state.isLoggedIn && Cookie.get("token")) {
			this.fetchUser();
		}
	}

	fetchUser(){
		fetch_a('token', '/api/users/current')
		.then((response) => response.json())
		.then((user) => {
			this.setState({ currentUser: user });
			this.setState({ isLoggedIn: true });
			this.setState({ first_name: user.first_name });
			this.setState({ last_name: user.last_name });
		})
		.catch((error) => {
			console.error(error);
		});
	}

	// Pressing refresh button
	refreshLocation() {
		removeCookies(cookieNames);
		this.setState({isLoaded: false});
		this.setLocationState();
	}

	// Entering location manually
	onLocationSubmit = (e, locationString) => {
		e.preventDefault();
		e.stopPropagation();
		return Geocode.fromAddress(locationString).then(
			response => {
				const { lat, lng } = response.results[0].geometry.location;

				removeCookies(cookieNames);
				setLatLongCookie(lat, lng);
				this.setState({isLoaded: true});

				setNeighborhood(lat, lng).then((neighborObj) => {
					this.setState(neighborObj);
					this.setAssociationState(lat, lng);
				});
				return true;
			}, () => {
				return false;
			}
		);
	}

	render() {
		return (
			[
				<div key="1" className="App" style={{height: '100%'}}>
					<NavBar isLoggedIn={this.state.isLoggedIn} first_name={this.state.first_name} handleShowModal={this.handleShowModal}/>
					<HomePage state={this.state} 
								setState={this.setState}
								setVolunteerPortal={() => this.props.history.push({
									pathname: '/volunteerPortal',
									loggedIn: true
								})}
								handleShowModal={this.handleShowModal} 
								onLocationSubmit={this.onLocationSubmit}
								refreshLocation={this.refreshLocation}
								handleHideModal={this.handleHideModal}/>
				</div>,
				<Footer key="2"/>
			]
		)}
}

export default withRouter(Home);