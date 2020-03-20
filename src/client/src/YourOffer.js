import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";
import fetch_a from './util/fetch_auth';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function YourOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: "",
    });

    const [availableText, setAvailableText] = useState('');
    const [switchSelected, setSwitchSelected] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [neighborhoodSelect, setNeighborhoodSelect] = useState({});
    // const [taskSelect, setTaskSelect] = useState({});
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
                var tempTasks = [];
                for (i = 0; i < possibleTasks.length; i++) {
                    const taskName = possibleTasks[i];
                    const currentUserTasks = user.offer.tasks;
                    const includedTask = (currentUserTasks.includes(taskName)) ? true : false;
                    if (includedTask) {
                        tempTasks.push(i);
                    }
                }
                setSelectedTasks(tempTasks);
                setSwitchSelected(user.availability);
                const aText = user.availability ? 'Available' : 'Not Available'
                setAvailableText(aText);
                // for (i = 0; i < possibleTasks.length; i++) {
                //     const taskName = possibleTasks[i];
                //     const currentUserTasks = user.offer.tasks
                //     const includedTask = (currentUserTasks.includes(taskName)) ? true : false
                //     setTaskSelect(prev => ({ 
                //         ...prev,
                //         [taskName]: includedTask,
                //     }));
                // }
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

        // If there are non selected
        if (selectedTasks.length == 0) {
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
        for (var i = 0; i < selectedTasks.length; i++) {
            taskList.push(possibleTasks[selectedTasks[i]]);
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
                'neighborhoods': neighborList,
                'details': fields.details,
            },
            'location': {
                'type': 'Point',
                'coordinates': [props.state.longitude, props.state.latitude]
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
                console.log("Offer successfully created");
                window.location.reload(true);
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

    const handleChangeTasks = (val) => {
        setSelectedTasks(val);
    };

    const handleChangeSwitch = (evnt) => {
        let form = {
          'availability': !switchSelected
        };
        setSwitchSelected(!switchSelected);
        const aText = !switchSelected ? 'Available' : 'Not Available'
        setAvailableText(aText);

        fetch_a('/api/users/update/', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
              console.log("Update successful");
            } else {
              console.log("Update not successful");
            }
        })
        .catch((e) => {
            console.log("Error");
        });
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
                    <Col md={1}>
                    </Col>
                    <Col md={10} >
                        {/* <Row> */}
                        <Form onSubmit={handleUpdate} style = {{textAlign: "left"}}>
                        <br></br>
                            <Form.Group controlId="tasks" bssize="large">
                                <Form.Label style = {{marginBottom: -10}}><h2>Tasks</h2></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Select tasks you are willing to help with</p>
                                {/* {possibleTasks.map((task) => {
                                    return <Form.Check key={task} 
                                                    type = "checkbox" 
                                                    label = {task}
                                                    onChange = {(evt) => { handleTaskChange(evt, task) }}
                                                    checked = {taskSelect[task]} />
                                })} */}
                                <ToggleButtonGroup type="checkbox" className="btn-group flex-wrap" value={selectedTasks} onChange={handleChangeTasks}>
                                    {possibleTasks.map((task, i) => {
                                        return <ToggleButton className="toggleButton" variant="outline-primary" size="md" key = {i} value={i}>{task}</ToggleButton>
                                    })}
                                </ToggleButtonGroup>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="details" bssize="large">
                                <Form.Label style = {{marginBottom: -10}}><h3>Details</h3></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Give us more information on how you can help!</p>
                                <Form.Control as="textarea" 
                                              rows="3" 
                                              value={fields.details} 
                                              onChange={handleFieldChange}/>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="neighborhoods" bssize="large">
                                <Form.Label style = {{marginBottom: -10}}><h3>Neighborhoods</h3></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Select the neighborhoods you can help in </p>
                                {getNeighborhoods.map((neighborhood) => {
                                    return <Form.Check key={neighborhood} 
                                                    type = "checkbox" 
                                                    label = {neighborhood}
                                                    onChange = {(evt) => { handleChange(evt, neighborhood) }}
                                                    checked = {neighborhoodSelect[neighborhood]} />
                                })}
                            </Form.Group>
                            <br></br>
                            <Form.Label style = {{marginBottom: -10}}><h3>Availability</h3></Form.Label>
                            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Switch on whether you are available to help</p>
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                label={availableText}
                                checked={switchSelected}
                                onChange={handleChangeSwitch}
                            />
                            <br></br>
                            <Button variant="primary" type="submit">
                                Update
                            </Button>
                            <br></br>
                            <br></br>
                        </Form>
                        {/* </Row> */}
                    </Col>
                    <Col md={1}></Col>
                </Row>
            </div>
        );
    }
}