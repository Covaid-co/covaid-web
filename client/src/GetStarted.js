import React from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'

export default function GetStarted(props) {
    return (
        <Modal show={props.showModal} style={{marginTop: 10}} onHide={props.hideModal}>
			<Modal.Header closeButton>
				<Modal.Title>
                    Organization Sign up
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                {/* <h1 id="home-sub-heading">Bring Covaid to your community!</h1> */}
                <p id="regular-text">Bring Covaid to your community today! Using Covaid empowers your organization 
                    to more easily handle requests of support made by neighbors in your community. At the 
                    same time, it gives your organization the ability to manage/assign volunteers to requests with the 
                    touch of a few buttons</p>
                <p id="regular-text" style={{fontStyle: 'italic', fontWeight: 600}}> 
                    Simply fill out this form and we'll be in contact with you shortly to setup your organization account!</p>
				<Form onSubmit={props.handleHide} style={{marginTop: 0, marginBottom: 10, display: "block", whiteSpace: 'nowrap'}}>
					<FormControl placeholder="Organization Name" style={{marginBottom: 5}}/>
                    <FormControl placeholder="Organization Contact" style={{marginBottom: 5}}/>
					<FormControl as="textarea" rows="5" placeholder="Details/Additional Info"/>
					<Button type="submit" id="large-button" style={{marginTop: 15}}>Get Started</Button>
				</Form>
			</Modal.Body>
		</Modal>
    );
}
