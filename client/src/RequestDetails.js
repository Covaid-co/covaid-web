import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import RequestMatches from './RequestMatches'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import VolunteerDetails from './VolunteerDetails'

export default function RequestDetails(props) {

    const [topMatchesModal, setTopMatchesModal] = useState(false);
    const [assignee, setAssignee] = useState('');
    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    useEffect(() => {
        setAssignee(props.currRequest.assignee ? props.currRequest.assignee : '');
    }, [props.currRequest]);


    const topMatch = () => {
        props.setRequestDetailsModal(false);
        setTopMatchesModal(true);
    }

    const unMatch = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id
        };

        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const completeRequest = () => {
        const requester_id = props.currRequest._id;
        const volunteer_id = props.currRequest.status.volunteer;

        let form = {
            'request_id': requester_id,
            'volunteer_id': volunteer_id
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                setTopMatchesModal(false);
                props.setRequestDetailsModal(false);
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const assignVolunteer = () => {
        const requester_id = props.currRequest._id;

        let form = {
            'request_id': requester_id,
            'assignee': assignee
        };

        fetch('/api/request/set_assignee', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("attached");
                window.location.reload();
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const modeButton = () => {
        if (props.mode === 1) {
            return <Button id="nextPage" onClick={topMatch}>Find a volunteer for {props.currRequest.requester_first}!</Button>;
        } else if (props.mode === 2) {
            console.log(props.currRequest)
            return (<>
                    {/* <Button id="nextPage"
                            onClick={unMatch}
                            style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}>
                        Unmatch {props.currRequest.requester_first}'s Volunteer
                    </Button>
                    <Button id="nextPage" 
                            style={{backgroundColor: '#28a745', borderColor: '#28a745', marginTop: 8}} 
                            onClick={completeRequest}>
                        Complete {props.currRequest.requester_first}'s Request
                    </Button> */}
                    <Button id="nextPage" 
                            style={{marginTop: 15, height: 35}}
                            onClick={() => setVolunteerDetailsModal(true)}>
                            View Volunteers's Information
                    </Button>
                    <Row style={{marginTop: 15}}>
                        <Col xs={6} style = {{padding: 0, paddingLeft: 15}}>
                            <Button onClick={unMatch} id='leftCarButtonPressed' style={{backgroundColor: '#dc3545', borderColor: '#dc3545', height: 50}}>Unmatch Volunteer</Button>
                        </Col>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15}}>
                            <Button onClick={completeRequest} id='rightCarButtonPressed' style={{backgroundColor: '#28a745', borderColor: '#28a745', height: 50}}>Complete Request</Button>
                        </Col>
                    </Row>
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={props.currVolunteer}
                                    currRequest={props.currRequest}/>
                </>);
        } else {
            return (<Button id="nextPage"
                        onClick={unMatch}
                        style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}>
                        Unmatch Request Volunteer
                    </Button>);
        }
    }

    return (
        <>
            <Modal show={props.requestDetailsModal} onHide={() => props.setRequestDetailsModal(false)} style = {{marginTop: 30, paddingBottom: 50}}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={assignVolunteer} style={{marginBottom: 12}}>
                        <InputGroup controlid="assignee">
                            <FormControl
                                placeholder="Assignee for Request" 
                                aria-label="Assignee for Request"
                                aria-describedby="basic-addon2"
                                value={assignee}
                                onChange={e => setAssignee(e.target.value)}
                            />
                            <InputGroup.Append>
                                <Button variant="outline-secondary" type="submit">Set Assignee</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    <h5 className="titleHeadings" style={{marginBottom: 3}}>Information</h5>
                    <p id="request-info">Name: {props.currRequest.requester_first} {props.currRequest.requester_last}</p>
                    <p id="request-info">Email: {props.currRequest.requester_email}</p>
                    <p id="request-info">Phone: {props.currRequest.requester_phone}</p>
                    <p id="request-info">Needed by: {props.currRequest.time} of {props.currRequest.date}</p>
                    <p id="request-info">Payment: {options[props.currRequest.payment]}</p>
                    <p id="request-info">Languages: {props.currRequest.languages ? props.currRequest.languages.join(', ') : ''}</p>
                    <p id="request-info">Needs: {props.currRequest.resource_request ? props.currRequest.resource_request.join(', ') : ''}</p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                    <p id="request-info"> {props.currRequest.details}</p>
                    {modeButton()}
                </Modal.Body>
            </Modal>

            <RequestMatches topMatchesModal={topMatchesModal} 
                            setTopMatchesModal={setTopMatchesModal} 
                            currRequest={props.currRequest}
                            association={props.association}
                            setRequestDetailsModal={props.setRequestDetailsModal}/>
        </>
    );
}