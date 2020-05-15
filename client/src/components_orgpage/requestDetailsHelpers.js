import React from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import { generateURL } from '../Helpers';
import { current_tab, volunteer_status } from '../constants';
import { filter_volunteers, distance, formatName } from './OrganizationHelpers';

// Find a volunteer attached to this request
export const findAttachedVolunteer = async (curr_request, mode) => {
    if (curr_request.status === undefined ||
        curr_request.status.volunteers.length === 0 ||
        mode === current_tab.UNMATCHED) {
        return {};
    }
    const params = { 'id': curr_request.status.volunteers[0].volunteer }
    const url = generateURL( "/api/users/user?", params);

    const response = await fetch(url, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
    })

    if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
            return data[0];
        }
    }
    return {};
}

export const matchVolunteersButton = (mode, topMatch) => {
    if (mode === current_tab.UNMATCHED) {
        return <Button id="large-button" style={{marginTop: 15}} onClick={topMatch}>Match volunteers</Button>
    }
    return <></>
}

export const unmatchCompleteButtons = (mode, closeRequest, setUnmatchModal, setConfirmCompleteModal) => {
    return <Row style={{marginBottom: 10}}>
        <Col xs={6} style = {{padding: 0, paddingRight: 4, paddingLeft: 15}}>
            <Button id='large-button-empty' style={{borderColor: '#DB4B4B', color: '#DB4B4B'}} 
                    onClick={() => {setUnmatchModal(true); closeRequest();}}>
                Unmatch Request
            </Button>
        </Col>
        <Col xs={6} style = {{padding: 0, paddingLeft: 4, paddingRight:15}}>
            <Button id="large-button-empty" style={{borderColor: '#28a745', color: '#28a745'}} 
                    onClick={()=>{setConfirmCompleteModal(true); closeRequest();}}>
                {mode === current_tab.COMPLETED ? 'Update Status' : 'Mark Complete'}
            </Button>
        </Col>
    </Row>
}

export const viewVolunteersInfo = (mode, curr_request, viewEdit) => {
    if (mode === current_tab.MATCHED) {
        const volunteers = curr_request.status.volunteers;
        const in_progress = filter_volunteers(volunteers, volunteer_status.IN_PROGRESS);
        const pending = filter_volunteers(volunteers, volunteer_status.PENDING);

        // If there is at least 1 in progress, the request is in progress
        if (in_progress.length > 0) {
            return (
                <div style={{textAlign: 'center'}}>
                    <Button variant="link" style={{color: '#DB9327', fontWeight: 'bold'}} onClick={viewEdit}>
                        <p id="regular-text-nomargin" style={{marginTop: 10, marginBottom: 10, color: '#DB9327'}}>
                            {in_progress.length === 1 ?  "1 volunteer" : in_progress.length + " volunteers"} working on this
                        </p>
                    </Button>
                </div>);
        } else {
            return (
                <div style={{textAlign: 'center'}}>
                    <Button variant="link" style={{color: '#8A8A8A', fontWeight: 'bold'}} onClick={viewEdit}>
                        <p id="regular-text-nomargin" style={{marginTop: 10, marginBottom: 10, color: '#8A8A8A'}}>
                            Awaiting response from {pending.length === 1 ?  "1 volunteer" : pending.length + " volunteers"}
                        </p>
                    </Button>
                </div>);
        }
    } else {
        return <></>
    }
}


export const bestMatchesTitle = (curr_request, mode) => {
    if (mode === current_tab.UNMATCHED) {
        return formatName(curr_request.personal_info.requester_name) + "'s Top Matches"
    } else if (mode === current_tab.MATCHED) {
        return 'Edit Volunteer List';
    } else {
        return 'View Volunteers'
    }
}

export const unselectButtonStyle = (volunteerCount) => {
    if (volunteerCount() === 0) {
        return {color: '#cadaff', padding: 0, fontSize: 15, marginTop: 6, float: 'right'};
    }
    return {color: '#2670FF', padding: 0, fontSize: 15, marginTop: 6, float: 'right'};
}

// Display if volunteer was previously matched
export const displayPrevMatched = (volunteer, curr_request) => {
    const volunteers = curr_request.status.volunteers;
    const found = volunteers.find(vol => {
        return volunteer._id === vol.volunteer && vol.current_status === volunteer_status.REJECTED;
    });

    if (found) {
        return <h5 id="association-name" style={{color: '#FF4133'}}>
                Previously Matched
            </h5>
    }
    return <></>;
}


