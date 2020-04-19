import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'

import RequestInfo from './RequestInfo'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CompletedVolunteerRequests(props) {

    const [completedRequests, setCompletedRequests] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState(0);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {

        setCompletedRequests(props.completedRequests.reverse());
    }, [props.completedRequests])

    if (completedRequests.length === 0) {
        return <>
                 <p id="regular-text" style={{color: 'black', textAlign: "center", marginTop: 20}}>
                        <strong style={{fontSize: 18}}>You have no completed requests at the moment.</strong> 
                </p>
        </>
    }

    return (
        <>
            <ListGroup variant="flush">
                {completedRequests.map((request, i) => {
                    var completedDate = new Date(request.completed_date);
                        return (
                        <ListGroup.Item action onClick={() => {setCurrRequest({...request}); setModalOpen(true); setModalMode(3)}}>
                            <div >
                                <h5 id="volunteer-name">
                                    <b>{request.requester_first}</b>
                                </h5>
                            </div>
                            <div>
                            {request.resource_request.map((task, i) => {
                                    return <Badge key={i} id='task-info'>{task}</Badge>
                                })}
                            </div>
                            <div style={{display: 'inline-block', width: '100%', marginTop: 10}}>
                                <p style={{float: 'left', marginBottom: 0}} id="regular-text">Completed on: {request.completed_date ? completedDate.toLocaleDateString('en-US') : "N/A"}</p>
                            </div>
                        </ListGroup.Item>);
                        })}
            </ListGroup>
            <RequestInfo modalOpen={modalOpen} modalMode={modalMode} setModalOpen={setModalOpen} currRequest={currRequest} />
        </>
    )
}