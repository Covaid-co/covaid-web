import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import PendingRequestInfo from './PendingRequestInfo'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function PendingVolunteerRequests(props) {

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        setRequests(props.pendingRequests);
        setFilteredRequests(props.pendingRequests)
    }, [props.pendingRequests])

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query === "") {
            setFilteredRequests(requests)
        }

        var filtered = requests.filter(p => {
            for (var i = 0; i < p.resource_request.length; i++) {
                if (String(p.resource_request[i]).toLowerCase().startsWith(query)) {
                    return true
                }
            }
            return false
        });
        setFilteredRequests(filtered)
    }

    const acceptRequest = () => {
        props.moveRequestFromPendingToInProgress(currRequest)
    }

    const rejectRequest = () => {
        props.rejectAPendingRequest(currRequest)
    }

    const calculateRemainingTime = (pendingTime) => {
        var pendingTimeDate = new Date(pendingTime);
        var currentTime = new Date();

        var diff = currentTime - pendingTimeDate;
        diff = diff / 60 / 60 / 1000;

        var remainingTime = 24 - diff

        return Math.round(remainingTime)
    }

    return (
        <>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <InputGroup>
                        <FormControl
                        placeholder="Search through requests"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        onChange={filterRequests}
                        />
                    </InputGroup>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {filteredRequests.map((request, i) => {
                    return (
                    <ListGroup.Item action onClick={() => {setCurrRequest({...request}); setModalOpen(true)}}>
                        <div >
                            <h5 className="volunteer-name">
                                Someone needs your support!
                            </h5>
                        <p style={{float: 'right', marginBottom: 0}}>Expires in {
                            calculateRemainingTime(request.pending_time)} hours</p>
                        </div>
                        <div>
                        {request.resource_request.map((task, i) => {
                                return <Badge key={i} className='task-info'>{task}</Badge>
                            })}
                        </div>
                        <div style={{display: 'inline-block', width: '100%'}}>
                            <p style={{float: 'left', marginBottom: 0}}>Needed by: {request.date}</p>

                        </div>
                    </ListGroup.Item>);
                    })}
            </ListGroup>
            <PendingRequestInfo modalOpen={modalOpen} setModalOpen={setModalOpen} currRequest={currRequest} acceptRequest={acceptRequest} rejectRequest={rejectRequest}/>
        </>
    )
}