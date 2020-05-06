import React, { useState, useEffect } from 'react';
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal' 
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AcceptedVolunteersModal(props) {

    const [volunteers, setVolunteers] = useState([]);
    const[loaded, setLoaded] = useState(false);
    
    useEffect(() => {
        setVolunteers(props.acceptedVolunteers);
        setLoaded(true);
    }, [props.acceptedVolunteers])

    if (!loaded) {
        return <></>;
    }

    const pageContent = () => {
        if (volunteers.length === 0) {
            return <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                            <strong style={{fontSize: 18}}>No one has accepted this beacon yet</strong> 
                    </p>
        } else {
            return (
            <ListGroup variant="flush" style={{overflowY: "scroll", height: 300}}>
            {
                volunteers.map((volunteer, i) => {
                    const message = (volunteer.responseMessage && volunteer.responseMessage.length > 0) ? 
                    <>
                        <h5 id="volunteer-name" style={{marginBottom: 15}}>
                            Message:
                        </h5>
                        <p id="regular-text" style={{fontSize: 16}}>
                            "{volunteer.responseMessage}"
                        </p>
                    </> 
                    : 
                    <></>

                    return (
                        <ListGroup.Item key={i} style={{paddingTop: 5, paddingBottom: 5}}>
                            <div >
                                <h5 id="volunteer-name" style={{marginBottom: 25}}>
                                    {volunteer.volunteer_first} {volunteer.volunteer_last} 
                                </h5><br />
                                <h5 id="volunteer-name" style={{marginBottom: 15}}>
                                    Contact:
                                </h5>
                                <p id="regular-text" style={{fontSize: 16}}>
                                    {volunteer.volunteer_email} {volunteer.volunteer_phone}
                                </p>
                                {message}
                                
                            </div>
                        </ListGroup.Item>);
                    })}
                </ListGroup>
            )
        }
    }

    return (
        <>
            <Modal size="md" show={props.showAcceptedVolunteers} onHide={() => {props.setShowAcceptedVolunteers(false); props.setOriginalModal(true)}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Beacon-Accepting Volunteers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pageContent()}
                </Modal.Body>
            </Modal>
        </>
    )
}