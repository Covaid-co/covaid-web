import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from  'react-bootstrap/Dropdown'
import { sortReq, filterReq, formatName } from './OrganizationHelpers';
import { convertTime } from '../Helpers';

/*
 * All Requests component
 */

export default function OrgRequests(props) {
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [name, setName] = useState(false);
    const [need, setNeed] = useState(false);
    const [updated, setUpdated] = useState(true);
    const [posted, setPosted] = useState(true);
    const [foundQuery, setQuery] = useState('');
    const [lastPressed, setLastPressed] = useState('Last Updated');

    useEffect(() => {
        const filteredRequests = filterReq(foundQuery, props.requests);
        const sorted = sortReq('updated', filteredRequests, false, false, true, false);
        setFilteredRequests(sorted);
    }, [props.requests, foundQuery]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        setQuery(query);
        const filteredRequests = filterReq(query, props.requests);
        setFilteredRequests(filteredRequests);
    }

    const sortRequests = (type) => {
        const sortedRequests = sortReq(type, filteredRequests, name, need, updated, posted);
        if (type === 'name') {
            setLastPressed('Name');
            setName(!name);
        } else if (type === 'need') {
            setLastPressed('Needed By');
            setNeed(!need);
        } else if (type === 'updated') {
            setLastPressed('Last Updated');
            if (lastPressed !== 'Last Updated') {
                sortReq(type, filteredRequests, name, need, true, posted);
                setUpdated(true);
            } else {
                setUpdated(!updated);
            }
        } else {
            setLastPressed('Time Posted');
            if (lastPressed !== 'Time Posted') {
                sortReq(type, filteredRequests, name, need, updated, true);
                setPosted(true);
            } else {
                setPosted(!posted);
            }
        }
        setFilteredRequests(sortedRequests);
    }

    const resourceCompleteBadge = (request) => {
        var result = <></>;
        if (props.mode === 3) {
            if (request.status) {
                result = <Badge id='task-info' style={{backgroundColor: "#28a745", border: '1px solid #28a745'}}>
                        {request.status.reason ? request.status.reason : "No reason selected"}
                    </Badge>
            }
        } else {
            result = request.resource_request.map((task, i) => {
                return <Badge key={i} id='task-info'>{task}</Badge>
            })
        }
        return result;
    }

    const clickRequest = (request) => {
        props.setCurrRequest({...request}); 
        props.setRequestDetailsModal(true);
        props.setInRequest(true);
    }

    const sortInfo = (request) => {
        if (lastPressed === 'Last Updated') {
            if (request.last_modified) {
                const formatted = convertTime(request.last_modified);
                return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>Last Updated: {formatted}</p>
            } else {
                return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>Unread</p>
            }
        } else if (lastPressed === 'Time Posted') {
            if (request.time_posted) {
                const formatted = convertTime(request.time_posted);
                return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>Time Posted: {formatted}</p>
            } else {
                return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>No Time</p>
            }
        } else {
            return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>Needed by: {request.date}</p>
        }
    }

    const requestStatus = (request) => {
        if (request.volunteer_status === 'pending') {
            return <Badge className='pending-task'>Pending</Badge>;
        } else if (request.volunteer_status === 'accepted') {
            return <Badge className='in-progress-task'>In Progress</Badge>;
        } else if (props.mode === 2) {
            return <Badge className='no-match-task'>No Match</Badge>;
        } else {
            return <></>;
        }
    }

    return (
        <Row>
            <Col xs={8}>
                <Form>
                    <Form.Group bssize="large">
                        <Form.Control id="filter-requests" placeholder="Search by First/Last name, Assignee or task" onChange={filterRequests}/>
                    </Form.Group>
                </Form>
            </Col>
            <Col xs={4} style={{paddingLeft: 0}}>
                <Dropdown drop='up'>
                    <Dropdown.Toggle id="dropdown-basic" className='dropdown-sort'>
                        {lastPressed}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{width: '100%'}}>
                        <Dropdown.Item onClick={()=>sortRequests('name')}>Name</Dropdown.Item>
                        <Dropdown.Item onClick={()=>sortRequests('need')}>Needed By</Dropdown.Item>
                        <Dropdown.Item onClick={()=>sortRequests('updated')}>Last Updated</Dropdown.Item>
                        <Dropdown.Item onClick={()=>sortRequests('posted')}>Time Posted</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col xs={12}>
                <p id="requestCall" style={{marginTop: 5, marginBottom: 0}}></p>
            </Col>
            <Col xs={12} id="col-scroll">
                <ListGroup variant="flush">
                    {filteredRequests.map((request, i) => {
                        return (
                            <ListGroup.Item key={i} action onClick={() => {clickRequest(request)}}>
                                <div >
                                    <h5 id="volunteer-name">
                                        {formatName(request.requester_first, request.requester_last)}
                                    </h5>
                                    {sortInfo(request)}
                                </div>
                                <div>{resourceCompleteBadge(request)} {requestStatus(request)}</div>
                                <div style={{display: 'inline-block', width: '100%', marginTop: 3, fontFamily: 'Inter'}}>
                                    <p style={{float: 'left', marginBottom: 0}}>Tracking: 
                                        <font style={request.assignee && request.assignee !== 'No one assigned' ? {color: '#2670FF'} : {color: '#EF6315'}}> {request.assignee ? request.assignee : "No one assigned"}
                                        </font>
                                    </p>
                                </div>
                            </ListGroup.Item>);
                        })}
                </ListGroup>
            </Col>
        </Row>
    );
}

OrgRequests.propTypes = {
    setCurrRequest: PropTypes.func,
    setRequestDetailsModal: PropTypes.func,
    setInRequest: PropTypes.func,
    requests: PropTypes.array,
    mode: PropTypes.number
};