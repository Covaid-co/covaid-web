import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import RequestDetails from './RequestDetails'
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from  'react-bootstrap/Dropdown'

export default function UnmatchedRequests(props) {

    const [filteredRequests, setFilteredRequests] = useState([]);
    const [requestDetailsModal, setRequestDetailsModal] = useState(false);
    const [currRequest, setCurrRequest] = useState({});
    const [name, setName] = useState(false);
    const [need, setNeed] = useState(false);

    useEffect(() => {
        var temp = JSON.parse(JSON.stringify(props.unmatched));
        temp.sort(function(a, b) {
            const x = new Date(a.date);
            const y = new Date(b.date);
            if (x > y) {
                return -1;
            }
            if (y > x) {
                return 1;
            }
            return 0;
        });
        setFilteredRequests(temp);
    }, [props.unmatched]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        if (!query || query === "") {
            setFilteredRequests(props.unmatched);
        }

        var filtered = props.unmatched.filter(p => {
            var dup = JSON.parse(JSON.stringify(p.resource_request));
            dup.push('groceries');
            var emailMatch = String(p.requester_email.toLowerCase()).startsWith(query);
            var firstNameMatch = String(p.requester_first.toLowerCase()).startsWith(query);
            var lastNameMatch = String(p.requester_last.toLowerCase()).startsWith(query);
            var ass = (p.assignee) ? String(p.assignee.toLowerCase()).startsWith(query) : false;
            for (var i = 0; i < dup.length; i++) {
                if (String(dup[i]).toLowerCase().startsWith(query)) {
                    return true;
                }
            }
            return emailMatch || firstNameMatch || lastNameMatch || ass;
        });
        setFilteredRequests(filtered);
    }

    const sortRequests = (type) => {
        if (type === 'name') {
            var temp = JSON.parse(JSON.stringify(filteredRequests));
            setName(!name);
            temp.sort(function(a, b) {
                const x = String(a.requester_first.toLowerCase())
                const y = String(b.requester_first.toLowerCase())
                if (name) {
                    if (x > y) {
                        return -1;
                    }
                    if (y > x) {
                        return 1;
                    }
                } else {
                    if (x < y) {
                        return -1;
                    }
                    if (y < x) {
                        return 1;
                    }
                }
                return 0;
            });
            setFilteredRequests(temp);
        } else {
            setNeed(!need);
            var temp = JSON.parse(JSON.stringify(filteredRequests));
            temp.sort(function(a, b) {
                const x = new Date(a.date);
                const y = new Date(b.date);
                if (need) {
                    if (x > y) {
                        return -1;
                    }
                    if (y > x) {
                        return 1;
                    }
                } else {
                    if (x < y) {
                        return -1;
                    }
                    if (y < x) {
                        return 1;
                    }
                }
                return 0;
            });
            setFilteredRequests(temp);
        }
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
                            <ListGroup.Item key={i} action onClick={() => {setCurrRequest({...request}); setRequestDetailsModal(true)}}>
                                <div >
                                    <h5 className="volunteer-name">
                                        {request.requester_first}&nbsp;{request.requester_last}
                                    </h5>
                                    <p style={{float: 'right', marginBottom: 0, marginRight: 10}}>Needed by: {request.date}</p>
                                </div>
                                <div style={{display: 'inline-block', width: '100%'}}>
                                    <p style={{float: 'left', marginBottom: 0}}>Assignee: 
                                    {request.assignee ? <Badge style={{background: '#28a745', border: '1px solid #28a745', marginLeft: 8}} key={i} className='task-info'>{request.assignee}</Badge> : "No one assigned"}</p>
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
                            setCurrRequest={setCurrRequest}
                            mode={1}/>
        </>
    );
}