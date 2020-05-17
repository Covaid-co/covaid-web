import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import BestMatches from './BestMatches'
import Badge from 'react-bootstrap/Badge'
import Col from 'react-bootstrap/Col'
import VolunteerDetails from './VolunteerDetails';
import { useFormFields } from "../libs/hooksLib";
import { formatName, updateAllRequests } from './OrganizationHelpers'
import { toastTime, paymentOptions, current_tab, volunteer_status } from '../constants';
import { generateURL, generateMapsURL } from '../Helpers';
import fetch_a from '../util/fetch_auth';
import { matchVolunteersButton, unmatchCompleteButtons, viewVolunteersInfo } from './requestDetailsHelpers';

/**
 * Request Details Modal
 */

export default function RequestDetails(props) {
    const [topMatchesModal, setTopMatchesModal] = useState(false);
    const [assignee, setAssignee] = useState('No one assigned');
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
    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [currVolunteer, setCurrVolunteer] = useState([]);

    useEffect(() => {
        setAssignee('No one assigned');
        createMapsLink();
        fields.email2 = props.currRequest.admin_info.note;
        setPrevNote(props.currRequest.admin_info.note);
        updateAdminList();
    }, [props.currRequest, props.association, props.mode]);

    // Create link to requesters location
    const createMapsLink = () => {
        if (props.currRequest.location_info) {
            const lat = props.currRequest.location_info.coordinates[1];
            const long = props.currRequest.location_info.coordinates[0];
            const tempURL = generateMapsURL(lat, long);
            setMapsURL(tempURL);
        }
    }

    // Update selection menu for list of admins
    const updateAdminList = () => {
        if (props.association.admins) {
            const currAdminList = props.association.admins;
            var adminNames = currAdminList.map((admin) => {
                return admin['name'];
            })
            adminNames.push('No one assigned')
            if (adminNames.includes(props.currRequest.admin_info.assignee) === false) {
                adminNames.push(props.currRequest.admin_info.assignee);
            }
            setAssignee(props.currRequest.admin_info.assignee);
            setAdminList(adminNames);
        }
    }

    // Display Top Matches Modal if there is an admin attached
    const topMatch = () => {
        if (props.currRequest.admin_info.assignee && 
            props.currRequest.admin_info.assignee !== '' && 
            props.currRequest.admin_info.assignee !== 'No one assigned') {
            setTopMatchesModal(true);
            props.setRequestDetailsModal(false);
        } else {
            setShowToast(true);
            setToastMessage('Please assign an admin to track this request');
        }
    }

    const viewEdit = () => {
        setTopMatchesModal(true);
        props.setRequestDetailsModal(false);
    }

    const viewComplete = (volunteer_status) => {
        setVolunteerDetailsModal(true);
        props.setRequestDetailsModal(false);
        let volunteer = props.volunteers.find(function (v) {
            return v._id === volunteer_status.volunteer
        });
        setCurrVolunteer(volunteer);
    }

    // Update current request and requests array
    const updateRequests = (request) => {
        props.setCurrRequest(request);
        // Update all requests array with the new updated request
        const newAllRequests = updateAllRequests(request, props.allRequests);
        props.setAllRequests(newAllRequests);
    }

    // Remove a volunteer from request
    const unMatch = () => {
        let form = {
            '_id': props.currRequest._id,
        };
        fetch('/api/request/unmatchVolunteers', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(newRequest => {
            updateRequests(newRequest);

            // Reset/close all modals 
            setTopMatchesModal(false);
            setUnmatchModal(false);
            props.setRequestDetailsModal(false);
        }).catch(e => {
            alert(e);
        });
    }

    // Completing a request
    const completeRequest = async e => {
        e.preventDefault();
        e.stopPropagation();

        let form = {
            'reason': reason,
            'adminMode': true
        };
        var url = "/api/request/completeRequest?";
        let params = {
            'ID' : props.currRequest._id
        }
		var url = generateURL( "/api/request/completeRequest?", params);

        fetch_a('org_token', url, {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(newRequest => {
            updateRequests(newRequest);
            setConfirmCompleteModal(false);
            props.setRequestDetailsModal(false);
        }).catch(e => {
            alert(e);
        });
    }

    // Add admin to a request
    const setAdmin = (assignString) => {
        const requester_id = props.currRequest._id;
        let form = {
            requestID: requester_id,
            updates: {
                $set: {
                    "admin_info.assignee": assignString,
                }
            } 
        };

        fetch('/api/request/updateRequestDetails', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(newRequest => {
            updateRequests(newRequest);
        }).catch(e => {
            alert(e);
        });
    }

    // Deleting a request
    const deleteRequest = () => {
        const requester_id = props.currRequest._id;
        let form = {
            requestID: requester_id,
            updates: {
                $set: {
                    "delete": true,
                }
            } 
        };

        fetch('/api/request/updateRequestDetails', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(request => {
            const newAllRequests = props.allRequests.filter(request => request._id !== request._id);
            props.setAllRequests(newAllRequests);
            setDeleteModal(false);
            props.setRequestDetailsModal(false);
        }).catch(e => {
            alert(e);
        });
    }

    // Update admin notes
    const setNotes = () =>{
        if (prevNote === fields.email2) {
            return;
        }
        const requester_id = props.currRequest._id;
        let form = {
            requestID: requester_id,
            updates: {
                $set: {
                    "admin_info.note": fields.email2,
                }
            } 
        };

        fetch('/api/request/updateRequestDetails', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => response.json())
        .then(newRequest => {
            updateRequests(newRequest);
        }).catch(e => {
            alert(e);
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

    // const openVolunteersModal = (volunteers, mode) => {
    //     setSelectedVolunteers(volunteers);
    //     setShowVolunteers(true);
    //     setViewVolunteersMode(mode);
    // }

    const closeRequest = () => {
        props.setRequestDetailsModal(false); 
        setNotes();
    }

    const modeString = () => {
        if (props.mode === current_tab.UNMATCHED) {
            return " (Unmatched)";
        } else if (props.mode === current_tab.MATCHED) {
            return "";
        } else {
            return " (Completed) ";
        }
    }

    const assignToMe = () => {
        setAssignee(props.admin.first_name + " " + props.admin.last_name);
        setAdmin(props.admin.first_name + " " + props.admin.last_name);
    }

    const adminTracker = () => {
        if (props.admin && (Object.keys(props.admin).length !== 0 || props.admin.constructor !== Object)) {
            return (<Row>
                <Col xs={8} style={{paddingRight: 4}}>
                    <Form>
                        <Form.Group controlId="tracking">
                            <Form.Control as="select" style = {{fontSize: 15}} value={assignee} onChange={changeAssignee}>
                                {adminList.length > 0 ? adminList.map((admin, i) => {
                                    return <option key={i} style={{textIndent: 10}}>{admin}</option>;
                                }) : <></>}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={4} style={{paddingLeft: 4}}>
                        <Button onClick={assignToMe} style={{
                                "fontFamily": "Inter",
                                "backgroundColor": "transparent",
                                "borderColor": "#8A8A8A",
                                "color": "#8A8A8A",
                                "borderRadius": "8px"
                            }}>
                            Assign to me
                        </Button>
                </Col></Row>
            );
        } else {
            return (
                <Form>
                    <Form.Group controlId="tracking">
                        <Form.Control as="select" style = {{fontSize: 15}} value={assignee} onChange={changeAssignee}>
                            {adminList.length > 0 ? adminList.map((admin, i) => {
                                return <option key={i} style={{textIndent: 10}}>{admin}</option>;
                            }) : <></>}
                        </Form.Control>
                    </Form.Group>
                </Form>
            );
        }
    }

    const volunteerComments = () => {
        const volunteers = props.currRequest.status.volunteers;
        const found = volunteers.find(vol => {
            return vol.current_status === volunteer_status.COMPLETE;
        });
        if (props.mode === current_tab.COMPLETED && found && found.volunteer_response && found.volunteer_response.length > 0) {
            return <>
                <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Volunteer's completion remarks:</h5>
                    <p id="regular-text-nomargin">"{found.volunteer_response}"</p>
            </>
        } else {
            return <></>
        }
    }

    // Current status of request (pending/in progress)
    const requestStatus = () => {
        if (props.mode === current_tab.MATCHED) {
            const volunteers = props.currRequest.status.volunteers;
            const in_progress = volunteers.find(vol => vol.current_status === volunteer_status.IN_PROGRESS);
            const pending = volunteers.find(vol => vol.current_status === volunteer_status.PENDING);
            if (in_progress) {
                return <Badge className='in-progress-task' style={{marginTop: 6}}>In Progress</Badge>;
            } else if (pending) {
                return <Badge className='pending-task' style={{marginTop: 6}}>Pending</Badge>;
            }
        }
        return <></>
    }

    const paymentText = () => {
        if (props.association._id === '5e843ab29ad8d24834c8edbf') {
            return <></>
        } else {
            return <p id="regular-text-nomargin">Payment: {paymentOptions[props.currRequest.request_info.payment]}</p>
        }
    }

    const contactInfo = () => {
        if (props.currRequest.personal_info.requester_email || props.currRequest.personal_info.requester_phone) {
            return (<>
                <p id="regular-text-nomargin">{props.currRequest.personal_info.requester_email}</p>
                <p id="regular-text-nomargin">{props.currRequest.personal_info.requester_phone}</p></>
            );
        }
        else {
            return (<>
            <p id="regular-text-nomargin" style={{color: "#EF6315"}}><b>Share contact directly with volunteer (i.e. from Notes)</b>
            </p>
            </>
            );
        }
    } 

    return (
        <>
            <Modal show={props.requestDetailsModal} 
                   onHide={() => {
                        props.setRequestDetailsModal(false); 
                        setNotes();
                        if (props.setInRequest) {
                            props.setInRequest(false);
                        }
                    }} 
                   style = {{marginTop: 10, paddingBottom: 50, zoom: '90%'}}>
                <Modal.Body>
                    <h5 id="regular-text-bold" style={{marginTop: 0, marginBottom: 5}}>Who's tracking this request:</h5>
                    {adminTracker()}
                    <h5 id="regular-text-bold" style={{marginTop: 13, marginBottom: 5}}>Notes:</h5>
                    <Form>
                        <Form.Group controlId="email2" bssize="large">
                            <Form.Control as="textarea" 
                                        rows="3"
                                        placeholder="Internal notes about this request"
                                        value={fields.email2 ? fields.email2 : ''} 
                                        onChange={handleFieldChange}/>
                        </Form.Group>
                    </Form>
                    <Modal.Title id="small-header" style={{marginTop: 20}}>Request Details {modeString()} {requestStatus()}</Modal.Title>
                    <Col xs={12} style={{padding: 0}}><p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p></Col>
                    <p id="name-details">{formatName(props.currRequest.personal_info.requester_name)}</p>
                    <p id="regular-text-nomargin">Location: <a target="_blank" rel="noopener noreferrer" href={mapsURL}>Click here</a></p>
                    {contactInfo()}
                    <p id="regular-text-nomargin" style={{marginTop: 14}}>Languages: {props.currRequest.personal_info.languages.join(', ')}</p>
                    {paymentText()}
                    <p id="regular-text-nomargin">Needs: {props.currRequest.request_info.resource_request.join(', ')}</p>
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Details:</h5>
                    <p id="regular-text-nomargin"> {props.currRequest.request_info.details}</p>
                    <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>Needed by:</h5>
                    {
                        (props.currRequest.request_info.date) ? 
                        <p id="regular-text-nomargin">{props.currRequest.request_info.time} of {props.currRequest.request_info.date}</p>
                        :
                        <p id="regular-text-nomargin">N/A</p>
                    }
                    {volunteerComments()}
                    <p id="requestCall" style={{marginTop: 15, marginBottom: 10}}></p>
                    {matchVolunteersButton(props.mode, topMatch)}
                    {viewVolunteersInfo(props.mode, props.currRequest, viewEdit, viewComplete)}
                    {unmatchCompleteButtons(props.mode, closeRequest, setUnmatchModal, setDeleteModal, setConfirmCompleteModal)}
                    <Toast show={showToast} delay={toastTime} onClose={() => setShowToast(false)} autohide id='toastError'>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
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
                                <option>Volunteer completed</option>
                                <option>Could not reach</option>
                                <option>No one in area</option>
                                <option>Recurring request</option>
                                <option>Referred to support</option>
                                <option>Food delivery scheduled</option>
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit" id="large-button" style={{backgroundColor: '#28a745', border: '1px solid #28a745'}}>
                            Complete Request
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <BestMatches { ... props} topMatchesModal={topMatchesModal} setTopMatchesModal={setTopMatchesModal}/>
            <VolunteerDetails { ... props } volunteerDetailModal={volunteerDetailModal} setVolunteerDetailsModal={setVolunteerDetailsModal} 
                        currVolunteer={currVolunteer} inRequest={true} setRequestDetailsModal={props.setRequestDetailsModal} />
        </>
    );
}

RequestDetails.propTypes = {
    admin: PropTypes.object,
    currRequest: PropTypes.object,
    setCurrRequest: PropTypes.func,
    association: PropTypes.object,
    mode: PropTypes.number,
    setRequestDetailsModal: PropTypes.func,
    setVolunteerDetailsModal: PropTypes.func,
    setAllRequests: PropTypes.func,
    setInRequest: PropTypes.func,
    allRequests: PropTypes.array,
    requestDetailsModal: PropTypes.bool
};