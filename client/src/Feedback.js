import React from "react";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'

export default function Feedback(props) {


    return (
        <>
			<Modal.Header closeButton>
				<Modal.Title>Let us know if you have any feedback!</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form 
					action="https://docs.google.com/forms/u/0/d/e/1FAIpQLSdvk1_J6JuQjva7VXdonad4QRC7E7rZBzQL9M3aX42bANyEQA/formResponse"
					target="_blank"
					rel="noopener noreferrer"
					method="POST"
					onSubmit={props.handleHide}
					style={{marginTop: "10px", marginBottom: "30px", display: "block", whiteSpace: 'nowrap'}}>
					<FormControl
						type="text" 
						name="entry.1347491217"
						placeholder="Email Address"
						className="mr-sm-2"
						style={{marginBottom: 10}}/>
					<FormControl
						as="textarea" 
						rows="3"
						type="text" 
						name="entry.1354002737"
						placeholder="Feedback"
						className="mr-sm-2" />
					<Button type="submit" id="nextPage" variant="success" style={{marginTop: 15}} >Submit</Button>
				</Form>
			</Modal.Body>
		</>
    );
}