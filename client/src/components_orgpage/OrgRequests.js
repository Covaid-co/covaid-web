import React, { useState, useEffect } from "react";
import ListGroup from 'react-bootstrap/ListGroup'
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Dropdown from  'react-bootstrap/Dropdown'
import { sortReq, filterReq, formatName, isInProgress } from './OrganizationHelpers';
import { convertTime } from '../Helpers';
import { sort_types, current_tab } from '../constants';

/*
 * All Requests component
 */

export default function OrgRequests(props) {
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [foundQuery, setQuery] = useState('');
    const [sortType, setSortType] = useState('Last Updated');

    useEffect(() => {
        const filteredRequests = filterReq(foundQuery, props.requests);
        const sorted_requests = sortReq(sortType, filteredRequests);
        setFilteredRequests(sorted_requests);
    }, [props.requests, foundQuery]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        setQuery(query);
        const filteredRequests = filterReq(query, props.requests);
        setFilteredRequests(filteredRequests);
    }

    const sortRequests = (type) => {
        setSortType(type);
        const sorted_requests = sortReq(type, filteredRequests);
        setFilteredRequests(sorted_requests);
    }

    const displayBadges = (request) => {
        // Completed Tab only
        if (props.mode === 3) {
            return <Badge id='task-info' style={{backgroundColor: "#28a745", border: '1px solid #28a745'}}>
                        {request.status.completed_reason ? request.status.completed_reason : "No reason selected"}
                </Badge>
        }
        return request.request_info.resource_request.map((task, i) => {
            return <Badge key={i} id='task-info'>{task}</Badge>
        });
    }

    const clickRequest = (request) => {
        props.setCurrRequest({...request}); 
        props.setRequestDetailsModal(true);
        props.setInRequest(true);
    }

    // Text displayed based on sort type
    const sortInfo = (request) => {
        var formatted_time = request.request_info.date;
        var temp_sortType = sortType;
        if (temp_sortType === 'Last Updated') {
            formatted_time = convertTime(request.admin_info.last_modified);
        } else if (temp_sortType === 'Time Posted') {
            formatted_time = convertTime(request.time_posted);
        } else {
            temp_sortType = 'Needed by';
        }
        return <p id="regular-text" style={{float: 'right', marginBottom: 0, marginRight: 10}}>
            {temp_sortType}: {formatted_time}</p>
    }

    // Admin Tracking Text
    const displayAdmin = (request) => {
        return <p style={{float: 'left', marginBottom: 0}}>Tracking: 
            <font style={request.admin_info.assignee !== 'No one assigned' ? {color: '#2670FF'} : {color: '#EF6315'}}> {request.admin_info.assignee}
            </font>
        </p>
    }

    // Request status 
    const requestStatus = (request) => {
        if (props.mode === current_tab.MATCHED) {
            const in_progress = isInProgress(request);
            if (in_progress) {
                return <Badge className='in-progress-task' style={{marginRight: 8}}>In Progress</Badge>;
            } else {
                return <Badge className='pending-task' style={{marginRight: 8}}>Pending</Badge>;
            }
        } else {
            return <></>;
        }
    }

    // Possible dropdown names
    const displayDropdownItems = () => {
        return sort_types.map((type, i) => {return <Dropdown.Item key={i} onClick={()=>sortRequests(type)}>{type}</Dropdown.Item>})
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
                        {sortType}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{width: '100%'}}>
                        {displayDropdownItems()}
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
                                <div>
                                    <h5 id="volunteer-name">
                                        {formatName(request.personal_info.requester_name)}
                                    </h5>
                                    {sortInfo(request)}
                                </div>
                                <div>{displayBadges(request)} {requestStatus(request)}</div>
                                <div style={{display: 'inline-block', width: '100%', marginTop: 3, fontFamily: 'Inter'}}>
                                    {displayAdmin(request)}
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