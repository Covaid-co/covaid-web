import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Pagination from '../components/Pagination';
import VolunteerDetails from './VolunteerDetails'
import { calcDistance } from '../Helpers';
import { formatName } from './OrganizationHelpers';
import { volunteer_status } from '../constants';

/**
 * Finding best matches for a request
 */

export default function BestMatches(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [sortedVolunteers, setSortedVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [allVolunteersInOrg, setAllVolunteersInOrg] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const volunteersPerPage = 5;
    const [isLoaded, setIsLoaded] = useState(false);
    const [looseMatch, setLooseMatch] = useState(false);
    const [viewedVolunteers, setViewedVolunteers] = useState([]);

    useEffect(() => {
        var temp_volunteers = []
        var nomatch_volunteers = [];
        var needed_resources = props.currRequest.request_info ? props.currRequest.request_info.resource_request : [];
        var tempAllVolunteers = [];

        props.volunteers.forEach(
            function(volunteer) { 
                var volunteer_resources = volunteer.offer.tasks;
                if (volunteer_resources.some(item => needed_resources.includes(item))) {
                    temp_volunteers.push(volunteer)
                } else {
                    nomatch_volunteers.push(volunteer);
                }
                tempAllVolunteers.push(volunteer);
            }
        );
        tempAllVolunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        })

        setAllVolunteersInOrg(tempAllVolunteers)
        temp_volunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        });
        nomatch_volunteers.sort(function(a, b) {
            return distance(a) - distance(b);
        })
        var allVolunteers = temp_volunteers.concat(nomatch_volunteers);
        setSortedVolunteers(allVolunteers);
        setViewedVolunteers(allVolunteers);
        setDisplayedVolunteers(allVolunteers.slice(0, volunteersPerPage));
        setIsLoaded(true);
    }, [props.currRequest]);

    const distance = (volunteer) => {
        const latA = volunteer.latitude;
        const longA = volunteer.longitude;
        const latB = props.currRequest.location_info.coordinates[1];
        const longB = props.currRequest.location_info.coordinates[0];
        const meters = calcDistance(latA, longA, latB, longB);
        const miles = meters * 0.00062137;
        return Math.round(miles * 100) / 100;
    }

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = viewedVolunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

    function resetState() {
        setTimeout(function () {
            setCurrentPage(1);
            setSortedVolunteers([]);
            setDisplayedVolunteers([]);
            setCurrVolunteer({});
            setIsLoaded(false);
        }, 500);
    }

    const closePage = () => {
        props.setTopMatchesModal(false);
        resetState();
    }

    // Display if volunteer was previously matched
    const displayPrevMatched = (volunteer) => {
        const volunteers = props.currRequest.status.volunteers;
        const found = volunteers.find(vol => {
            return volunteer._id === vol.volunteer && vol.current_status === volunteer_status.REJECTED;
        });

        if (found) {
            return <h5 id="association-name" style={{color: '#DB4B4B'}}>
                    Previously Matched
                </h5>
        }
        return <></>;
    }

    const switchVolunteers = () => {
        if (!looseMatch) {
            setDisplayedVolunteers(allVolunteersInOrg.slice(0, 5));
            setViewedVolunteers(allVolunteersInOrg);
        } else {
            setDisplayedVolunteers(sortedVolunteers.slice(0, 5));
            setViewedVolunteers(sortedVolunteers);
        }
        setLooseMatch(!looseMatch);
        setCurrentPage(1);
    }

    // Resource's that match between requester and volunteer
    const displayResourceMatch = (volunteer) => {
        return volunteer.offer.tasks.length === 0 ? 
            <Badge id='task-info' style={{background: '#AE2F2F'}}>
                No tasks entered
            </Badge> 
            : volunteer.offer.tasks.map((task, i) => {
                if (props.currRequest
                    && props.currRequest.request_info
                    && props.currRequest.request_info.resource_request.length > 0
                    &&  props.currRequest.request_info.resource_request.indexOf(task) !== -1) {
                    return <Badge key={i} style={{background: '#4CA846'}} id='task-info'>{task}</Badge>
                } else {
                    return <Badge key={i} style={{background: '#6C757D'}} id='task-info'>{task}</Badge>
                }
        })
    }

    if (!isLoaded) {
        return <></>;
    }
    return (
        <Modal show={props.topMatchesModal} size="lg" onHide={closePage} style = {{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>{formatName(props.currRequest.personal_info.requester_name)}'s Top Matches 
                    <Button id={looseMatch ? "notSelected" : "selected"} onClick={switchVolunteers} style={{marginLeft: 15, marginBottom: 8}}>
                        {looseMatch ? "Match on task" : "Match on task"}
                    </Button>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{marginTop: 0}}>
                    <Col xs={12}>
                        <ListGroup variant="flush">
                            {displayedVolunteers.map((volunteer, i) => {
                                if (volunteer.availability) {
                                return (
                                <ListGroup.Item key={i} action onClick={() => {setCurrVolunteer({...volunteer});  setVolunteerDetailsModal(true)}}>
                                    <div >
                                        <h5 id="volunteer-name" style={{marginBottom: 0}}>
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                        {displayPrevMatched(volunteer)}
                                    </div>
                                    <div>
                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                        <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                                            {distance(volunteer)} miles
                                        </p>
                                    </div>
                                    <div>
                                        {displayResourceMatch(volunteer)}
                                    </div>
                                </ListGroup.Item>);
                                }})}
                        </ListGroup>
                        <Pagination
                            className='justfiy-content-center'
                            style = {{paddingTop: 15, marginTop: 50}}
                            postsPerPage={volunteersPerPage}
                            currPage={currentPage}
                            totalPosts={Math.min(volunteersPerPage * 10, sortedVolunteers.length)}
                            paginate={paginatePage}/>
                    </Col>
                </Row>
                <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    { ... props }
                                    matching={true}/>
            </Modal.Body>
        </Modal>
    )
}

BestMatches.propTypes = {
    currRequest: PropTypes.object,
    topMatchesModal: PropTypes.bool,
    volunteers: PropTypes.array,
    setTopMatchesModal: PropTypes.func
};