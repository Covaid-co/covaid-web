import React, { useState } from "react";
import YourOffer from './YourOffer'
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import VolunteerRequests from './VolunteerRequests';
import './VolunteerPage.css'

export default function VolunteerPortal(props) {

	const [firstTab, setFirstTab] = useState(true);

	return (
		<> 
			<Jumbotron fluid id="jumbo-volunteer">
				<Container id="jumbo-container-volunteer">
					<Row>
						<Col lg={2} md={1} sm={0}>
						</Col>
						<Col>
							<h1 id="jumboHeading">Welcome back, {props.state.first_name}!</h1>
							<p id="jumboText">This is your volunteer portal, a place for you to manage your offers and requests</p>
						</Col>
					</Row>
				</Container>
			</Jumbotron>
			<Container id="volunteer-info">
				<Row className="justify-content-md-center">
					<Col></Col>
					<Col lg={6} md={8} sm={10}>
						<Container style={{padding: 0, marginLeft: 0}}> 
							<Button id={firstTab ? "tab-button-selected" : "tab-button"} onClick={() => {setFirstTab(true)}}>Your Offer</Button>
							<Button id={!firstTab ? "tab-button-selected" : "tab-button"} onClick={() => {setFirstTab(false)}}>Requests</Button>
						</Container>
						<Container className="shadow mb-5 bg-white rounded" id="yourOffer"
							style={firstTab ? {'display': 'block'} : {'display': 'none'}}>
							<YourOffer state = {props.state} />
						</Container>
						<Container className="shadow mb-5 bg-white rounded" id="request-view"
							style={firstTab ? {'display': 'none'} : {'display': 'block'}}>
							<VolunteerRequests state={props.state}/>
						</Container>
						</Col>
					<Col ></Col>
				</Row>
			</Container>
		</>
	);
}
