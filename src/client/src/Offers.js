import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default function Offers(props) {
    const [users, setUsers] = useState([]);
    const [modalInfo, setModalInfo] = useState({
        'first_name': '',
        'last_name': '',
        'email': '',
        'offer': {
            'tasks': [''],
            'details': '',
            'neighborhoods': ['']
        }
    });
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function setModal(user) {
        setModalInfo(user);
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/users/all');
            response.json().then((data) => {
                setUsers(data);
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
                        <Col>Tasks</Col>
                        <Col>Neighborhoods</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {users.map((user) => {
                    return <ListGroup.Item key={user._id} action 
                                            style = {{fontSize: 12}} 
                                            onClick={() => { handleShow(); setModal({...user});}}>
                            <Row>
                                <Col>{generateTasks(user.offer.tasks)}</Col>
                                <Col>{generateTasks(user.offer.neighborhoods)}</Col>
                            </Row>
                        </ListGroup.Item>
                })}
            </ListGroup>
            <Modal show={show} onHide={handleClose} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Food Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Tasks: {modalInfo.offer.tasks}</p>
                    <p>Name: {modalInfo.first_name} {modalInfo.last_name}</p>
                    <p>Contact: {modalInfo.email}</p>
                    <p>Details: {modalInfo.offer.details}</p>
                    <p>Neighborhoods: {modalInfo.offer.neighborhoods}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" href="sms://4846249881">>
                        Contact Now!
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}