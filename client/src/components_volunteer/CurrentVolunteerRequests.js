/**
 * Current requests tied to a volunteer (pending and in progress)
 */

import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RequestInfo from './RequestInfo';
import { request_status, volunteer_status } from '../constants';

export default function CurrentVolunteerRequests(props) {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [modalMode, setModalMode] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [volunteerSpecificInfo, setVolunteerSpecificInfo] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setPendingRequests(props.pendingRequests);
        setAcceptedRequests(props.acceptedRequests);
        setIsLoaded(true);
    }, [props.pendingRequests, props.acceptedRequests])

    // Callback to change VolunteerPortal state (Pending -> In Progress)
    const acceptRequest = () => {
        props.moveRequestFromPendingToInProgress(currRequest)
    }

    // Callback to change VolunteerPortal state (Reject (Disappear))
    const rejectRequest = () => {
        props.rejectAPendingRequest(currRequest)
    }

     // Callback to change VolunteerPortal state (In Progress -> Complete)
    const completeARequest = () => {
        props.completeAnInProgressRequest(currRequest)
    }

    // Render default text if there are no pending/active requests
    if (pendingRequests.length + acceptedRequests.length === 0) {
        return <>
            <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                <strong style={{fontSize: 18}}>You have no pending/active requests at the moment.</strong> 
            </p>
        </>
    }

    if (!isLoaded) {
        return <></>;
    }

    const handleRequestClick = (request, mode) => {
        setCurrRequest({...request}); 
        setModalOpen(true); 
        setModalMode(mode);
        let volunteerSpecific = request.status.volunteers.filter(function(volunteer) {
            return volunteer.volunteer === props.user._id;
        });
        setVolunteerSpecificInfo(volunteerSpecific);
    }

    return (
        <>
            <ListGroup variant="flush">
                {acceptedRequests.map((request, i) => {
                    return (
                    <ListGroup.Item action key={i} onClick={() => {handleRequestClick(request, volunteer_status.IN_PROGRESS)}}>
                        <div >
                            <h5 id="volunteer-name">
                                <b>{request.personal_info.requester_name}</b>
                            </h5>
                            <Badge style={{float: 'right'}} className='in-progress-task'>In Progress</Badge>
                        </div>
                        <div>
                        {request.request_info.resource_request.map((task, i) => {
                            return <Badge key={i} id='task-info'>{task}</Badge>
                        })}
                        </div>
                        <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
                            <p style={{float: 'left', marginBottom: 0}} id="regular-text">Needed by: {request.request_info.date}</p>
                        </div>
                    </ListGroup.Item>);
                })}
                {pendingRequests.map((request, i) => {
                    var helpNeededText = "Action needed";
                    var disabled = false;
                    request.status.volunteers.forEach(volunteer_status_obj => {
                        if (volunteer_status_obj.volunteer !== props.user._id) {
                            if (parseInt(volunteer_status_obj.current_status) === volunteer_status.IN_PROGRESS || parseInt(volunteer_status_obj).current_status === volunteer_status.COMPLETE) {
                                helpNeededText = "Someone else is on it";
                                disabled = true;
                            }
                        }
                    });
                    return (
                        <ListGroup.Item action key={i} disabled={disabled} onClick={() => {handleRequestClick(request, volunteer_status.PENDING)}}>
                            <div >
                                <h5 id="volunteer-name">
                                    <b>Someone needs your support!</b>
                                </h5>
                                <Badge className='pending-task' style={{float: 'right'}}>
                                    {
                                        helpNeededText
                                    }
                                </Badge>
                            </div>
                            <div>
                                {request.request_info.resource_request.map((task, i) => {
                                    return <Badge key={i} id='task-info'>{task}</Badge>
                                })}
                            </div>
                            <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
                                <p style={{float: 'left', marginBottom: 0}} id="regular-text">Needed by: {request.request_info.date}</p>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
            <RequestInfo modalOpen={modalOpen} modalMode={modalMode} setModalOpen={setModalOpen} currRequest={currRequest} volunteerSpecificInfo={volunteerSpecificInfo} acceptRequest={acceptRequest} rejectRequest={rejectRequest} completeARequest={completeARequest}/>
        </>
    )
}