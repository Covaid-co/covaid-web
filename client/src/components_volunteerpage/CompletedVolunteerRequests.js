import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import RequestInfo from './RequestInfo'
import 'bootstrap/dist/css/bootstrap.min.css';

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
                            <Row>
                                <Col lg={10} md={8} sm={6}>
                                    <div>
                                    {request.resource_request.map((task, i) => {
                                            return <Badge key={i} id='task-info'>{task}</Badge>
                                        })}
                                    </div>
                                </Col>
                                <Col lg={1} md={1} sm={1} id='check'>
                                    <div>
                                        <FontAwesomeIcon style={{color: "#28a745"}} icon={faCheck} /> 
                                    </div>
                                </Col>
                            </Row>
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