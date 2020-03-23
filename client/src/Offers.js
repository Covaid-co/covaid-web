import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'

export default function Offers(props) {
    const [lat, setLatitude] = useState(props.state.latitude);
    const [lng, setLongitude] = useState(props.state.longitude);
    const [filterValue, setFilterValue] = useState('');
    const [users, setUsers] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const possibleTasks = ['Food/Groceries', 'Health', 'Child/Petcare',
                           'Transportation', 'Social Services', 'Donate', 'Misc.'];

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
        
        setLatitude(lat);
        setLongitude(lng);
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
    }, [lat, lng]);

    // const handleChange = (val) => {
    //     setValue(val);
    //     const selectedTasks = [];
    //     for (var i = 0; i < val.length; i++) {
    //         selectedTasks.push(possibleTasks[val[i]]);
    //     }
    //     const result = users.filter(user => selectedTasks.some(v => user.offer.tasks.indexOf(v) !== -1));
    //     setDisplayedUsers(result);
    // };


    const searchWithinList = (list, value) => {
        for (var i = 0; i < list.length; i++) {
            const filterOption = list[i].toLowerCase();
            var useValue = true;
            for (var j = 0; j < Math.min(filterOption.length, value.length); j++) {
                if (filterOption[j] !== value[j]) {
                    useValue = false;
                }
            }
            if (useValue && value.length <= list[i].length) {
                return true;
            }
        }
        return false;
    }


    const handleFilterChange = (e) => {
        setFilterValue(e.target.value);
        const val = e.target.value.toLowerCase();
        if (val === '') {
            setDisplayedUsers(users);
        }

        const result = users.filter((user) => {
            // Search for name
            const name = user.first_name + ' ' + user.last_name;
            var useVal = true;
            for (var j = 0; j < Math.min(name.length, val.length); j++) {
                if (name[j].toLowerCase() !== val[j]) {
                    useVal = false;
                }
            }
            if (useVal && val.length <= name.length) {
                return true;
            }
            
            const userNeighborhoods = user.offer.neighborhoods;
            const userTasks = JSON.parse(JSON.stringify(user.offer.tasks));
            if (userTasks.includes('Food/Groceries')) {
                userTasks.push('food');
                userTasks.push('groceries');
            }
            if (userTasks.includes('Child/Petcare')) {
                userTasks.push('childcare');
                userTasks.push('child care');
                userTasks.push('petcare');
                userTasks.push('pet care');
            }
            if (searchWithinList(userNeighborhoods, val) ||
                searchWithinList(userTasks, val)) {
                return true;
            }

            return false;
        });
        setDisplayedUsers(result);
    };

    // let buttonStyles = {
    //     border: '0.5px solid #DADDE1',
    // }

    var phoneNumber;
    if (modalInfo.phone) {
        phoneNumber = <p><b>Phone:</b> {modalInfo.phone}</p>;
    } else {
        phoneNumber = <></>;
    }

    var message = <> </>;
    var tabs = <> </>
    if (loaded) {
        if (users.length === 0) {
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

    var localityText = "your area"
    if (props.state.locality && props.state.locality.length > 0) {
        localityText = props.state.locality
    }

    return (
        <div className="shadow mb-5 bg-white rounded" 
            style = {{paddingLeft: '1rem', 
                      paddingRight: '1rem', 
                      paddingBottom: '1rem'}}>
            {/* <ToggleButtonGroup type="checkbox" className="btn-group d-flex flex-wrap" value={value} onChange={handleChange}>
                {possibleTasks.map((task, i) => {
                    return <ToggleButton style={buttonStyles} className="toggleButton" variant="outline-primary" size="sm" key = {i} value={i}>{task}</ToggleButton>
                })}
                
            </ToggleButtonGroup> */}
            <br />
            <Badge pill style = {{fontSize: 16, whiteSpace:"normal", marginBottom: 5, marginTop: -13}} variant="warning" className="shadow">
                See who's helping in {localityText}
            </Badge>{' '}
            <br />
            <div style = {{fontSize: 14, fontStyle:'italic', marginTop: 5}}>
                Click on an offer below for more info
            </div>{' '}
            <Form 
                style={{marginTop: "10px",
                        display: "block-inline", 
                        whiteSpace: 'nowrap',
                        maxWidth: 250,
                        marginLeft: 'auto',
                        marginRight: 'auto'}}>
                <FormControl 
                    type="text" 
                    value={filterValue} 
                    onChange={handleFilterChange}
                    placeholder="Filter by offer or neighborhood" 
                    className="mr-sm-2" />
            </Form>
            {tabs}
            <ListGroup variant="flush">
                {message}
                {displayedUsers.map((user, i) => {
                    var name = user.first_name + " " + user.last_name;

                    return <ListGroup.Item key={user._id + String(i * 19)} action 
                                            style = {{fontSize: 16}} 
                                            onClick={() => { handleShow(); setModal({...user});}}>
                            <Row>
                                <Col style={{whiteSpace: "normal"}}>
                                    <div style={{whiteSpace: "normal", wordWrap: "break-word"}}>{name}</div>
                                    <div style={{whiteSpace: "normal"}}>{user.offer.neighborhoods.map((neighborhood, i) => {
                                        return <><Badge key={user._id + neighborhood + String(i * 14)} style = {{whiteSpace: "normal"}} pill variant="warning">{neighborhood}</Badge>{' '}</>
                                    })}</div>
                                </Col>
                                <Col style={{whiteSpace: "normal"}}>{user.offer.tasks.map((task, i) => {
                                        return <><Badge key={user._id + task + String((i + 1) * 23)} style = {{whiteSpace: "normal"}} pill variant="primary">{task}</Badge>{' '}</>
                                    })}</Col>
                            </Row>
                        </ListGroup.Item>
                })}
            </ListGroup>
            <Modal show={show} onHide={handleClose} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>{modalInfo.first_name} {modalInfo.last_name}'s Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>Tasks:</b>  {modalInfo.offer.tasks.map((task, i) => {
                            return <><Badge key={modalInfo._id + task + String((i + 1) * 11)} pill variant="primary">{task}</Badge>{' '}</>
                        })}
                    </p>
                    {/* <p><b>Name:</b> {modalInfo.first_name} {modalInfo.last_name}</p> */}
                    <p><b>Email:</b> {modalInfo.email}</p>
                    {phoneNumber}
                    <p><b>Details:</b> {modalInfo.offer.details}</p>
                    <p style= {{marginBottom: -3}}><b>Neighborhoods:</b>  {modalInfo.offer.neighborhoods.map((neighborhood, i) => {
                            return <><Badge key={modalInfo._id + neighborhood + String((i + 1) * 20)} pill variant="warning">{neighborhood}</Badge>{' '}</>
                        })}
                    </p>
                    
                </Modal.Body>
                <Modal.Footer><p style={{fontStyle: "italic"}}>Be sure to coordinate a safe drop-off/interaction! Follow <a target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html">CDC guidelines</a> on cleanliness and avoid as much contact as possible to prevent further spread of virus.</p></Modal.Footer>
            </Modal>
        </div>
    );
}