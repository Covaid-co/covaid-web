import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import RequestDetails from './RequestDetails'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function MatchedRequests(props) {

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [requestDetailsModal, setRequestDetailsModal] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [currVolunteer, setCurrVolunteer] = useState({});

    useEffect(() => {
        setFilteredRequests(props.matched);
    }, [props.matched]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query === "") {
            setFilteredRequests(props.matched);
        }

        var filtered = props.matched.filter(p => {
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


    const findUser = (request) => {
        var url = "/api/users/user?";
        let params = {
            'id': request.status.volunteer
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
                    console.log(data);
                    if (data.length > 0) {
                        setCurrVolunteer(data[0]);
                    }
                });
            } else {
                console.log(response);
            }
        }).catch((e) => {
            console.log(e);
        });
    }

    return (
        <>
            <Row>
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                </Col>
                <Col xs={12}>
                    <ListGroup variant="flush">
                        {filteredRequests.map((request, i) => {
                            return (
                            <ListGroup.Item key={i} action onClick={() => {setCurrRequest({...request}); findUser(request); setRequestDetailsModal(true)}}>
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
                            currVolunteer={currVolunteer}
                            setCurrRequest={setCurrRequest}
                            mode={2}/>
        </>
    );
}