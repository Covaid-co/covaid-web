import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function Offers(props) {
    const [offers, setOffers] = useState([]);
    const [modalInfo, setModalInfo] = useState({});
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function setModal(offer) {
        console.log(offer);
        setModalInfo(offer);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/offers');
            response.json().then((data) => {
                setOffers(data);
            });
        }
        fetchData();
    }, []);

    const generateTasks = (tasks) => {
        var res = tasks[0]
        for (var i = 1; i < tasks.length; i++) {
            res += ', '
            res += tasks[i];
        }
        return res;
    }

    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col>Task</Col>
                        <Col>Neighborhood</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {offers.map((offer) => {
                    return <ListGroup.Item key={offer._id} action 
                                            style = {{fontSize: 12}} 
                                            onClick={() => { handleShow(); setModal({...offer});}}>
                            <Row>
                                <Col>{generateTasks(offer.task)}</Col>
                                <Col>{generateTasks(offer.neighborhoods)}</Col>
                            </Row>
                        </ListGroup.Item>
                })}
            </ListGroup>
            <Modal show={show} onHide={handleClose} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Food Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Task: {modalInfo.task}</p>
                    <p>Name: Bobby Lee</p>
                    <p>Contact: lijeffrey39@gmail.com</p>
                    <p>Details: {modalInfo.description}</p>
                    <p>Neighborhoods: {modalInfo.neighborhoods}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {/* <Button variant="primary" href="sms://4846249881">>
                        Contact Now!
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    );
}