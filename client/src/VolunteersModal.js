import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import VolunteerDetails from './VolunteerDetails'
import { filterVolunteers } from './OrganizationHelpers';

export default function VolunteersModal(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);

    useEffect(() => {
        console.log(props.volunteers)
        setFilteredVolunteers(props.volunteers);
    }, [props.volunteers]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        const filteredVolunteers = filterVolunteers(query, props.volunteers);
        setFilteredVolunteers(filteredVolunteers);
    }

    return (
        <Modal show={props.volunteersModal} onHide={() => props.setVolunteersModal(false)} style = {{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
                <Modal.Title>All Volunteers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xs={12}>
                        <Form>
                            <div>
                                {props.association.resources ? props.association.resources.map((task, i) => {
                                    return <Button style={{paddingTop: 2}} key={i} className='resource-button'>{task}</Button>
                                }) : <></>}
                            </div>
                            <Form.Group controlId="zip" bssize="large" style={{marginTop: 10}}>
                                <Form.Control placeholder="Search for a volunteer, tasks, or location" onChange={filterRequests}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <p id="requestCall" style={{marginTop: 0, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                    <Col xs={12}>
                        <ListGroup variant="flush">
                            {filteredVolunteers.map((volunteer, i) => {
                                return (
                                <ListGroup.Item key={i} action onClick={() => {
                                        setCurrVolunteer({...volunteer}); 
                                        setVolunteerDetailsModal(true);
                                        // props.setVolunteersModal(false);
                                    }}>
                                    <div >
                                        <h5 className="volunteer-name">
                                            {volunteer.first_name} {volunteer.last_name}
                                        </h5>
                                    </div>
                                    <div>
                                        {volunteer.offer.tasks.map((task, i) => {
                                            return <Badge key={i} className='task-info'>{task}</Badge>
                                        })}
                                    </div>
                                    <p style={{float: 'left', marginBottom: 0, marginTop: -2}}>
                                        {volunteer.offer.neighborhoods.join(', ')}
                                    </p>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                    </Col>
                </Row>
                <VolunteerDetails volunteerDetailModal={volunteerDetailModal}
                                  setVolunteerDetailsModal={setVolunteerDetailsModal}
                                  setVolunteersModal={props.setVolunteersModal}
                                  currVolunteer={currVolunteer}
                                  preVerify={props.preVerify}/>
            </Modal.Body>
        </Modal>
    );
}