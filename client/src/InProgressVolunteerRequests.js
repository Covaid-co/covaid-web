import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import InProgressRequestInfo from './InProgressRequestInfo'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function InProgressVolunteerRequests(props) {

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        setRequests(props.acceptedRequests);
        setFilteredRequests(props.acceptedRequests)
    }, [props.acceptedRequests])

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

    const completeARequest = () => {
        props.completeAnInProgressRequest(currRequest);
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
                            <h5 id="volunteer-name">
                                {request.requester_first}
                            </h5>
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
            <InProgressRequestInfo modalOpen={modalOpen} setModalOpen={setModalOpen} currRequest={currRequest} completeARequest={completeARequest}/>
        </>
    )
}