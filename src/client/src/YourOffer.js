import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";
import fetch_a from './util/fetch_auth';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function YourOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: "",
    });

    const [currentUser, setCurrentUser] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [neighborhoodSelect, setNeighborhoodSelect] = useState({});
    const [taskSelect, setTaskSelect] = useState({});
    const [getNeighborhoods, setNeighborhoods] = useState([]);
    const possibleTasks = ['Groceries', 'Medicine/Health Care', 'Transportation',
                           'Pet Care', 'Child Care', 'Virtual Meetup'];

    useEffect(() => {
        async function fetchData() {
            const response = await fetch_a('/api/users/current');
            response.json().then((user) => {
                setCurrentUser(user);
                fields.details = user.offer.details ? user.offer.details : '';

                // Get current lat and long from current location and find neighborhoods
                const { latitude, longitude } = props.state;
                var neighborhoods = [];
                Geocode.fromLatLng(latitude.toString(), longitude.toString()).then(
                    response => {
                        for (var i = 0; i < Math.min(4, response.results.length); i++) {
                            const results = response.results[i]['address_components'];
                            for (var j = 0; j < results.length; j++) {
                                const types = results[j].types;
                                if (types.includes('neighborhood') || types.includes('locality')) {
                                    const currNeighborhoodName = results[j]['long_name'];
                                    if (neighborhoods.includes(currNeighborhoodName) === false) {
                                        neighborhoods.push(currNeighborhoodName);
                                        // Update select object
                                        setNeighborhoodSelect(prev => ({ 
                                            ...prev,
                                            [currNeighborhoodName]: false,
                                        }));
                                    }
                                }
                            }
                        }
                    },
                    error => {
                        console.error(error);
                    }
                );

                // Update Neighborhoods from current user and found neighbors
                // Combine with found neighborhoods/overwrite
                const currentNeighborhoods = user.offer.neighborhoods;
                for (var i = 0; i < currentNeighborhoods.length; i++) {
                    const currNeighborhoodName = currentNeighborhoods[i];
                    setNeighborhoodSelect(prev => ({ 
                        ...prev,
                        [currNeighborhoodName]: true,
                    }));
                    if (neighborhoods.includes(currNeighborhoodName) === false) {
                        neighborhoods.push(currNeighborhoodName);
                    }
                }
                setNeighborhoods(neighborhoods);

                // Update tasks from current user
                for (i = 0; i < possibleTasks.length; i++) {
                    const taskName = possibleTasks[i];
                    const currentUserTasks = user.offer.tasks
                    const includedTask = (currentUserTasks.includes(taskName)) ? true : false
                    setTaskSelect(prev => ({ 
                        ...prev,
                        [taskName]: includedTask,
                    }));
                }
                setIsLoading(false);
            });
        }
        fetchData();
    
    }, [props.state]);

    const checkInputs = () => {
        var foundTrue = false;
        for (const prop in neighborhoodSelect) {
            if (neighborhoodSelect[prop] === true) {
                foundTrue = true;
            }
        }

        // Didn't select neighborhood
        if (foundTrue === false) {
            setShowToast(true);
            setToastMessage('No Neighborhood Selected');
            return false;
        }

        foundTrue = false;
        for (const prop in taskSelect) {
            if (taskSelect[prop] === true) {
                foundTrue = true;
            }
        }

        // Didn't select task
        if (foundTrue === false) {
            setShowToast(true);
            setToastMessage('No Task Selected');
            return false;
        }
        return true
    }

    const handleUpdate = async e => {
        e.preventDefault();
        if (checkInputs() === false) {
            return;
        }

        var taskList = [];
        for (const prop in taskSelect) {
            if (taskSelect[prop] === true) {
                taskList.push(prop);
            }
        }

        var neighborList = [];
        for (const prop in neighborhoodSelect) {
            if (neighborhoodSelect[prop] === true) {
                neighborList.push(prop);
            }
        }

        let form = {
            'offer': {
                'tasks': taskList,
                'latitude': props.state.latitude,
                'longitude': props.state.longitude,
                'neighborhoods': neighborList,
                'details': fields.details,
            }
        };
        console.log(form);
        fetch_a('/api/users/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Offer successfully created")
            } else {
                console.log("Offer not successful")
            }
        })
        .catch((e) => {
            console.log("Error");
        });
    };

    const handleChange = (evt, neighborhood) => {
        setNeighborhoodSelect(prev => ({ 
            ...prev,
            [neighborhood]: !neighborhoodSelect[neighborhood],
        }));
    }

    const handleTaskChange = (evt, task) => {
        setTaskSelect(prev => ({ 
            ...prev,
            [task]: !taskSelect[task],
        }))
    }

    if (isLoading) {
        return <div>Loading ... </div>;
    } else {
        return (
            <div className="shadow p-3 mb-5 bg-white rounded">
                <Row >
                    <Toast
                        show={showToast}
                        delay={3000}
                        onClose={() => setShowToast(false)}
                        autohide
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            marginBottom: 60,
                        }}
                    >
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                    <Col md={2}>
                    </Col>
                    <Col md={8} >
                        {/* <Row> */}
                        <Form onSubmit={handleUpdate}>
                        <br></br>
                            <Form.Group controlId="tasks" bssize="large">
                                <Form.Label><h3>Task</h3></Form.Label>
                                {possibleTasks.map((task) => {
                                    return <Form.Check key={task} 
                                                    type = "checkbox" 
                                                    label = {task}
                                                    onChange = {(evt) => { handleTaskChange(evt, task) }}
                                                    checked = {taskSelect[task]} />
                                })}
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="details" bssize="large">
                                <Form.Label><h3>Details</h3></Form.Label>
                                <Form.Control as="textarea" 
                                              rows="3" 
                                              value={fields.details} 
                                              onChange={handleFieldChange}/>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="neighborhoods" bssize="large">
                                <Form.Label><h3>Neighborhoods</h3></Form.Label>
                                {getNeighborhoods.map((neighborhood) => {
                                    return <Form.Check key={neighborhood} 
                                                    type = "checkbox" 
                                                    label = {neighborhood}
                                                    onChange = {(evt) => { handleChange(evt, neighborhood) }}
                                                    checked = {neighborhoodSelect[neighborhood]} />
                                })}
                            </Form.Group>
                            <br></br>
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                        </Form>
                        {/* </Row> */}
                    </Col>
                    <Col md={2}></Col>
                </Row>
            </div>
        );
    }
}