import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import RequestDetailsVolunteer from './RequestDetailsVolunteer'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VolunteerRequests(props) {

    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        var url = "/api/request/allRequestsInVolunteer?";
        let params = {
            'volunteerID': props.state.currentUser._id
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;

        console.log(url)
        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
                response.json().then(data => {
                    setRequests(data)
                    console.log(data)
                    setFilteredRequests(data)
                });
            } else {
                console.log("Error")
            }
        }).catch((e) => {
            console.log(e)
        });
    }, [props.state.currentUser])

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query === "") {
            setFilteredRequests(requests)
        }

        var filtered = requests.filter(p => {
            var emailMatch = String(p.requester_email).startsWith(query)
            for (var i = 0; i < p.resource_request.length; i++) {
                if (String(p.resource_request[i]).toLowerCase().startsWith(query)) {
                    return true
                }
            }
            return emailMatch
        });
        setFilteredRequests(filtered)
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
                                {request.requester_first} {request.requester_last}
                            </h5>
                        </div>
                        <div style={{display: 'inline-block', width: '100%'}}>
                            <p style={{float: 'left', marginBottom: 0}}>Needed by: {request.date}</p>
                        </div>
                        <div>
                        {request.resource_request.map((task, i) => {
                                return <Badge key={i} className='task-info'>{task}</Badge>
                            })}
                        </div>
                    </ListGroup.Item>);
                    })}
            </ListGroup>
            <RequestDetailsVolunteer modalOpen={modalOpen} setModalOpen={setModalOpen} currRequest={currRequest}/>
        </>
    )
}