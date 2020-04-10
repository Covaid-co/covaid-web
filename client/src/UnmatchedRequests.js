import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import RequestDetails from './RequestDetails'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from  'react-bootstrap/Dropdown'
import { sortReq, filterReq, formatName } from './OrganizationHelpers';
import { generateURL } from './Helpers';

export default function UnmatchedRequests(props) {

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [requestDetailsModal, setRequestDetailsModal] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [name, setName] = useState(false);
    const [need, setNeed] = useState(false);
    const [foundQuery, setQuery] = useState('');

    useEffect(() => {
        const filteredRequests = filterReq(foundQuery, props.requests);
        setFilteredRequests(filteredRequests);
    }, [props.requests]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        setQuery(query);
        const filteredRequests = filterReq(query, props.requests);
        setFilteredRequests(filteredRequests);
    }

    const sortRequests = (type) => {
        const sortedRequests = sortReq(type, filteredRequests, name, need);
        if (type === 'name') {
            setName(!name);
        } else {
            setNeed(!need);
        }
        setFilteredRequests(sortedRequests);
    }

    const findUser = (request) => {
        console.log(request)
        if (request.status.volunteer === undefined || request.status.volunteer === 'manual') {
            setCurrVolunteer({});
            return;
        }
        let params = {'id': request.status.volunteer}
        const url = generateURL( "/api/users/user?", params);

        fetch(url, {
            method: 'get',
            headers: {'Content-Type': 'application/json'},
        }).then((response) => {
            if (response.ok) {
            response.json().then(data => {
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

    const resourceCompleteBadge = (request) => {
        var result = <></>;
        if (props.mode === 3) {
            result = <Badge className='task-info-requests' style={{backgroundColor: "#28a745", border: '1px solid #28a745'}}>
                        {request.status.reason ? request.status.reason : "Volunteer Completed"}
                    </Badge>                      
        } else {
            result = request.resource_request.map((task, i) => {
                return <Badge key={i} className='task-info-requests'>{task}</Badge>
            })
        }
        return result;
    }

    const clickRequest = (request) => {
        setCurrRequest({...request}); 
        setRequestDetailsModal(true);
        if (props.mode === 2) {
            findUser(request); 
        }
    }

    return (
        <>
            <Row>
                <Col xs={8}>
                    <Form>
                        <Form.Group bssize="large" style={{marginTop: 10}}>
                            <Form.Control id="filter-requests" placeholder="Search by First/Last name, Assignee or task" onChange={filterRequests}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={4}>
                <Dropdown drop='up'>
                    <Dropdown.Toggle id="dropdown-basic" className='dropdown-sort'>
                        Sort
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{width: '100%'}}>
                        <Dropdown.Item onClick={()=>sortRequests('name')}>Name</Dropdown.Item>
                        <Dropdown.Item onClick={()=>sortRequests('need')}>Needed By</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col xs={12}>
                    <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                </Col>
                <Col xs={12}>
                    <ListGroup variant="flush">
                        {filteredRequests.map((request, i) => {
                            return (
                                <ListGroup.Item key={i} action onClick={() => {clickRequest(request)}}>
                                    <div >
                                        <h5 className="volunteer-name">
                                            {formatName(request.requester_first, request.requester_last)}
                                        </h5>
                                        <p style={{float: 'right', marginBottom: 0, marginRight: 10}}>Needed by: {request.date}</p>
                                    </div>
                                    <div>{resourceCompleteBadge(request)}</div>
                                    <div style={{display: 'inline-block', width: '100%'}}>
                                        <p style={{float: 'left', marginBottom: 0}}>Tracking: 
                                        {request.assignee ? <Badge key={i} className='assignee-info'>{request.assignee}</Badge> : " No one assigned"}</p>
                                    </div>
                                </ListGroup.Item>);
                            })}
                    </ListGroup>
                </Col>
            </Row>
            <RequestDetails requestDetailsModal={requestDetailsModal} 
                            setRequestDetailsModal={setRequestDetailsModal} 
                            currRequest={currRequest}
                            setCurrRequest={setCurrRequest}
                            association={props.association}
                            currVolunteer={currVolunteer}
                            setRequests={props.setRequests}
                            requests={props.requests}
                            unmatched={props.unmatched}
                            matched={props.matched}
                            completed={props.completed}
                            setUnmatched={props.setUnmatched}
                            setMatched={props.setMatched}
                            setCompleted={props.setCompleted}
                            mode={props.mode}
                            volunteers={props.volunteers}/>
        </>
    );
}