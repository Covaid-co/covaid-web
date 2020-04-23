import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'


export default function OrganizationBeaconModal(props) {
    const [loaded, setLoaded] = useState(false);
    const [beacon, setBeacon] = useState({});
    const [association, setAssociation] = useState({});

    useEffect(() => {
        setLoaded(true);
        setBeacon(props.beacon);
        setAssociation(props.association);
     }, [props.beacon, props.association]);

    if (!loaded) {
        return <></>
    }

    return (
        <Modal size="lg" show={props.showBeaconModal} onHide={() => props.setModalOpen(false)} style={{marginTop: 10, paddingBottom: 40}}>
            <Modal.Header closeButton>
        <Modal.Title>{beacon.beaconName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}