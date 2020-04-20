import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import RequestInfo from './RequestInfo'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PendingVolunteerRequests(props) {

    const [pendingRequests, setPendingRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [modalMode, setModalMode] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        setPendingRequests(props.pendingRequests);
        setAcceptedRequests(props.acceptedRequests);
    }, [props.pendingRequests, props.acceptedRequests])

    const acceptRequest = () => {
        props.moveRequestFromPendingToInProgress(currRequest)
    }

    const rejectRequest = () => {
        props.rejectAPendingRequest(currRequest)
    }

    const completeARequest = () => {
        props.completeAnInProgressRequest(currRequest)
    }

    const calculateRemainingTime = (pendingTime) => {
        var pendingTimeDate = new Date(pendingTime);
        var currentTime = new Date();

        var diff = currentTime - pendingTimeDate;
        diff = diff / 60 / 60 / 1000;

        var remainingTime = 24 - diff

        return Math.round(remainingTime)
    }

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
                        <ListGroup.Item action onClick={() => {setCurrRequest({...request}); setModalOpen(true); setModalMode(2)}}>
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
                <ListGroup.Item action onClick={() => {setCurrRequest({...request}); setModalOpen(true); setModalMode(1)}}>
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
                </ListGroup.Item>);
                })}
            </ListGroup>
            <RequestInfo modalOpen={modalOpen} modalMode={modalMode} setModalOpen={setModalOpen} currRequest={currRequest} acceptRequest={acceptRequest} rejectRequest={rejectRequest} completeARequest={completeARequest}/>
        </>
    )
}