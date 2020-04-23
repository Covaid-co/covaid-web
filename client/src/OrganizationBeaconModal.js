import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import BeaconConfirmation from './BeaconConfirmation'
import AcceptedVolunteersModal from './AcceptedVolunteersModal';

const BeaconStatusEnum = {"active":1, "inactive":2, "complete":3, "delete": 4};


export default function OrganizationBeaconModal(props) {
    const [loaded, setLoaded] = useState(false);
    const [beacon, setBeacon] = useState({});
    const [association, setAssociation] = useState({});
    const [acceptedVolunteers, setAcceptedVolunteers] = useState([]);
    const [unacceptedVolunteers, setUnacceptedVolunteers] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showAcceptedVolunteers, setShowAcceptedVolunteers] = useState(false);
    const [confirmationType, setConfirmationType] = useState(0);
    
    const setVolunteers = (volunteers) => {
        setAcceptedVolunteers(volunteers.filter(volunteer => volunteer.response));
        setUnacceptedVolunteers(volunteers.filter(volunteer => !volunteer.response));
    }

    useEffect(() => {
        setLoaded(true);
        setBeacon(props.beacon);
        setAssociation(props.association);
        setVolunteers(props.volunteers ? props.volunteers : []);
     }, [props.beacon, props.association, props.volunteers]);

    if (!loaded) {
        return <></>
    }

    const formatDate = (beacon) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var start = new Date(beacon.beaconStartDate);
        var end = new Date(beacon.beaconEndDate);
        var startString = monthNames[start.getMonth()] + " " + start.getDate();
        var join = " - ";
        var endString = monthNames[end.getMonth()] + " " + end.getDate();

        if (startString === endString) {
            return startString;
        } else {
            return startString + join + endString;
        }
    }

    const showAcceptedVolunteersModal = () => {
        setShowAcceptedVolunteers(true);
    }

    const showDeactivateBeacon = () => {
        setShowConfirmationModal(true);
        props.setModalOpen(false);
        setConfirmationType('deactivate');
    }

    const showReactivateBeacon = () => {
        setShowConfirmationModal(true);
        props.setModalOpen(false);
        setConfirmationType('reactivate');
    }

    const move = (to, from) => {
        props.move(beacon, to, from);
    }

    const modeButton = (type) => {
        switch (type) {
            case 1:
                return (<Button id='large-button-empty' onClick={showDeactivateBeacon} style={{borderColor: '#DB4B4B', color: '#DB4B4B'}}>Deactivate Beacon</Button>)
                break;
            case 2:
                return (<Button id='large-button-empty' onClick={showReactivateBeacon} style={{borderColor: '#28a745', color: '#28a745'}}>Reactivate Beacon</Button>)
                break;
            default:
                return <></>;
        }
    }

    return (
        <>
        <Modal size="md" show={props.showBeaconModal} onHide={() => props.setModalOpen(false)} style={{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
        <Modal.Title>{beacon.beaconName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <h5 id="volunteer-name" style = {{marginTop: 0, marginBottom: 5}}>Your message:</h5>
                        <p id="regular-text" style={{marginBottom: 15, fontSize: 16}}>
                            "{beacon.beaconMessage}"
                        </p>
                        <h5 id="volunteer-name" style = {{marginTop: 0, marginBottom: 5}}>Duration</h5>
                        <p id="regular-text" style={{marginBottom: 20, fontSize: 16}}>
                            {formatDate(beacon)}
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <h5 id="volunteer-name" style = {{marginTop: 0, marginBottom: 5}}>Volunteer Responses:</h5>
                    <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    <ListGroup variant="flush" style={{overflowY: "scroll", height: 200}}>
                    {!acceptedVolunteers ? <></> :
                        acceptedVolunteers.map((volunteer, i) => {
                            return (
                                <ListGroup.Item key={i}>
                                    <div >
                                        <h5 id="volunteer-name">
                                            {volunteer.volunteer_first} {volunteer.volunteer_last} 
                                        </h5>
                                        <Badge style={{float: "right", marginTop: 2}} key={i} className='active-beacon'>Accepted</Badge>
                                        {
                                            volunteer.responseMessage && volunteer.responseMessage.length > 0 
                                            ? 
                                            <p id="regular-text" style={{marginBottom: 5, fontSize: 14}}>
                                                "{volunteer.responseMessage}"
                                            </p>
                                            :
                                            <></>
                                        }
                                    </div>
                                </ListGroup.Item>);
                            })}
                        {!unacceptedVolunteers ? <></> :
                        unacceptedVolunteers.map((volunteer, i) => {
                            return (
                                <ListGroup.Item key={i}>
                                    <div >
                                        <h5 id="volunteer-name">
                                            {volunteer.volunteer_first} {volunteer.volunteer_last} 
                                        </h5>
                                        <Badge style={{float: "right", marginTop: 2}} key={i} className='pending-task'>Not Accepted</Badge>
                                    </div>
                                </ListGroup.Item>);
                            })}
                        </ListGroup>
                        <p id="requestCall" style={{marginTop: -15, marginBottom: 0}}>&nbsp;</p>
                    </Col>
                </Row>
                <Row style={{marginTop: 15}}>
                    <Col>
                        <Button id='large-button' onClick={showAcceptedVolunteersModal}>View Accepted Volunteers</Button>
                    </Col>
                </Row>
                <Row style={{marginTop: 5}}>
                    <Col>
                        {modeButton(props.type)}
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
        <BeaconConfirmation 
            showModal={showConfirmationModal} 
            setShowConfirmationModal={setShowConfirmationModal}
            setOriginalModal={props.setModalOpen}
            beacon={beacon}
            move={move}
            confirmationType={confirmationType}
            />
        <AcceptedVolunteersModal
            showAcceptedVolunteers={showAcceptedVolunteers}
            acceptedVolunteers={acceptedVolunteers}
            showModal={showConfirmationModal} 
            setOriginalModal={props.setModalOpen}
            setShowAcceptedVolunteers={setShowAcceptedVolunteers}
        />
        </>
    );
}