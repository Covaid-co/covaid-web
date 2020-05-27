import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Toast from 'react-bootstrap/Toast'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import fetch_a from '../util/fetch_auth';

import {useFormFields} from '../libs/hooksLib'
import { generateURL, validateEmail, extractTrueObj } from '../Helpers';
import { MARKER_SIZE, ICON, paymentOptions } from '../constants';
import CheckForm from '../components/CheckForm';

import Geocode from "react-geocode";
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl';



export default function EditRequestInfoModal(props) {

    const [showChangeAssocModal, setShowChangeAssocModal] = useState(false)

    const [fields, handleFieldChange] = useFormFields({
        name: props.currRequest.personal_info.requester_name,
        email: props.currRequest.personal_info.requester_email,
        phone: props.currRequest.personal_info.requester_phone,
        details:props.currRequest.request_info.details,
    });
    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [viewport, setViewport] = useState({
        latitude: props.currRequest.location_info.coordinates[1],
        longitude: props.currRequest.location_info.coordinates[0],
        zoom: 10,  
        bearing: 0,
        pitch: 0,
        width: 400,
        height: 400
    });

    const [lat, setLat] = useState(props.currRequest.location_info.coordinates[1]);
    const [long, setLong] = useState(props.currRequest.location_info.coordinates[0]);

     
    const [isLoaded, setIsLoaded] = useState(false)
    
    const [languageChecked, setLanguageChecked] = useState({});
    const [needsChecked, setNeedsChecked] = useState({});
    const [payment, setPayment] = useState(props.currRequest.request_info.payment);
    const [time, setTime] = useState(props.currRequest.request_info.time);
    const [date, setDate] = useState(props.currRequest.request_info.date); 

    const languages = ['English', 'Spanish', 'Mandarin', 'Cantonese', 'Other (Specify in details)'];
    const defaultNeedsList = ['Food/Groceries', 'Medication', 'Donate', 'Emotional Support', 'Academic/Professional', 'Misc.']


    const setCurrentRequestObject = (userList, fullList, setFunction) => {
        for (var i = 0; i < fullList.length; i++) {
            const curr = fullList[i];
            const include = (userList.includes(curr)) ? true : false;
            setFunction(prev => ({ 
                ...prev,
                [curr]: include,
            }));
        }
    };
      
    const navStyle = {
        position: 'absolute',
        top: 36,
        left: 0,
        padding: '10px'
    };

    const handleChangeTime = (event) => {
        event.persist();
        var result = event.target.value;
        setTime(result)
    }
    const handleChangeDate = (event) => {
        event.persist();
        var result = event.target.value;
        setDate(result);
    }

    const handleChangePayment = (event) => {
        event.persist();
        var result = event.target.value;
        console.log(result);
        setPayment(result);
    }

    const marker = () => {
        return (
            <Marker 
                longitude={long} 
                latitude={lat} 
                draggable={true}
                onDragEnd={(event) => { 
                    setLong(event.lngLat[0]);
                    setLat(event.lngLat[1]);
                }}>

                <svg height={MARKER_SIZE} 
                     viewBox="0 0 24 24"
                     style={{
                        cursor: 'pointer',
                        fill: '#2670FF',
                        stroke: 'none'
                     }}>
                     <path d={ICON}/>   
                </svg>
            </Marker>
        )
    }

    const paymentForm = () => {
        
        return (
            <fieldset>
                <Form.Group as={Row} controlId="payment"> 
                    <Form.Label column sm={3}>
                        <b>Payment</b>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Check 
                            checked={payment==0}
                            type="radio" 
                            label={paymentOptions[0]}
                            value={0}
                            onChange={handleChangePayment}
                            name="formHorizontalRadios"
                            id="payment-option-0"
                        />
                        <Form.Check 
                            checked={payment == 1}
                            type="radio" 
                            label={paymentOptions[1]}
                            value={1}
                            onChange={handleChangePayment}
                            name="formHorizontalRadios"
                            id="payment-option-1"
                        />
                        <Form.Check 
                            checked={payment==2}
                            type="radio" 
                            label={paymentOptions[2]}
                            value={2}
                            onChange={handleChangePayment}
                            name="formHorizontalRadios"
                            id="payment-option-2"
                        />
                    </Col>
                </Form.Group>
            </fieldset>
        )
        
    }

    const checkInputs = () => {
        var valid = true;
        if (Object.values(languageChecked).every(v => v === false)) {
            setToastMessage('Need to select a language');
            valid = false;
        }
        
        if (fields.name.length === 0) {
            setToastMessage('Enter a name');
            valid = false;
        } else if (/^\d+$/.test(fields.phone) && (fields.phone.length !== 10 && fields.phone.length !== 0)) {
            setToastMessage('Enter a valid phone number');
            valid = false;
        } else if (fields.email.length === 0 || 
            validateEmail(fields.email) === false) {
            setToastMessage('Enter a valid email');
            valid = false;
        }

        if (valid === false) {
            setShowToast(true);
        }
        return valid;
    }

    const handleSubmit = async e => {
        e.preventDefault();
        if (checkInputs() === false) {
            return;
        }

        var selectedLanguages = extractTrueObj(languageChecked);
        var selectedResources = extractTrueObj(needsChecked);

        const requester_id = props.currRequest._id;
        let form = {
            requestID: requester_id,
            updates: {
                $set: {
                    "personal_info.requester_name": fields.name,
                    "personal_info.requester_phone": fields.phone,
                    "personal_info.requester_email": fields.email,
                    "request_info.details": fields.details,
                    "location_info.coordinates": [long,lat],
                    "request_info.time": time,
                    "request_info.date": date,
                    "personal_info.languages": selectedLanguages,
                    "request_info.resource_request": selectedResources,
                    "request_info.payment": payment
                },
            },
            
        };

        fetch("/api/request/updateRequestDetails", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
          .then((response) => response.json())
          .then((newRequest) => {
            props.updateRequests(newRequest);
            console.log("Success");
            props.setShowEditModal(false); 
            props.setRequestDetailsModal(true);
          })
          .catch((e) => {
            alert(e);
          });

    }

    useEffect(() => {
       
       setIsLoaded(true);
    
        fields.name = props.currRequest.personal_info.requester_name;
        fields.email = props.currRequest.personal_info.requester_email;
        fields.phone = props.currRequest.personal_info.requester_phone;
        setCurrentRequestObject(props.currRequest.personal_info.languages, languages, setLanguageChecked);
        setCurrentRequestObject(props.currRequest.request_info.resource_request, defaultNeedsList, setNeedsChecked);
    }, [props.currRequest])

    if (isLoaded) {
        return (
            <>
                <Modal.Header closeButton>
                    <Modal.Title>Update request information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container id="volunteer-info" style={{maxWidth: 2000, marginBottom: 10, marginLeft: 0, marginRight: 0, color: 'black'}}>
                    <Row>
                    <Col>
                    <Form>
                        <Form.Group as={Row} controlId="name">
                            <Form.Label column sm={3}>
                            <b>Name</b>
                            </Form.Label>
                            <Col sm={8}>
                            <Form.Control
                                        value={fields.name}
                                        onChange={handleFieldChange}/>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="email">
                            <Form.Label column sm={3}>
                            <b>Email</b>
                            </Form.Label>
                            <Col sm={8}>
                            <Form.Control
                                        value={fields.email}
                                        onChange={handleFieldChange}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="phone">
                            <Form.Label column sm={3}>
                            <b>Phone</b>
                            </Form.Label>
                            <Col sm={8}>
                            <Form.Control
                                        value={fields.phone}
                                        onChange={handleFieldChange}/>
                            </Col>
                        </Form.Group>
                        {paymentForm()}

                        <Row>
                            <Form.Label column sm={3}>
                                <b>Location</b>
                            </Form.Label>
                            <Col sm={8}>
                                <ReactMapGL
                                    {...viewport}
                                    onViewportChange={setViewport}
                                    mapboxApiAccessToken={props.mapboxAccessToken}
                                    mapStyle="mapbox://styles/mapbox/light-v9">

                                    <div style={navStyle}>
                                        <NavigationControl/>
                                    </div>
                                    {marker()}
                                
                                </ReactMapGL>
                            </Col>
                        </Row>

                        <h4 id="regular-text-bold" style={{marginBottom: 5, marginTop: 20}}>Languages</h4>
                        <CheckForm obj={languageChecked} setObj={setLanguageChecked}/>
                        <h4 id="regular-text-bold" style={{marginBottom: 5, marginTop: 20}}>Needs</h4>
                        <CheckForm obj={needsChecked} setObj={setNeedsChecked}/>

                        <h4 id="regular-text-bold" style={{marginBottom: 5, marginTop: 20}}>Need By: </h4>
                        <Row>
                            <Col xs={6} style = {{paddingRight: '4px'}}>
                                <Form.Group controlId="time" onChange={handleChangeTime}>
                                    <Form.Control as="select">
                                        <option value="Morning"> Morning </option>
                                        <option value="Afternoon"> Afternoon </option>
                                        <option value="Evening"> Evening </option>
                                        <option value="Night"> Night</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col xs={6} style = {{paddingLeft: '4px'}}>
                                <Form.Group controlId="date" bssize="large">
                                    <Form.Control as="select" onChange={handleChangeDate}>
                                        <option>{date}</option>
                                        <option>{new Date(Date.now()).toLocaleString().split(',')[0]}</option>
                                        <option>{new Date(Date.now() + 86400000).toLocaleString().split(',')[0]}</option>
                                        <option>{new Date(Date.now() + 2*86400000).toLocaleString().split(',')[0]}</option>
                                        <option>{new Date(Date.now() + 3*86400000).toLocaleString().split(',')[0]}</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group controlId="details">
                            <Form.Label> <b>Request Details</b> </Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows="5" 
                                value={fields.details}
                                onChange={handleFieldChange}
                            />
                        </Form.Group>
                        <Row>
                            <Button onClick={handleSubmit} id="request-button" style={{width: '100%', marginTop: 20}}>Update request info</Button>
                        </Row>
                    </Form>
                    </Col> 
                    </Row>
                    </Container>
                </Modal.Body>
                <Toast
                    show={showToast}
                    delay={1500}
                    onClose={() => setShowToast(false)}
                    autohide
                    id='toastError'>
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </>
        );
    } else {
        return (
            <></>
        )
    }
}