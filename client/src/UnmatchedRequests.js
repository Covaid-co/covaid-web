import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import RequestDetails from './RequestDetails'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from  'react-bootstrap/Dropdown'
import { sortFn, sortReq, filterReq, formatName } from './OrganizationHelpers'

export default function UnmatchedRequests(props) {

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [requestDetailsModal, setRequestDetailsModal] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [name, setName] = useState(false);
    const [need, setNeed] = useState(false);
    
    useEffect(() => {
        var temp = JSON.parse(JSON.stringify(props.requests));
        temp.sort(function(a, b) {
            const x = new Date(a.date);
            const y = new Date(b.date);
            return sortFn(x, y, true);
        });
        setFilteredRequests(temp);
    }, [props.requests]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
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
                <Col xs={8}>
                    <Form>
                        <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                            <Form.Control placeholder="Search by First/Last name, Assignee or task" onChange={filterRequests}/>
                        </Form.Group>
                    </Form>
                </Col>
                <Col xs={4}>
                <Dropdown drop='up'>
                    <Dropdown.Toggle id="dropdown-basic" style={{marginTop: 10, width: '100%', backgroundColor: '#314CCE'}}>
                        Sorting
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
                            <ListGroup.Item key={i} action onClick={() => {
                                    setCurrRequest({...request}); 
                                    setRequestDetailsModal(true);
                                    if (props.mode === 2) {
                                        findUser(request); 
                                    }
                                }}>
                                <div >
                                    <h5 className="volunteer-name">
                                        {formatName(request)}
                                    </h5>
                                    <p style={{float: 'right', marginBottom: 0, marginRight: 10}}>Needed by: {request.date}</p>
                                </div>
                                <div>
                                    {request.resource_request.map((task, i) => {
                                        return <Badge key={i} className='task-info-requests'>{task}</Badge>
                                    })}
                                </div>
                                <div style={{display: 'inline-block', width: '100%'}}>
                                    <p style={{float: 'left', marginBottom: 0}}>Assignee: 
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
                            association={props.association}
                            setCurrRequest={setCurrRequest}
                            currVolunteer={currVolunteer}
                            mode={props.mode}/>
        </>
    );
}