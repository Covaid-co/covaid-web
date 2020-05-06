/**
 * Current requests tied to a volunteer (pending and in progress)
 */

import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import RequestInfo from './RequestInfo';


export default function CurrentVolunteerRequests(props) {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [modalMode, setModalMode] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        setPendingRequests(props.pendingRequests);
        setAcceptedRequests(props.acceptedRequests);
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

    return (
        <>
            <ListGroup variant="flush">
                {acceptedRequests.map((request, i) => {
                    return (
                    <ListGroup.Item action key={i} onClick={() => {setCurrRequest({...request}); setModalOpen(true); setModalMode(2)}}>
                        <div >
                            <h5 id="volunteer-name">
                                <b>{request.requester_first}</b>
                            </h5>
                            <Badge style={{float: 'right'}} className='in-progress-task'>In Progress</Badge>
                        </div>
                        <div>
                        {request.resource_request.map((task, i) => {
                            return <Badge key={i} id='task-info'>{task}</Badge>
                        })}
                        </div>
                        <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
                            <p style={{float: 'left', marginBottom: 0}} id="regular-text">Needed by: {request.date}</p>
                        </div>
                    </ListGroup.Item>);
                })}
                {pendingRequests.map((request, i) => {
                    return (
                        <ListGroup.Item action key={i} onClick={() => {setCurrRequest({...request}); setModalOpen(true); setModalMode(1)}}>
                            <div >
                                <h5 id="volunteer-name">
                                    <b>Someone needs your support!</b>
                                </h5>
                                <Badge className='pending-task' style={{float: 'right'}}>Action Needed</Badge>
                            </div>
                            <div>
                                {request.resource_request.map((task, i) => {
                                    return <Badge key={i} id='task-info'>{task}</Badge>
                                })}
                            </div>
                            <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
                                <p style={{float: 'left', marginBottom: 0}} id="regular-text">Needed by: {request.date}</p>
                            </div>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
            <RequestInfo modalOpen={modalOpen} modalMode={modalMode} setModalOpen={setModalOpen} currRequest={currRequest} acceptRequest={acceptRequest} rejectRequest={rejectRequest} completeARequest={completeARequest}/>
        </>
    )
}