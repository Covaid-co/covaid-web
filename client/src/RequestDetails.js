import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import BestMatches from './BestMatches'
import Col from 'react-bootstrap/Col'
import VolunteerDetails from './VolunteerDetails'
import { useFormFields } from "./libs/hooksLib";
import { formatName } from './OrganizationHelpers'
import { generateMapsURL, moveFromToArr } from './Helpers';

export default function RequestDetails(props) {

    const [topMatchesModal, setTopMatchesModal] = useState(false);
    const [assignee, setAssignee] = useState('No one assigned');
    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [unmatchModal, setUnmatchModal] = useState(false);
    const [confirmCompleteModal, setConfirmCompleteModal] = useState(false);
    const [reason, setReason] = useState('Volunteer Completed');
    const [mapsURL, setMapsURL] = useState('');
    const [adminList, setAdminList] = useState([]);
    const [prevNote, setPrevNote] = useState('');
    const options = ['Call ahead to store and pay (Best option)',
                     'Have volunteer pay and reimburse when delivered',
                     'N/A']

    const [fields, handleFieldChange] = useFormFields({
        email2: ""
    });

    const updateAdminList = () => {
        if (props.association.admins) {
            const currAdminList = props.association.admins;
            var adminNames = currAdminList.map((admin) => {
                return admin['name'];
            })
            adminNames.push('No one assigned')
            if (props.currRequest.assignee) {
                if (adminNames.includes(props.currRequest.assignee) === false) {
                    adminNames.push(props.currRequest.assignee);
                }
                setAssignee(props.currRequest.assignee);
            }
            setAdminList(adminNames);
        }
    }

    useEffect(() => {
        console.log(props.currRequest);
        setAssignee('No one assigned');
        if (props.currRequest.latitude) {
            const tempURL = generateMapsURL(props.currRequest.latitude, props.currRequest.longitude);
            setMapsURL(tempURL);
        }
        fields.email2 = props.currRequest.note;
        setPrevNote(props.currRequest.note);
        updateAdminList();
    }, [props.currRequest, props.association]);


    const topMatch = () => {
        props.setRequestDetailsModal(false);
        setTopMatchesModal(true);
        setNotes();
    }

    const unMatch = () => {
        let form = {'request_id': props.currRequest._id};
        fetch('/api/request/removeVolunteerFromRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                const newRequest = {
                    ...props.currRequest,
                    'status': {
                        'current_status': 'incomplete',
                        'volunteer': ''
                    }
                }
                props.setCurrRequest(newRequest);
                moveFromToArr(newRequest, props.requests, props.setRequests, props.unmatched, props.setUnmatched);
                setTopMatchesModal(false);
                setUnmatchModal(false);
                props.setRequestDetailsModal(false);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const completeRequest = async e => {
        e.preventDefault();
        e.stopPropagation();

        let form = {
            'request_id': props.currRequest._id,
            'reason': reason
        };

        fetch('/api/request/completeRequest', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                var newRequest = {
                    ...props.currRequest,
                    'status': {
                        'current_status': 'complete',
                        "reason": reason
                    }
                }
                if (props.currRequest.status) {
                    newRequest = {
                        ...props.currRequest,
                        'status': {
                            ...props.currRequest.status,
                            'current_status': 'complete',
                            "reason": reason
                        }
                    }
                }
                props.setCurrRequest(newRequest);
                if (props.mode === 3) {
                    var dup = [...props.requests];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i] = newRequest;
                        }
                    }
                    props.setRequests(dup);
                } else {
                    moveFromToArr(newRequest, props.requests, props.setRequests, props.completed, props.setCompleted);
                }
                setConfirmCompleteModal(false);
                props.setRequestDetailsModal(false);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const setAdmin = (assignString) => {
        const requester_id = props.currRequest._id;
        let form = {
            'request_id': requester_id,
            'assignee': assignString
        };

        fetch('/api/request/set_assignee', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                if (props.requests) {
                    var dup = [...props.requests];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].assignee = assignString;
                        }
                    }
                    props.setRequests(dup);
                    var newRequest = {
                        ...props.currRequest,
                        'assignee': assignString
                    }
                    props.setCurrRequest(newRequest);
                }
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const modeButton = () => {
        if (props.mode === 1) {
            return <>
                        <Button id="nextPage" onClick={topMatch}>Match a volunteer</Button>
                        <Row style={{marginBottom: 10}}>
                            <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                                <Button id="mark-complete" onClick={()=>{setConfirmCompleteModal(true); props.setRequestDetailsModal(false); setNotes();}}>
                                    Mark Complete
                                </Button>
                            </Col>
                            <Col xs={6} style = {{padding: 0, paddingRight: 15, paddingLeft: 4}}>
                                <Button onClick={() => {setDeleteModal(true); props.setRequestDetailsModal(false); setNotes();}} id='remove-request'>Remove Request</Button>
                            </Col>
                        </Row>
                    </>;
        } else if (props.mode === 2) {
            return (<>
                    <Button id="nextPage" 
                            onClick={() => setVolunteerDetailsModal(true)}>
                            View Volunteers's Information
                    </Button>
                    <Row style={{marginBottom: 10}}>
                        <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                            <Button id="mark-complete" onClick={()=>{setConfirmCompleteModal(true); props.setRequestDetailsModal(false); setNotes();}}>
                                Mark Complete
                            </Button>
                        </Col>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15, paddingLeft: 4}}>
                            <Button onClick={() => {setUnmatchModal(true); props.setRequestDetailsModal(false); setNotes();}} id='remove-request'>Unmatch Request</Button>
                        </Col>
                    </Row>
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={props.currVolunteer}
                                    currRequest={props.currRequest}
                                    matching={false}/>
                </>);
        } else {
            return (<Row style={{marginBottom: 10}}>
                        <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                            <Button id="mark-complete" onClick={()=>{setConfirmCompleteModal(true); props.setRequestDetailsModal(false);}}>
                                Update complete status
                            </Button>
                        </Col>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15, paddingLeft: 4}}>
                            <Button onClick={() => {setUnmatchModal(true); props.setRequestDetailsModal(false); setNotes();}} id='remove-request'>Unmatch Request</Button>
                        </Col>
                    </Row>);
        }
    }

    const deleteRequest = () => {
        const requester_id = props.currRequest._id;
        let form = {'request_id': requester_id};

        fetch('/api/request/set_delete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                moveFromToArr(props.currRequest, props.requests, props.setRequests, [{'x': 'x'}], ()=>{});
                setDeleteModal(false);
                props.setRequestDetailsModal(false);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const setNotes = () =>{
        if (prevNote === fields.email2) {
            return;
        }
        let form = {
            'request_id': props.currRequest._id,
            'note': fields.email2
        };

        fetch('/api/request/set_notes', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                if (props.requests) {
                    var dup = [...props.requests];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].note = fields.email2;
                        }
                    }
                    props.setRequests(dup);
                    var newRequest = {
                        ...props.currRequest,
                        'note': fields.email2
                    }
                    props.setCurrRequest(newRequest);
                }
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const changeAssignee = (e) => {
        e.persist();
        setAssignee(e.target.value);
        setAdmin(e.target.value);
    }

    const handleChangeReasons = (event) => {
        event.persist();
        var result = event.target.value;
        setReason(result);
    }

    const modeString = () => {
        if (props.mode === 1) {
            return "Unmatched";
        } else if (props.mode === 2) {
            return "Matched";
        } else {
            return "Completed";
        }
    }

    return (
        <>
            <Modal show={props.requestDetailsModal} 
                   onHide={() => {props.setRequestDetailsModal(false); setNotes();}} 
                   style = {{marginTop: 10, paddingBottom: 50, zoom: '90%'}}>
                <Modal.Body>
                    <h5 className="titleHeadings" style={{marginTop: 0, marginBottom: 5}}>Who's tracking this request:</h5>
                    <Form>
                        <Form.Group controlId="tracking">
                            <Form.Control as="select" style = {{fontSize: 15}} value={assignee} onChange={changeAssignee}>
                                {adminList.length > 0 ? adminList.map((admin, i) => {
                                    return <option key={i} style={{textIndent: 10}}>{admin}</option>;
                                }) : <></>}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <h5 className="titleHeadings" style={{marginTop: 13, marginBottom: 5}}>Your Notes:</h5>
                    <Form>
                        <Form.Group controlId="email2" bssize="large">
                            <Form.Control as="textarea" 
                                        rows="3"
                                        placeholder="Details about this request"
                                        value={fields.email2 ? fields.email2 : ''} 
                                        onChange={handleFieldChange}/>
                        </Form.Group>
                    </Form>
                    <Modal.Title style={{fontSize: 28, marginTop: 20}}>Request Details ({modeString()})</Modal.Title>
                    <Col xs={12} style={{padding: 0}}><p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p></Col>
                    <p id="name-details">{formatName(props.currRequest.requester_first, props.currRequest.requester_last)}</p>
                    <p id="request-info">Location: <a target="_blank" rel="noopener noreferrer" href={mapsURL}>Click here</a></p>
                    {props.currRequest.requester_email ? <p id="request-info">{props.currRequest.requester_email}</p> : <></>}
                    {props.currRequest.requester_phone ? <p id="request-info">{props.currRequest.requester_phone}</p> : <></>}
                    <p id="request-info" style={{marginTop: 14}}>Languages: {props.currRequest.languages ? props.currRequest.languages.join(', ') : ''}</p>
                    <p id="request-info">Payment: {options[props.currRequest.payment]}</p>
                    <p id="request-info">Needs: {props.currRequest.resource_request ? props.currRequest.resource_request.join(', ') : ''}</p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Details:</h5>
                    <p id="request-info"> {props.currRequest.details}</p>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 16}}>Needed by:</h5>
                    <p id="request-info">{props.currRequest.time} of {props.currRequest.date}</p>
                    {modeButton()}
                    {/* <Col xs={12}><p id="requestCall" style={{marginTop: -5, marginBottom: 16}}>&nbsp;</p></Col>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 13, marginBottom: 5}}>Who's tracking this request:</h5>
                    <Form>
                        <Form.Group controlId="tracking">
                            <Form.Control as="select" style = {{fontSize: 15}} value={assignee} onChange={changeAssignee}>
                                {adminList.length > 0 ? adminList.map((admin, i) => {
                                    return <option key={i} style={{textIndent: 10}}>{admin}</option>;
                                }) : <></>}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <h5 className="titleHeadings" style={{marginBottom: 3, marginTop: 13, marginBottom: 5}}>Your Notes:</h5>
                    <Form>
                        <Form.Group controlId="email2" bssize="large">
                            <Form.Control as="textarea" 
                                        rows="5"
                                        placeholder="Details about this request"
                                        value={fields.email2 ? fields.email2 : ''} 
                                        onChange={handleFieldChange}/>
                        </Form.Group>
                    </Form> */}
                </Modal.Body>
            </Modal>

            <Modal size="sm" id="notes-modal" show={deleteModal} onHide={() => {setDeleteModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Request from {props.currRequest.requester_first}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="createAccountText">Are you sure you want to delete this request?</p>
                    <Button id="request-delete" onClick={deleteRequest}>Delete Request</Button>
                </Modal.Body>
            </Modal>

            <Modal size="sm" id="notes-modal" show={unmatchModal} onHide={() => {setUnmatchModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title>Unmatch Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="createAccountText">Are you sure you want to unmatch this request?</p>
                    <Button id="request-delete" onClick={unMatch}>Unmatch Request</Button>
                </Modal.Body>
            </Modal>

            <Modal size="sm" id="notes-modal" show={confirmCompleteModal} onHide={() => {setConfirmCompleteModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title>Completing the request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="createAccountText">
                        Reason the request is complete
                    </p>
                    <Form onSubmit={completeRequest}>
                        <Form.Group controlId="time" onChange={handleChangeReasons}>
                            <Form.Control as="select">
                                <option>Volunteer Completed</option>
                                <option>Could not reach</option>
                                <option>No one area</option>
                                <option>Recurring Request</option>
                                <option>Referred for support</option>
                            </Form.Control>
                        </Form.Group>
                        <Button id="nextPage" type='submit'>Complete Request</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <BestMatches topMatchesModal={topMatchesModal} 
                        setTopMatchesModal={setTopMatchesModal} 
                        currRequest={props.currRequest}
                        setCurrRequest={props.setCurrRequest}
                        association={props.association}
                        setRequestDetailsModal={props.setRequestDetailsModal}
                        volunteers={props.volunteers}
                        unmatched={props.unmatched}
                        matched={props.matched}
                        setUnmatched={props.setUnmatched}
                        setMatched={props.setMatched}/>
        </>
    );
}