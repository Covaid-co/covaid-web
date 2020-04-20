import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import BestMatches from './BestMatches'
import Col from 'react-bootstrap/Col'
import VolunteerDetails from './VolunteerDetails'
import { useFormFields } from "../libs/hooksLib";
import { formatName } from '../OrganizationHelpers'
import { toastTime, paymentOptions } from '../constants';
import { generateURL, generateMapsURL, moveFromToArr } from '../Helpers';

export default function RequestDetails(props) {

    const [currVolunteer, setCurrVolunteer] = useState({});
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
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [fields, handleFieldChange] = useFormFields({
        email2: "",
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
        setAssignee('No one assigned');
        if (props.currRequest.latitude) {
            const tempURL = generateMapsURL(props.currRequest.latitude, props.currRequest.longitude);
            setMapsURL(tempURL);
        }
        fields.email2 = props.currRequest.note;
        setPrevNote(props.currRequest.note);
        updateAdminList();
        if (props.currRequest.status && (props.mode === 2 || props.mode === 3)) {
            findUser(props.currRequest);
        }
    }, [props.currRequest, props.association]);


    const findUser = (request) => {
        if (request.status.volunteer === undefined || request.status.volunteer === 'manual') {
            setCurrVolunteer({});
            return;
        }
        let params = {'id': request.status.volunteer}
        const url = generateURL( "/api/users/user?", params);
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    if (data.length > 0) {
                        setCurrVolunteer(data[0]);
                    }
                });
            } else {
                console.log(response);
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const topMatch = () => {
        if (props.currRequest.assignee && props.currRequest.assignee !== '' && props.currRequest.assignee !== 'No one assigned') {
            props.setRequestDetailsModal(false);
            setTopMatchesModal(true);
            setNotes();
        } else {
            setShowToast(true);
            setToastMessage('Please assign an admin to track this request');
        }
    }

    const unMatch = () => {
        let form = {
            'request_id': props.currRequest._id,
            'assoc_id': props.association._id
        };
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
                if (props.mode === 2) {
                    moveFromToArr(newRequest, props.matched, props.setMatched, props.unmatched, props.setUnmatched);
                } else if (props.mode === 3) {
                    moveFromToArr(newRequest, props.completed, props.setCompleted, props.unmatched, props.setUnmatched);
                }
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
            'reason': reason,
            'assoc_id': props.association._id
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
                    var dup = [...props.completed];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i] = newRequest;
                            break;
                        }
                    }
                    props.setCompleted(dup);
                } else if (props.mode === 2) {
                    moveFromToArr(newRequest, props.matched, props.setMatched, props.completed, props.setCompleted);
                } else if (props.mode === 1) {
                    moveFromToArr(newRequest, props.unmatched, props.setUnmatched, props.completed, props.setCompleted);
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
                var dup;
                var i = 0;
                if (props.mode === 3) {
                    dup = [...props.completed];
                    for (i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].assignee = assignString;
                            break;
                        }
                    }
                    props.setCompleted(dup);
                } else if (props.mode === 2) {
                    dup = [...props.matched];
                    for (i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].assignee = assignString;
                            break;
                        }
                    }
                    props.setMatched(dup);
                } else if (props.mode === 1) {
                    dup = [...props.unmatched];
                    for (i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].assignee = assignString;
                            break;
                        }
                    }
                    props.setUnmatched(dup);
                }
                var newRequest = {
                    ...props.currRequest,
                    'assignee': assignString
                }
                props.setCurrRequest(newRequest);
            } else {
                alert("unable to attach");
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    const modeButton = () => {
        const completeButton = <Button id="large-button-empty" style={{borderColor: '#28a745', color: '#28a745'}} 
                                        onClick={()=>{setConfirmCompleteModal(true); props.setRequestDetailsModal(false); setNotes();}}>
                                    Mark Complete
                                </Button>
        if (props.mode === 1) {
            return <>
                    <Button id="large-button" style={{marginTop: 15}} onClick={topMatch}>Match a volunteer</Button>
                    <Row style={{marginBottom: 10}}>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15, paddingLeft: 4}}>
                            <Button id='large-button-empty'style={{borderColor: '#DB4B4B', color: '#DB4B4B'}} 
                                    onClick={() => {setDeleteModal(true); props.setRequestDetailsModal(false); setNotes();}}>
                                Remove Request
                            </Button>
                        </Col>
                        <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                            {completeButton}
                        </Col>
                    </Row>
                    <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id="toastError">
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>    
                </>;
        } else {
            return (<>
                    {Object.keys(currVolunteer).length > 0 ? 
                        <Button id="large-button" style={{marginTop: 15}} onClick={() => setVolunteerDetailsModal(true)}>
                            View Volunteers's Information
                        </Button>
                        : <></>}
                    <Row style={{marginBottom: 10}}>
                        <Col xs={6} style = {{padding: 0, paddingRight: 15, paddingLeft: 4}}>
                            <Button id='large-button-empty' style={{borderColor: '#DB4B4B', color: '#DB4B4B'}} 
                                    onClick={() => {setUnmatchModal(true); props.setRequestDetailsModal(false); setNotes();}}>
                                Unmatch Request
                            </Button>
                            <Col xs={6} style = {{padding: 0, paddingLeft: 15, paddingRight: 4}}>
                                {completeButton}
                            </Col>
                        </Col>
                    </Row>
                    <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    currRequest={props.currRequest}
                                    matching={false}/>
                </>);
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
                if (props.mode === 3) {
                    moveFromToArr(props.currRequest, props.completed, props.setCompleted, [{'x': 'x'}], ()=>{});
                } else if (props.mode === 2) {
                    moveFromToArr(props.currRequest, props.matched, props.setMatched, [{'x': 'x'}], ()=>{});
                } else if (props.mode === 1) {
                    moveFromToArr(props.currRequest, props.unmatched, props.setUnmatched, [{'x': 'x'}], ()=>{});
                }
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
                if (props.mode === 3) {
                    var dup = [...props.completed];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].note = fields.email2;
                            break;
                        }
                    }
                    props.setCompleted(dup);
                } else if (props.mode === 2) {
                    var dup = [...props.matched];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].note = fields.email2;
                            break;
                        }
                    }
                    props.setMatched(dup);
                } else if (props.mode === 1) {
                    var dup = [...props.unmatched];
                    for (var i = 0; i < dup.length; i++) {
                        if (props.currRequest._id === dup[i]._id) {
                            dup[i].note = fields.email2;
                            break;
                        }
                    }
                    props.setUnmatched(dup);
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
                    <h5 id="regular-text-bold" style={{marginTop: 0, marginBottom: 5}}>Who's tracking this request:</h5>
                    <Form>
                        <Form.Group controlId="tracking">
                            <Form.Control as="select" style = {{fontSize: 15}} value={assignee} onChange={changeAssignee}>
                                {adminList.length > 0 ? adminList.map((admin, i) => {
                                    return <option key={i} style={{textIndent: 10}}>{admin}</option>;
                                }) : <></>}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <h5 id="regular-text-bold" style={{marginTop: 13, marginBottom: 5}}>Your Notes:</h5>
                    <Form>
                        <Form.Group controlId="email2" bssize="large">
                            <Form.Control as="textarea" 
                                        rows="3"
                                        placeholder="Internal notes about this request"
                                        value={fields.email2 ? fields.email2 : ''} 
                                        onChange={handleFieldChange}/>
                        </Form.Group>
                    </Form>
                    <Modal.Title id="small-header" style={{marginTop: 20}}>Request Details ({modeString()})</Modal.Title>
                    <Col xs={12} style={{padding: 0}}><p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p></Col>
                    <p id="name-details">{formatName(props.currRequest.requester_first, props.currRequest.requester_last)}</p>
                    <p id="regular-text-nomargin">Location: <a target="_blank" rel="noopener noreferrer" href={mapsURL}>Click here</a></p>
                    {props.currRequest.requester_email ? <p id="regular-text-nomargin">{props.currRequest.requester_email}</p> : <></>}
                    {props.currRequest.requester_phone ? <p id="regular-text-nomargin">{props.currRequest.requester_phone}</p> : <></>}
                    <p id="regular-text-nomargin" style={{marginTop: 14}}>Languages: {props.currRequest.languages ? props.currRequest.languages.join(', ') : ''}</p>
                    <p id="regular-text-nomargin">Payment: {paymentOptions[props.currRequest.payment]}</p>
                    <p id="regular-text-nomargin">Needs: {props.currRequest.resource_request ? props.currRequest.resource_request.join(', ') : ''}</p>
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Details:</h5>
                    <p id="regular-text-nomargin"> {props.currRequest.details}</p>
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Needed by:</h5>
                    <p id="regular-text-nomargin">{props.currRequest.time} of {props.currRequest.date}</p>
                    {modeButton()}
                </Modal.Body>
            </Modal>

            <Modal size="sm" show={deleteModal} onHide={() => {setDeleteModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Delete Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">Are you sure you want to delete this request?</p>
                    <Button id="large-button" style={{backgroundColor: '#DB4B4B', border: '1px solid #DB4B4B'}} onClick={deleteRequest}>
                        Delete Request
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal size="sm" show={unmatchModal} onHide={() => {setUnmatchModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Unmatch Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text">Are you sure you want to unmatch this request?</p>
                    <Button id="large-button" style={{backgroundColor: '#DB4B4B', border: '1px solid #DB4B4B'}} onClick={unMatch}>
                        Unmatch Request
                    </Button>
                </Modal.Body>
            </Modal>

            <Modal dialogClassName="location-set-modal" show={confirmCompleteModal} 
                   onHide={() => {setConfirmCompleteModal(false); props.setRequestDetailsModal(true);}}>
                <Modal.Header closeButton>
                    <Modal.Title id="small-header">Completing a request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text" stlye={{marginBottom: 5}}>Reason the request is complete</p>
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
                        <Button id="large-button" style={{backgroundColor: '#28a745', border: '1px solid #28a745'}}>
                            Complete Request
                        </Button>
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