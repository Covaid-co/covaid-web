import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

export default function Offers(props) {
    const [value, setValue] = useState([0, 1, 2, 3, 4, 5]);
    const [users, setUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const possibleTasks = ['Groceries', 'Medicine/Health Care', 'Transportation',
    'Pet Care', 'Child Care', 'Virtual Meetup'];

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
        var url = "/api/users/all?";
        const { latitude, longitude } = props.state;
        let params = {
            'latitude': latitude,
            'longitude': longitude
        }
        let query = Object.keys(params)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
             .join('&');
        url += query;

        async function fetchData() {
            const response = await fetch(url);
            response.json().then((data) => {
                setUsers(data);
                setDisplayedUsers(data);
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

    const handleChange = (val) => {
        setValue(val);
        const selectedTasks = [];
        for (var i = 0; i < val.length; i++) {
            selectedTasks.push(possibleTasks[val[i]]);
        }
        const result = users.filter(user => selectedTasks.some(v => user.offer.tasks.indexOf(v) !== -1));
        setDisplayedUsers(result);
    };

    let buttonStyles = {
        border: '0.5px solid #DADDE1',
    }

    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            <ToggleButtonGroup type="checkbox" className="btn-group d-flex flex-wrap" value={value} onChange={handleChange}>
                {possibleTasks.map((task, i) => {
                    return <ToggleButton style={buttonStyles} className="toggleButton" variant="outline-primary" size="sm" key = {i} value={i}>{task}</ToggleButton>
                })}
            </ToggleButtonGroup>
            <ListGroup variant="flush">
                <ListGroup.Item>
                    <Row>
                        <Col style={{whiteSpace: 'nowrap'}}>Who's offering?</Col>
                        <Col>Task</Col>
                        <Col>Locality</Col>
                    </Row>
                </ListGroup.Item>
            </ListGroup>
            <ListGroup variant="flush">
                {displayedUsers.map((user) => {
                    return <ListGroup.Item key={user._id} action 
                                            style = {{fontSize: 16}} 
                                            onClick={() => { handleShow(); setModal({...user});}}>
                            <Row>
                                <Col>{user.first_name} {user.last_name}</Col>
                                <Col>{user.offer.tasks.map((task) => {
                                        return <><Badge pill variant="primary">{task}</Badge>{' '}</>
                                    })}</Col>
                                <Col>{user.offer.neighborhoods.map((neighborhood) => {
                                        return <><Badge pill variant="warning">{neighborhood}</Badge>{' '}</>
                                    })}</Col>
                            </Row>
                        </ListGroup.Item>
                })}
            </ListGroup>
            <Modal show={show} onHide={handleClose} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>Tasks:</b>  {modalInfo.offer.tasks.map((task) => {
                            return <><Badge pill variant="primary">{task}</Badge>{' '}</>
                        })}
                    </p>
                    <p><b>Name:</b> {modalInfo.first_name} {modalInfo.last_name}</p>
                    <p><b>Contact:</b> {modalInfo.email}</p>
                    <p><b>Details:</b> {modalInfo.offer.details}</p>
                    <p><b>Neighborhoods:</b>  {modalInfo.offer.neighborhoods.map((neighborhood) => {
                            return <><Badge pill variant="warning">{neighborhood}</Badge>{' '}</>
                        })}
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    );
}