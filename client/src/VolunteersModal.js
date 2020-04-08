import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import VolunteerDetails from './VolunteerDetails'

export default function VolunteersModal(props) {

    const [volunteerDetailModal, setVolunteerDetailsModal] = useState(false);
    const [currVolunteer, setCurrVolunteer] = useState({});
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(() => {
        console.log(props.volunteers)
        setFilteredRequests(props.volunteers);
    }, [props.volunteers]);

    const filterRequests = (e) => {
        var query = e.target.value.toLowerCase();
        var filtered = JSON.parse(JSON.stringify(props.volunteers));
        if (!(!query || query === "")) {
            filtered = filtered.filter(volunteer => {
                var firstNameMatch = String(volunteer.first_name.toLowerCase()).startsWith(query);
                var lastNameMatch = volunteer.last_name ? String(volunteer.last_name.toLowerCase()).startsWith(query) : false;
                return firstNameMatch || lastNameMatch;
            });
        }
        setFilteredRequests(filtered);
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
                            <Form.Group controlId="zip" bssize="large">
                                <Form.Control placeholder="Search for a volunteer" onChange={filterRequests}/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={12}>
                        <p id="requestCall" style={{marginTop: 10, marginBottom: 0}}></p>
                    </Col>
                    <Col xs={12}>
                        <ListGroup variant="flush">
                            {filteredRequests.map((volunteer, i) => {
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
                                  currVolunteer={currVolunteer}/>
            </Modal.Body>
        </Modal>
    );
}