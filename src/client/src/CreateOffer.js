import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function CreateOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        task: "",
        description: "",
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [neighborhoodSelect, setNeighborhoodSelect] = useState({});
    const [taskSelect, setTaskSelect] = useState({});
    const [getNeighborhoods, setNeighborhoods] = useState([]);
    const possibleTasks = ['Groceries', 'Medicine/Health Care', 'Transportation',
                           'Pet Care', 'Child Care', 'Virtual Meetup'];

    useEffect(() => {
        // Get current lat and long from main and find neighborhoods
        const { latitude, longitude } = props.state;
        Geocode.fromLatLng(latitude.toString(), longitude.toString()).then(
            response => {
                var neighborhoods = [];
                for (var i = 0; i < response.results.length; i++) {
                    const results = response.results[i]['address_components'];
                    for (var j = 0; j < results.length; j++) {
                        const types = results[j].types;
                        if (types.includes('neighborhood')) {
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
                if (neighborhoods.length === 1) {
                    setNeighborhoodSelect({ [neighborhoods[0]]: true });
                }
                console.log(neighborhoods);
                setNeighborhoods(neighborhoods);
            },
            error => {
              console.error(error);
            }
        );
        for (var i = 0; i < possibleTasks.length; i++) {
            // Update task checked object
            const taskName = possibleTasks[i];
            setTaskSelect(prev => ({ 
                ...prev,
                [taskName]: false,
            }));
        }
        setIsLoading(false);
    }, [props.state])

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

    const handleSubmit = async e => {
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
            'task': taskList,
            'latitude': props.state.latitude,
            'longitude': props.state.longitude,
            'neighborhoods': neighborList,
            'description': fields.description,
        };
        console.log(form);
        fetch('/api/offers/create', {
            method: 'post',
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
            console.log("Error")
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
                        <Form onSubmit={handleSubmit}>
                        <br></br>
                            <Form.Group controlId="description" bssize="large">
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
                            <Form.Group controlId="description" bssize="large">
                                <Form.Label><h3>Description</h3></Form.Label>
                                <Form.Control as="textarea" 
                                              rows="3" 
                                              value={fields.description} 
                                              onChange={handleFieldChange}/>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="task" bssize="large">
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
                                Submit
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