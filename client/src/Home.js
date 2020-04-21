import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Geocode from "react-geocode";
import fetch_a from './util/fetch_auth';
import Cookie from 'js-cookie'

import HomePage from './HomePage'
import CovaidNavbar from './CovaidNavbar'
import Footer from './components/Footer'
import { findAssociations, getMyLocation, setNeighborhood } from './location_tools/LocationHelpers'
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

	componentDidMount() {
		if (this.props.location.verified) {
			this.handleShowModal(6);
			this.setState({justVerified: true});
		}
		getMyLocation(this);
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

	refreshLocation() {
		removeCookies(cookieNames);
		this.setState({isLoaded: false});
		getMyLocation(this);
	}

	onLocationSubmit = (e, locationString) => {
		e.preventDefault();
		e.stopPropagation();
		return Geocode.fromAddress(locationString).then(
			response => {
				const { lat, lng } = response.results[0].geometry.location;
				removeCookies(cookieNames);
				setNeighborhood(lat, lng, this);
				findAssociations(lat, lng, this);
				return true;
			}, () => {
				return false;
			}
		);
	}

	render() {
		return (
			[
				<div className="App" style={{height: '100%'}}>
					<CovaidNavbar isLoggedIn={this.state.isLoggedIn} first_name={this.state.first_name} handleShowModal={this.handleShowModal}/>
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
				<Footer key="2" handleShowModal={this.handleShowModal}/>
			]
		)}
}

export default withRouter(Home);