import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormFields } from "./libs/hooksLib";
import fetch_a from './util/fetch_auth';

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Toast from 'react-bootstrap/Toast'
import Alert from 'react-bootstrap/Alert'
import ToggleButton from 'react-bootstrap/ToggleButton'
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup'

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function YourOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: "",
        phone: ""
    });

    const [showAlert, setShowAlert] = useState(false);
    const [availableText, setAvailableText] = useState('');
    const [switchSelected, setSwitchSelected] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    // const [neighborhoodSelect, setNeighborhoodSelect] = useState({});
    const [getNeighborhoods, setNeighborhoods] = useState([]);
    const possibleTasks = ['Food', 'Health Care', 'Transportation',
                           'Storage', 'Emotional Support', 'Child Care', 'Pet Care'];

    useEffect(() => {
        const possible_tasks = ['Food', 'Health Care', 'Transportation',
                           'Storage', 'Emotional Support', 'Child Care', 'Pet Care'];
        async function fetchData() {
            const response = await fetch_a('/api/users/current');
            response.json().then((user) => {
                fields.details = user.offer.details;
                fields.phone = user.phone;

                // Get current lat and long from current location and find neighborhoods
                const { latitude, longitude } = props.state;
                var neighborhoods = [];

                Geocode.fromLatLng(latitude.toString(), longitude.toString()).then(
                    response => {
                        var currentZipcode = '';
                        for (var i = 0; i < Math.min(5, response.results.length); i++) {
                            const results = response.results[i]['address_components'];
                            for (var j = 0; j < results.length; j++) {
                                const types = results[j].types;
                                if (types.includes('neighborhood') || types.includes('locality')) {
                                    const currNeighborhoodName = results[j]['long_name'];
                                    if (neighborhoods.includes(currNeighborhoodName) === false) {
                                        neighborhoods.push(currNeighborhoodName);
                                        // // Update select object
                                        // setNeighborhoodSelect(prev => ({ 
                                        //     ...prev,
                                        //     [currNeighborhoodName]: false,
                                        // }));
                                    }
                                }
                                // find zip code from current location
                                if (types.includes('postal_code')) {
                                    if (currentZipcode === '') {
                                        currentZipcode = results[j]['long_name'];
                                    }
                                }
                            }
                        }

                        Geocode.fromLatLng(user.latlong[1], user.latlong[0]).then(
                            response => {
                                var foundZipCode = '';
                                for (var i = 0; i < Math.min(4, response.results.length); i++) {
                                    const results = response.results[i]['address_components'];
                                    for (var j = 0; j < results.length; j++) {
                                        const types = results[j].types;
                                        // find zip code from current location
                                        if (types.includes('postal_code')) {
                                            if (foundZipCode === '') {
                                                foundZipCode = results[j]['long_name'];
                                            }
                                        }
                                    }
                                }

                                if (foundZipCode !== currentZipcode) {
                                    setShowAlert(true);
                                }
                            },
                            error => {
                                console.error(error);
                            }
                        );
                    },
                    error => {
                        console.error(error);
                    }
                );

                // console.log(neighborhoods);

                // Update Neighborhoods from current user and found neighbors
                // Combine with found neighborhoods/overwrite
                // const currentNeighborhoods = user.offer.neighborhoods;
                // for (var i = 0; i < currentNeighborhoods.length; i++) {
                //     const currNeighborhoodName = currentNeighborhoods[i];
                //     setNeighborhoodSelect(prev => ({ 
                //         ...prev,
                //         [currNeighborhoodName]: true,
                //     }));
                //     if (neighborhoods.includes(currNeighborhoodName) === false) {
                //         neighborhoods.push(currNeighborhoodName);
                //     }
                // }
                setNeighborhoods(neighborhoods);

                // Update tasks from current user
                var tempTasks = [];
                for (var i = 0; i < possible_tasks.length; i++) {
                    const taskName = possible_tasks[i];
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
                setIsLoading(false);
            });
        }
        fetchData();
    
    }, [props.state]);

    const checkInputs = () => {
        // var foundTrue = false;
        // for (const prop in neighborhoodSelect) {
        //     if (neighborhoodSelect[prop] === true) {
        //         foundTrue = true;
        //     }
        // }

        // // Didn't select neighborhood
        // if (foundTrue === false) {
        //     setShowToast(true);
        //     setToastMessage('No Neighborhood Selected');
        //     return false;
        // }

        // If there are non selected
        if (selectedTasks.length === 0) {
            setShowToast(true);
            setToastMessage('No Task Selected');
            return false;
        }

        if (fields.details === "") {
            setShowToast(true);
            setToastMessage('No Details Written');
            return false;
        }

        if (!((fields.phone.length === 0 || (fields.phone.length === 10)) && (/^\d+$/.test(fields.phone)))) {
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

        var taskList = [];
        for (var i = 0; i < selectedTasks.length; i++) {
            taskList.push(possibleTasks[selectedTasks[i]]);
        }

        // var neighborList = [];
        // for (const prop in neighborhoodSelect) {
        //     if (neighborhoodSelect[prop] === true) {
        //         neighborList.push(prop);
        //     }
        // }

        let form = {
            'offer': {
                'tasks': taskList,
                // 'neighborhoods': neighborList,
                'neighborhoods': getNeighborhoods,
                'details': fields.details,
            },
            'location': {
                'type': 'Point',
                'coordinates': [props.state.longitude, props.state.latitude]
            },
            'phone': fields.phone
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

    // const handleChange = (evt, neighborhood) => {
    //     setNeighborhoodSelect(prev => ({ 
    //         ...prev,
    //         [neighborhood]: !neighborhoodSelect[neighborhood],
    //     }));
    // }

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
                        <Alert show={showAlert} variant={'danger'}>
                            Your location has changed! Press update to reflect this.
                        </Alert>
                        <Form onSubmit={handleUpdate} style = {{textAlign: "left"}}>
                            <br></br>
                            <Form.Label style = {{marginBottom: -10}}><h3>Availability</h3></Form.Label>
                            <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Switch on whether you are available to help.</p>
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                label={availableText}
                                checked={switchSelected}
                                onChange={handleChangeSwitch}
                            />
                            <br></br>
                            <Form.Group controlId="tasks" bssize="large">
                                <Form.Label style = {{marginBottom: -10}}><h2>Tasks</h2></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Select tasks with which you are willing to help.</p>
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
                                <p style = {{fontWeight: 300, fontSize: 14, fontStyle: 'italic'}}>Example: "I am free after 6pm on weekdays"</p>
                                <Form.Control as="textarea" 
                                              rows="3" 
                                              value={fields.details} 
                                              onChange={handleFieldChange}/>
                            </Form.Group>
                            <br></br>
                            <Form.Group controlId="phone" bssize="large">
                                <Form.Label style = {{marginBottom: 0}}><h3>Update your contact number</h3></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Optional</p>
                                <Form.Control 
                                    placeholder="10 Digit Contact Number"
                                    value={fields.phone}
                                    onChange={handleFieldChange}
                                />
                            </Form.Group>
                            <br></br>
                            {/* <Form.Group controlId="neighborhoods" bssize="large">
                                <Form.Label style = {{marginBottom: -10}}><h3>Neighborhoods</h3></Form.Label>
                                <p style = {{fontWeight: 300, fontStyle: 'italic'}}>Select the primary neighborhoods in which you can help.</p>
                                {getNeighborhoods.map((neighborhood) => {
                                    return <Form.Check key={neighborhood} 
                                                    type = "checkbox" 
                                                    label = {neighborhood}
                                                    onChange = {(evt) => { handleChange(evt, neighborhood) }}
                                                    checked = {neighborhoodSelect[neighborhood]} />
                                })}
                            </Form.Group>
                            <br></br> */}
                            <Button variant="primary" type="submit" >
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