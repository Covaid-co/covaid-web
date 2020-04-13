import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal' 

export default function InProgressRequestInfo(props) {

    useEffect(() => {
        var tempURL = "https://www.google.com/maps/@";
        if (props.currRequest.latitude && props.currRequest.longitude) {
            tempURL += props.currRequest.latitude + ',';
            tempURL += props.currRequest.longitude + ',15z';
        }
        setMapURL(tempURL);
    }, [props.currRequest])

    const [mapURL, setMapURL] = useState('');

    const reject = () => {
        const requester_id = props.currRequest._id;

        let form = {
            'request_id': requester_id,
            'assoc_id': props.currRequest.association
        };

        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                props.setModalOpen(false)
                window.location.reload(false)
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const accept = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;
        const assoc_id = props.currRequest.association

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id,
            'reason': 'Volunteer Completed',
            'assoc_id': assoc_id
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                props.setModalOpen(false)
                props.completeARequest()
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    } 

    return (
        <Modal show={props.modalOpen} onHide={() => {props.setModalOpen(false)}} style = {{marginTop: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>This request is currently in-progress</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 0}}>Who:</h5>
                <p id="request-info"> {props.currRequest.requester_first}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Contact:</h5>
                <p id="request-info">{props.currRequest.requester_email} {props.currRequest.requester_phone}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                <p id="request-info"> {props.currRequest.details}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Requesting support with:</h5>
                {props.currRequest.resource_request ? 
                    props.currRequest.resource_request.map((task, i) => {
                        return <Badge key={i} className='task-info'>{task}</Badge>
                    }) : <></>
                }
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needed by:</h5>
                <p id="request-info">{props.currRequest.time} of {props.currRequest.date}</p>
                <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Location:</h5>
                <p id="request-info"><a target="_blank" rel="noopener noreferrer" href={mapURL}>Click here</a></p>
                <Row style={{marginTop: 15}}>
                        <Col xs={6} style = {{padding: 0, paddingLeft: 15}}>
                            <Button onClick={reject} id='leftCarButtonPressed' style={{backgroundColor: '#dc3545', borderColor: '#dc3545', height: 50}}>Cancel this request</Button>
                        </Col>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15}}>
                            <Button onClick={accept} id='rightCarButtonPressed' style={{backgroundColor: '#28a745', borderColor: '#28a745', height: 50}}>Complete this request</Button>
                        </Col>
                    </Row>
            </Modal.Body>
        </Modal>
    );
}