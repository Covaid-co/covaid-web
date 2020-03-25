import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useFormFields } from "./libs/hooksLib";

import ListGroup from 'react-bootstrap/ListGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import Toast from 'react-bootstrap/Toast'

import Offer from './CommunityBulletinComponents/Offer'
import Pagination from './CommunityBulletinComponents/Pagination'


export default function Offers(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: "",
        email: "",
        phone: ""
    });

    const [showOffer, setShowOffer] = useState(false);
    const [showRequestHelp, setShowRequestHelp] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showCompletedToast, setShowCompletedToast] = useState(false);

    const [lat, setLatitude] = useState(props.state.latitude);
    const [lng, setLongitude] = useState(props.state.longitude);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(6);
    const [loaded, setLoaded] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [taskSelect, setTaskSelect] = useState({});
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const possibleTasks = ['Food/Groceries', 'Medication', 'Donate',
                            'Emotional Support', 'Misc.'];

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

    const handleClose = () => setShowOffer(false);
    const handleShow = () => setShowOffer(true);

    const handleCloseRequest = () => setShowRequestHelp(false);
    const handleShowRequest = () => setShowRequestHelp(true);

    function setModal(user) {
        console.log(user);
        setModalInfo(user);
    }

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

        for (var i = 0; i < possibleTasks.length; i++) {
            const taskName = possibleTasks[i];
            setTaskSelect(prev => ({ 
                ...prev,
                [taskName]: false,
            }));
        }
    }, [lat, lng]);

    function formatPhoneNumber(phoneNumberString) {
        var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return '(' + match[1] + ')-' + match[2] + '-' + match[3]
        }
        return null
    }

    var phoneNumber;
    if (modalInfo.phone) {
        phoneNumber = <p><b>Phone:</b> {formatPhoneNumber(modalInfo.phone)}</p>;
    } else {
        phoneNumber = <></>;
    }

    const dropdownToggle = (newValue, event, metadata) => {
        if (metadata.source === 'select') {
            setDropdownOpen(true);
        } else {
            setDropdownOpen(newValue);
        }
    }

    const handleTaskChange = (evt, task) => {
        var noTasksSelected = true;
        const selectedTasks = [];
        if (taskSelect[task] === false) {
            selectedTasks.push(task);
            noTasksSelected = false;
        }

        for (const taskFound in taskSelect) {
            if (taskFound === task) {
                continue;
            }
            if (taskSelect[taskFound]) {
                selectedTasks.push(taskFound);
                noTasksSelected = false;
            }
        }

        setTaskSelect(prev => ({ 
            ...prev,
            [task]: !taskSelect[task],
        }));

        if (noTasksSelected) {
            setDisplayedUsers(users);
            return;
        }
        const result = users.filter(user => selectedTasks.some(v => user.offer.tasks.indexOf(v) !== -1));
        setDisplayedUsers(result);
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function validatePhone(phone) {
        if (phone === undefined || phone === '' || phone.length === 0) {
            return true;
        } else if (phone.length === 10) {
            return (/^\d+$/.test(fields.phone));
        } else {
            return false;
        }
    }

    const checkInputs = () => {
        if (fields.details === "") {
            setShowToast(true);
            setToastMessage('No Details Written');
            return false;
        }

        if (fields.email === "") {
            setShowToast(true);
            setToastMessage('No Email Set');
            return false;
        }

        if (validateEmail(fields.email) === false) {
            setShowToast(true);
            setToastMessage('Not a valid email');
            return false;
        }

        if (!validatePhone(fields.phone)) {
            setShowToast(true);
            setToastMessage('Please Use A Valid Phone Number');
            return false;
        }
        return true;
    }

    const handleUpdate = async e => {
        e.preventDefault();
        if (checkInputs() === false) {
            return;
        }

        let form = {
            'offerer_id': modalInfo._id,
            'offerer_email': modalInfo.email,
            'requester_phone': fields.phone,
            'details': fields.details,
            'requester_email': fields.email
        };
        fetch('/api/request/handle_request', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Request successfully created");
                setShowRequestHelp(false);
                setShowCompletedToast(true);
                fields.details = '';
                fields.phone = '';
                fields.email = '';
            } else {
                console.log("Request not successful")
            }
        })
        .catch((e) => {
            console.log("Error");
        });
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
                            <Col style={{whiteSpace: 'nowrap', 
                                         marginTop: 4}}>
                                <strong>Who's offering?</strong>
                            </Col>
                            <Col>
                                <Dropdown drop = 'up' 
                                          show={dropdownOpen}
                                          onToggle={dropdownToggle}
                                          alignRight>
                                    <Dropdown.Toggle size = 'sm' 
                                                    variant="secondary" 
                                                    id="dropdown-basic">
                                        <strong>Offers</strong>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {possibleTasks.map((task) => {
                                        return <Dropdown.Item
                                                onSelect = {(evt) => { handleTaskChange(evt, task)}}
                                                active = {taskSelect[task]}> {task}
                                                </Dropdown.Item >
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
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

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentDisplayedUsers = displayedUsers.slice(indexOfFirstPost, indexOfLastPost)

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="shadow mb-5 bg-white rounded" 
            style = {{paddingLeft: '1rem', 
                      paddingRight: '1rem', 
                      paddingBottom: '1rem'}}>
            <br />
            <Badge pill style = {{fontSize: 16, whiteSpace:"normal", marginBottom: 5, marginTop: -13}} variant="warning" className="shadow">
                See who's helping around {localityText}
            </Badge>{' '}
            <br />
            <div style = {{fontSize: 14, fontStyle:'italic', marginTop: 4, marginBottom: 5}}>
                Click on an offer below for more info
            </div>{' '}
            {tabs}
            <ListGroup variant="flush">
                {message}
                <Offer displayedUsers={currentDisplayedUsers}
                        handleShow={handleShow}
                        setModal={setModal} 
                />
                <Pagination
                    postsPerPage={postsPerPage}
                    totalPosts={displayedUsers.length}
                    paginate={paginate}
                />
            </ListGroup>
            <Modal show={showOffer} onHide={handleClose} style = {{marginTop: 60}}>
                <Modal.Header closeButton>
                <Modal.Title>{modalInfo.first_name} {modalInfo.last_name}'s Offer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p style= {{marginBottom: 10}}><b>Neighborhoods:</b>  {modalInfo.offer.neighborhoods.map((neighborhood, i) => {
                            return <><Badge key={modalInfo._id + neighborhood + String((i + 1) * 20)} 
                                            pill variant="warning">
                                        {neighborhood}
                                    </Badge>{' '}</>
                        })}
                    </p>
                    <p style= {{marginBottom: 10}}><b>Tasks:</b>  {modalInfo.offer.tasks.map((task, i) => {
                            return <><Badge key={modalInfo._id + task + String((i + 1) * 11)} 
                                            pill variant="primary">
                                        {task}
                                    </Badge>{' '}</>
                        })}
                    </p>
                    {/* <p><b>Email:</b> {modalInfo.email}</p> */}
                    {/* {phoneNumber} */}
                    <p><b>Details:</b> {modalInfo.offer.details}</p>
                    <Button variant="danger" 
                            style={{marginTop: 15,
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    display: 'block'}}
                            onClick={() => {setShowOffer(false); setShowRequestHelp(true);}}>
                        Request Help
                    </Button>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{fontStyle: "italic"}}>
                        Be sure to coordinate a safe drop-off/interaction! Follow 
                        <a target="_blank" 
                           rel="noopener noreferrer" 
                           href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html"> CDC guidelines</a> on 
                           cleanliness and avoid as much contact as possible to prevent further spread of virus.
                    </p>
                </Modal.Footer>
            </Modal>
            
            <Modal show={showRequestHelp} 
                   onHide={handleCloseRequest} 
                   style = {{marginTop: 10}}>
                <Modal.Header closeButton>
                <Modal.Title>Request for Help</Modal.Title>
                </Modal.Header>
                <Toast
                    show={showToast}
                    delay={3000}
                    onClose={() => setShowToast(false)}
                    autohide
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        marginBottom: 120,
                        marginRight: 10
                    }}>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
                <Modal.Body>
                    <Form onSubmit={handleUpdate} style = {{textAlign: "left"}}>
                        <Form.Group controlId="details" bssize="large">
                            <Form.Label style = {{marginBottom: -10}}><h4>Details</h4></Form.Label>
                            <p style = {{fontWeight: 300, 
                                        fontStyle: 'italic', 
                                        fontSize: 13, 
                                        marginBottom: 2}}>Give us more information on what you need help with!</p>
                            <Form.Control as="textarea" 
                                            rows="3" 
                                            placeholder="Example: 'I need milk and eggs and they can be dropped
                                            off at 123 Main street. I can pre-pay via Venmo or Paypal.'"
                                            value={fields.details} 
                                            onChange={handleFieldChange}/>
                        </Form.Group>
                        <Form.Group controlId="email" bssize="large" style = {{marginBottom: 5}}>
                            <Form.Label style = {{marginBottom: -10}}><h4>Contact Information</h4></Form.Label>
                            <p style = {{fontWeight: 300, 
                                        fontStyle: 'italic', 
                                        fontSize: 13,
                                        marginBottom: 2}}>How {modalInfo.first_name} will reach out to you</p>
                            <Form.Control 
                                placeholder="Email"
                                value={fields.email}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="phone" bssize="large">
                            <Form.Control 
                                placeholder="Phone number (optional)"
                                value={fields.phone}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                        <Button variant="success"
                                type="submit"
                                style={{marginBottom: 5, marginTop: 10}}>
                            Send Request
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <p style={{fontStyle: "italic"}}>
                        Be sure to coordinate a safe drop-off/interaction! Follow 
                        <a target="_blank" 
                           rel="noopener noreferrer" 
                           href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html"> CDC guidelines</a> on 
                           cleanliness and avoid as much contact as possible to prevent further spread of virus.
                    </p>
                </Modal.Footer>
            </Modal>

            <Modal show={showCompletedToast} 
                   onHide={() => setShowCompletedToast(false)} 
                   style = {{marginTop: 220}}>
                <Modal.Header closeButton style = {{backgroundColor: '#ccebd2', borderBottom: '0 none'}}>
                    <Modal.Title 
                        style = {{color: '#155724'}}>
                        Thanks for taking up on an offer!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer 
                    style = {{backgroundColor: '#ccebd2', 
                              color: '#155724', 
                              display: 'block', 
                              borderTop: '0 none',
                              marginTop: -20}}>
                    <p>
                        Your request has been just been sent to {modalInfo.first_name} and 
                        they should be in contact with you soon.
                    </p>
                </Modal.Footer>
            </Modal>
        </div>
    );
}