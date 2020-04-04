import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import RequestDetails from './RequestDetails'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function UnmatchedRequests(props) {

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [requestDetailsModal, setRequestDetailsModal] = useState(false);
    const [currRequest, setCurrRequest] = useState({});

    useEffect(() => {
        setFilteredRequests(props.unmatched);
    }, [props.unmatched]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query === "") {
            setFilteredRequests(props.unmatched);
        }

        var filtered = props.unmatched.filter(p => {
            var emailMatch = String(p.requester_email).startsWith(query)
            for (var i = 0; i < p.resource_request.length; i++) {
                if (String(p.resource_request[i]).toLowerCase().startsWith(query)) {
                    return true;
                }
            }
            return emailMatch;
        });
        setFilteredRequests(filtered);
    }

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Form>
                        <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                            <Form.Control placeholder="Search for a request" onChange={filterRequests}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                </Col>
                <Col xs={12}>
                    <ListGroup variant="flush">
                        {filteredRequests.map((request, i) => {
                            return (
                            <ListGroup.Item key={i} action onClick={() => {setCurrRequest({...request}); setRequestDetailsModal(true)}}>
                                <div >
                                    <h5 className="volunteer-name">
                                        {request.requester_first} {request.requester_last}
                                    </h5>
                                    <p style={{float: 'right', marginBottom: 0, marginRight: 10}}>Needed by: {request.date}</p>
                                </div>
                                <div style={{display: 'inline-block', width: '100%'}}>
                                    <p style={{float: 'left', marginBottom: 0}}>Assignee: {request.assignee ? request.assignee : "No one assigned"}</p>
                                </div>
                                <div>
                                    {request.resource_request.map((task, i) => {
                                        return <Badge key={i} className='task-info'>{task}</Badge>
                                    })}
                                </div>
                            </ListGroup.Item>);
                            })}
                    </ListGroup>
                </Col>
            </Row>
            <RequestDetails requestDetailsModal={requestDetailsModal} 
                            setRequestDetailsModal={setRequestDetailsModal} 
                            currRequest={currRequest}
                            association={props.association}
                            mode={1}/>
        </>
    );
}