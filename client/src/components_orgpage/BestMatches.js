import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import ListGroup from 'react-bootstrap/ListGroup'
import VolunteerDetails from './VolunteerDetails'
import { calcDistance } from '../Helpers';
import Pagination from '../CommunityBulletinComponents/Pagination'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BestMatches(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [sortedVolunteers, setSortedVolunteers] = useState([]);
    const [displayedVolunteers, setDisplayedVolunteers] = useState([]);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const volunteersPerPage = 5;
    const [currRequest, setCurrRequest] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setCurrRequest(props.currRequest);
        var temp_volunteers = []
        var nomatch_volunteers = [];
        var needed_resources = props.currRequest.resource_request ? props.currRequest.resource_request : []
        props.volunteers.forEach(
            function(volunteer) { 
                var volunteer_resources = volunteer.offer.tasks;
                if (volunteer_resources.some(item => needed_resources.includes(item))) {
                    temp_volunteers.push(volunteer)
                } else {
                    nomatch_volunteers.push(volunteer);
                }
            }
        );
        temp_volunteers.sort(function(a, b) {
            return distance(a) - distance(b)
        });
        nomatch_volunteers.sort(function(a, b) {
            return distance(a) - distance(b);
        })
        var allVolunteers = temp_volunteers.concat(nomatch_volunteers);
        setSortedVolunteers(allVolunteers);
        setDisplayedVolunteers(allVolunteers.slice(0, volunteersPerPage));
        setIsLoaded(true);
    }, [props.currRequest]);

    const distance = (volunteer) => {
        const latA = volunteer.latitude;
        const longA = volunteer.longitude;
        const latB = props.currRequest.latitude;
        const longB = props.currRequest.longitude;
        const meters = calcDistance(latA, longA, latB, longB);
        const miles = meters * 0.00062137;
        return Math.round(miles * 100) / 100;
    }

    const paginatePage = (pageNumber) => {
        setCurrentPage(pageNumber);
        const lastIndex = pageNumber * volunteersPerPage;
        const firstIndex = lastIndex - volunteersPerPage;
        const slicedVolunteers = sortedVolunteers.slice(firstIndex, lastIndex);
        setDisplayedVolunteers(slicedVolunteers);
    }

    function resetState() {
        setTimeout(function () {
            setCurrentPage(1);
            setSortedVolunteers([]);
            setDisplayedVolunteers([]);
            setCurrVolunteer({});
            setCurrRequest({});
            setIsLoaded(false);
        }, 500);
    }

    const closePage = () => {
        props.setTopMatchesModal(false);
        resetState();
    }
    
    if (!isLoaded) {
        return <></>;
    }
    return (
        <Modal show={props.topMatchesModal} size="lg" onHide={closePage} style = {{marginTop: 40, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title id="small-header">{currRequest.requester_first}'s Top Matches</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{marginTop: -9}}>
                    <Col xs={12}>
                        <ListGroup variant="flush" onClick={() => {setVolunteerDetailsModal(true)}}>
                            {displayedVolunteers.map((volunteer, i) => {
                                return (
                                <ListGroup.Item key={i} action onClick={() => {setCurrVolunteer({...volunteer});  setVolunteerDetailsModal(true)}}>
                                    <div >
                                        <h5 id="volunteer-name" style={{marginBottom: 0}}>
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                    </div>
                                    <div>
                                        <p id="volunteer-location">{volunteer.offer.neighborhoods.join(', ')}</p>
                                        <p id="volunteer-location" style={{float: 'right', marginTop: -25, marginRight: 10}}>
                                            {distance(volunteer)} miles
                                        </p>
                                    </div>
                                    <div>
                                        {volunteer.offer.tasks.length === 0 ? 
                                            <Badge id='task-info' style={{background: '#AE2F2F'}}>
                                                No tasks entered
                                            </Badge> 
                                            : volunteer.offer.tasks.map((task, i) => {
                                                if (currRequest && currRequest.resource_request && currRequest.resource_request.length > 0 && currRequest.resource_request.indexOf(task) !== -1) {
                                                    return <Badge key={i} style={{background: '#4CA846'}} id='task-info'>{task}</Badge>
                                                } else {
                                                    return <Badge key={i} style={{background: '#6C757D'}} id='task-info'>{task}</Badge>
                                                }
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
                            totalPosts={Math.min(volunteersPerPage * 10, sortedVolunteers.length)}
                            paginate={paginatePage}/>
                    </Col>
                </Row>
                <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                    setVolunteerDetailsModal={setVolunteerDetailsModal}
                                    currVolunteer={currVolunteer}
                                    currRequest={currRequest}
                                    setCurrRequest={props.setCurrRequest}
                                    setTopMatchesModal={props.setTopMatchesModal}
                                    setRequestDetailsModal={props.setRequestDetailsModal}
                                    unmatched={props.unmatched}
                                    matched={props.matched}
                                    setUnmatched={props.setUnmatched}
                                    setMatched={props.setMatched}
                                    matching={true}/>
            </Modal.Body>
        </Modal>
    )
}
