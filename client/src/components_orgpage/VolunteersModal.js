import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

import { filterVolunteers } from './OrganizationHelpers';
import { extractTrueObj } from '../Helpers';
import Pagination from '../components/Pagination'

export default function VolunteersModal(props) {
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [resourcesSelected, setResourcesSelected] = useState([]);
    const [noTasks, setNoTasks] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [currQuery, setQuery] = useState('');
    const volunteersPerPage = 5;

    useEffect(() => {
        setFilteredVolunteers(props.volunteers);
        setDisplayedVolunteers(props.volunteers.slice(0, volunteersPerPage));
        if (props.association.resources) {
            var tempResourceSelected = {};
            for (var i = 0; i < props.association.resources.length; i++) {
                tempResourceSelected[props.association.resources[i]] = false;
            }
            setResourcesSelected(tempResourceSelected);
        }
     }, [props.volunteers, props.association]);

    const filterRequests = (e) => {
        e.preventDefault();
        e.stopPropagation();
        var query = e.target.value.toLowerCase();
        setQuery(query);
        const filteredVolunteers = filterVolunteers(query, props.volunteers);
        setFilteredVolunteers(filteredVolunteers);
        setDisplayedVolunteers(filteredVolunteers.slice(0, volunteersPerPage));
    }

    const handleChangeResource = (resource) => { 
        const newResource = { 
            ...resourcesSelected, 
            [resource]: !resourcesSelected[resource]
        }
        setResourcesSelected(newResource);

        const selectedResourcees = extractTrueObj(newResource);
        if (selectedResourcees.length === 0) {
            setFilteredVolunteers(props.volunteers);
            setDisplayedVolunteers(props.volunteers.slice(0, volunteersPerPage));
            return;
        }
        var result = [];
        if (currQuery !== '') {
            result = filteredVolunteers.filter(user => selectedResourcees.some(v => user.offer.tasks.indexOf(v) !== -1));
        } else {
            result = props.volunteers.filter(user => selectedResourcees.every(v => user.offer.tasks.indexOf(v) !== -1));
        }
        setFilteredVolunteers(result);
        setDisplayedVolunteers(result.slice(0, volunteersPerPage));
    }

    const handleNoTaskChange = () => {
        var result = [];
        const selectedResourcees = extractTrueObj(resourcesSelected);
        if (!noTasks) {
            result = props.volunteers.filter(user => user.offer.tasks.length === 0);
        } else {
            result = props.volunteers.filter(user => selectedResourcees.every(v => user.offer.tasks.indexOf(v) !== -1));
        }
        setFilteredVolunteers(result);
        setDisplayedVolunteers(result.slice(0, volunteersPerPage));
        setNoTasks(!noTasks);
    }

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = filteredVolunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

    const volunteerLocation = (volunteer) => {
        var result = '';
        if (volunteer.offer.neighborhoods.length > 0) {
            result = volunteer.offer.neighborhoods[0];
        }
        if (volunteer.offer.state) {
            result += (', ' + volunteer.offer.state);
        }
        return result;
    }

    return (
        <Modal show={props.volunteersModal} onHide={() => {props.setVolunteersModal(false); props.setInVolunteer(false)}} style={{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>All Volunteers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Form>
                            <div style={{marginTop: -5}}>
                                {Object.keys(resourcesSelected).map((resource, i) => {
                                    return <Button key={i} onClick = {() => handleChangeResource(resource)}
                                                   id={resourcesSelected[resource] ? 'selected' : 'notSelected'}>
                                                {resource}
                                            </Button>
                                })}
                                <Button key={10} onClick = {handleNoTaskChange} id={noTasks ? 'selected' : 'notSelected'} 
                                        style={noTasks ? {backgroundColor: '#AE2F2F', color: 'white', border: '1px solid #AE2F2F'} : 
                                            {backgroundColor: 'transparent', color: '#AE2F2F', border: '1px solid #AE2F2F'}}>
                                    No Tasks
                                </Button>
                            </div>
                            <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                                <Form.Control placeholder="Search by a volunteer or location" onChange={filterRequests}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs={12}>
                        <ListGroup variant="flush">
                            {displayedVolunteers.map((volunteer, i) => {
                                return (
                                <ListGroup.Item key={i} action onClick={() => {
                                            props.setCurrVolunteer({...volunteer}); 
                                            props.setVolunteerDetailsModal(true);
                                            props.setVolunteersModal(false);
                                            props.setInVolunteer(true)}}>
                                    <div>
                                        <h5 id="volunteer-name">
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                    </div>
                                    <p id="volunteer-location">{volunteerLocation(volunteer)}</p>
                                    <div>
                                        {volunteer.offer.tasks.length === 0 ? 
                                            <Badge id='task-info' style={{background: '#AE2F2F', border: '1px solid #AE2F2F'}}>
                                                No tasks entered
                                            </Badge> 
                                            : volunteer.offer.tasks.map((task, i) => {
                                            return <Badge key={i} id='task-info'>{task}</Badge>
                                        })}
                                    </div>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                        <Pagination
                            className='justfiy-content-center'
                            style = {{paddingTop: 15, marginTop: 50}}
                            postsPerPage={volunteersPerPage}
                            currPage={currentPage}
                            totalPosts={Math.min(volunteersPerPage * 10, filteredVolunteers.length)}
                            paginate={paginatePage}/>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}