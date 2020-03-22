import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'

export default function Offers(props) {
    const [lat, setLatitude] = useState(props.state.latitude);
    const [lng, setLongitude] = useState(props.state.longitude);
    const [value, setValue] = useState([0, 1, 2, 3, 4, 5]);
    const [users, setUsers] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const possibleTasks = ['Food', 'Health Care', 'Transportation',
    'Child Care', 'Pet Care', 'Storage', 'Emotional Support'];

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
        console.log(user);
        setModalInfo(user);
    }

    // const refreshOffers = (newLat, newLong) => {
    //     var url = "/api/users/all?";
    //     let params = {
    //         'latitude': newLat,
    //         'longitude': newLong
    //     }
    //     let query = Object.keys(params)
    //          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //          .join('&');
    //     url += query;

    //     async function fetchData() {
    //         const response = await fetch(url);
    //         response.json().then((data) => {
    //             setUsers(data);
    //             setDisplayedUsers(data);
    //         });
    //     }
    //     fetchData();
    // }

    useEffect(() => {
        var url = "/api/users/all?";
        const { latitude, longitude } = props.state;
        setLatitude(latitude);
        setLongitude(longitude);
        let params = {
            'latitude': lat,
            'longitude': lng
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
                setLoaded(true);
            });
        }
        fetchData();
    }, [props.state.latitude, props.state.longitude]);

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

    var phoneNumber;
    if (modalInfo.phone) {
        phoneNumber = <p><b>Phone:</b> {modalInfo.phone}</p>;
    } else {
        phoneNumber = <></>;
    }

    var message = <> </>;
    var tabs = <> </>
    if (loaded) {
        if (users.length == 0) {
            tabs = <></>
            message = <>
                    <ListGroup.Item>
                        <Row>
                            <Col>
                                <strong>Seems to be no offers in your area. Make sure to spread the word to get your community involved!</strong>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                </>
        } else {
            tabs = <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Row>
                            <Col style={{whiteSpace: 'nowrap'}}><strong>Who's offering?</strong></Col>
                            <Col ><strong>Offer</strong></Col>
                        </Row>
                    </ListGroup.Item>
                </ListGroup>
            message = <></>
        }
    }


    return (
        <div className="shadow p-3 mb-5 bg-white rounded">
            {/* <ToggleButtonGroup type="checkbox" className="btn-group d-flex flex-wrap" value={value} onChange={handleChange}>
                {possibleTasks.map((task, i) => {
                    return <ToggleButton style={buttonStyles} className="toggleButton" variant="outline-primary" size="sm" key = {i} value={i}>{task}</ToggleButton>
                })}
                
            </ToggleButtonGroup> */}
            <br />
            <Badge pill style = {{fontSize: 16, marginBottom: 5}} variant="primary" className="shadow">
                See who's helping in {props.state.locality}
            </Badge>{' '}
            <br />
            <div style = {{fontSize: 14, fontStyle:'italic'}}>
                Click on an offer below for more info
            </div>{' '}
            {tabs}
            <ListGroup variant="flush">
                {message}
                {displayedUsers.map((user) => {
                    var name = user.first_name + " " + user.last_name;

                    return <ListGroup.Item key={user._id} action 
                                            style = {{fontSize: 16}} 
                                            onClick={() => { handleShow(); setModal({...user});}}>
                            <Row>
                                <Col style={{whiteSpace: "normal"}}>
                                    <div style={{whiteSpace: "normal", wordWrap: "break-word"}}>{name}</div>
                                    <div style={{whiteSpace: "normal"}}>{user.offer.neighborhoods.map((neighborhood) => {
                                        return <><Badge key={user._id + neighborhood} style = {{whiteSpace: "normal"}} pill variant="warning">{neighborhood}</Badge>{' '}</>
                                    })}</div>
                                </Col>
                                <Col style={{whiteSpace: "normal"}}>{user.offer.tasks.map((task) => {
                                        return <><Badge key={user._id + task} style = {{whiteSpace: "normal"}} pill variant="primary">{task}</Badge>{' '}</>
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
                            return <><Badge key={modalInfo._id + task} pill variant="primary">{task}</Badge>{' '}</>
                        })}
                    </p>
                    <p><b>Name:</b> {modalInfo.first_name} {modalInfo.last_name}</p>
                    <p><b>Email:</b> {modalInfo.email}</p>
                    {phoneNumber}
                    <p><b>Details:</b> {modalInfo.offer.details}</p>
                    <p><b>Neighborhoods:</b>  {modalInfo.offer.neighborhoods.map((neighborhood) => {
                            return <><Badge key={modalInfo._id + neighborhood} pill variant="warning">{neighborhood}</Badge>{' '}</>
                        })}
                    </p>
                    
                </Modal.Body>
                <Modal.Footer><p style={{fontStyle: "italic"}}>Be sure to coordinate a safe drop-off! Follow <a href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html">CDC guidelines</a> on cleanliness and avoid as much contact as possible to prevent further spread of virus.</p></Modal.Footer>
            </Modal>
        </div>
    );
}