const sortSelectedTask = (curr_request) => (x, y) => {
    const validX = curr_request && curr_request.request_info
                && curr_request.request_info.resource_request.length > 0
                && curr_request.request_info.resource_request.indexOf(x) !== -1;
    
    const validY = curr_request && curr_request.request_info
                && curr_request.request_info.resource_request.length > 0
                && curr_request.request_info.resource_request.indexOf(y) !== -1;
    return (validX === validY) ? 0 : validX ? -1 : 1;
}


// Resource's that match between requester and volunteer
export const displayResourceMatch = (volunteer, curr_request) => {
    if (volunteer.offer.tasks.length === 0) {
        return <Badge id='task-info' style={{background: '#AE2F2F'}}>
                No tasks entered
            </Badge>
    } else { 
        var tasks = volunteer.offer.tasks;
        tasks.sort(sortSelectedTask(curr_request));
        return tasks.map((task, i) => {
            if (curr_request && curr_request.request_info 
                && curr_request.request_info.resource_request.length > 0
                && curr_request.request_info.resource_request.indexOf(task) !== -1) {
                return <Badge key={i} style={{background: '#2670FF'}} id='task-info'>{task}</Badge>
            } else {
                return <Badge key={i} style={{background: '#cadaff'}} id='task-info'>{task}</Badge>
            }
        });
    }
}


// List group item for volunteers in request details
export const volunteerListGroup = (volunteer, curr_request, handleVolunteerClick, checkboxStatus, handleCheckboxAction) => {
    return (
        <ListGroup.Item key={volunteer._id} style={{padding: 0}}>
            <Row>
                <Col lg={1} md={1}>
                    {!checkboxStatus ? <Form.Check type="checkbox" style={{marginTop: 35}} id='default-checkbox' checked={true} readOnly/> :
                     <Form.Check type="checkbox" style={{marginTop: 35}} id='default-checkbox'
                                checked={checkboxStatus[volunteer._id]} onChange={() => handleCheckboxAction(volunteer)}/>}
                </Col>
                <Col id="best-match-item" lg={11} md={11} onClick={() => handleVolunteerClick(volunteer)}>
                    <div>
                        <h5 id="volunteer-name" style={{marginBottom: 0}}>
                            {volunteer.first_name} {volunteer.last_name}
                        </h5>
                        {displayPrevMatched(volunteer, curr_request)}
                    </div>
                    <div>
                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                        <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                            {distance(volunteer, curr_request)} miles
                        </p>
                    </div>
                    <div>
                        {displayResourceMatch(volunteer, curr_request)}
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>);
}

// Volunteers attached to a request that have been notified
export const notifiedVolunteers = (curr_request, volunteers) => {
    const request_volunteers = curr_request.status.volunteers;
    const in_progress = filter_volunteers(request_volunteers, volunteer_status.IN_PROGRESS);
    const pending = filter_volunteers(request_volunteers, volunteer_status.PENDING);
    var displayed_volunteers = [];

    // If there is at least 1 in progress, the request is in progress
    if (in_progress.length > 0) {
        const in_progress_ids = in_progress.map(volunteer => volunteer.volunteer);
        displayed_volunteers = volunteers.filter(volunteer => in_progress_ids.includes(volunteer._id));
    } else if (pending.length > 0) {
        const pending_ids = pending.map(volunteer => volunteer.volunteer);
        displayed_volunteers = volunteers.filter(volunteer => pending_ids.includes(volunteer._id));
    }
    displayed_volunteers.sort(function(a, b) { return distance(a, curr_request) - distance(b, curr_request) });
    return displayed_volunteers;
}

// Volunteers attached to a request that are to be notified
export const unSelectedVolunteers = (curr_request, volunteers) => {
    const request_volunteers = curr_request.status.volunteers;
    const in_progress = filter_volunteers(request_volunteers, volunteer_status.IN_PROGRESS);
    const in_progress_ids = in_progress.map(volunteer => volunteer.volunteer);
    const pending = filter_volunteers(request_volunteers, volunteer_status.PENDING);
    const pending_ids = pending.map(volunteer => volunteer.volunteer);

    const needed_resources = curr_request.request_info ? curr_request.request_info.resource_request : [];
    var displayed_volunteers = volunteers.filter(volunteer => !in_progress_ids.includes(volunteer._id) && !pending_ids.includes(volunteer._id));
    displayed_volunteers = displayed_volunteers.filter(volunteer => volunteer.offer.tasks.some(item => needed_resources.includes(item)));
    displayed_volunteers = displayed_volunteers.filter(volunteer => volunteer.availability)
    displayed_volunteers.sort(function(a, b) { return distance(a, curr_request) - distance(b, curr_request) });
    displayed_volunteers = displayed_volunteers.slice(0, 20);
    return displayed_volunteers;
}