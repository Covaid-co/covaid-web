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

import Resources from './Resources';
import PhoneNumber from './PhoneNumber';
import NewLanguages from './NewLanguages';
import Details from './Details';
import NewCar from './NewHasCar';
import Availability from './Availability';
import TimesAvailable from './TimesAvailable';

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function YourOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: ""
    });

    const [showAlert, setShowAlert] = useState(false);
    const [availableText, setAvailableText] = useState('');
    const [switchSelected, setSwitchSelected] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [getNeighborhoods, setNeighborhoods] = useState([]);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [availability, setAvailability] = useState(false);
    const [languageChecked, setLanguageChecked] = useState({});
    const [hasCar, setHasCar] = useState(false);

    const [association, setAssociation] = useState('');
    const [resources, setResources] = useState({});
    const [times, setTimes] = useState({});
    const [defaultResources, setDefaultResources] = useState(['Food/Groceries', 'Medication', 'Donate', 'Emotional Support', 'Academic/Professional', 'Misc.']);
    const timeNames = ['Mornings', 'Afternoons', 'Evenings', 'Weekends'];
    const languages = ['English', 'Spanish', 'Mandarin', 'Cantonese', 'Other (Specify in Anything Else)'];
    const pittsburghResources = ['Food', 'Childcare', 'Pet care', 'Eldercare', 
        'Help running errands (groceries, prescriptions, supplies, etc)',
        'A ride somewhere', 'Health Care Support (doctor, medicine, etc)',
        'Housing', 'Shower / Laundry', 'Internet / Phone Access', 
        'Emotional / Spiritual Support', 'Storage', 'Financial Support', 'Legal assistance', 'Other'];

    useEffect(() => {
        async function fetchData() {
            const response = await fetch_a('/api/users/current');
            response.json().then((user) => {
                // Get current lat and long from current location and find neighborhoods
                const { latitude, longitude } = props.state;
                var neighborhoods = [];
                var locationChanged = false;
                setAssociation(user.association)
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
                                    locationChanged = true;
                                }
                                getAssoc(locationChanged);
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

                // Set neighborhoods based on location in backend
                setNeighborhoods(neighborhoods);

                setCurrentUserObject(user.offer.timesAvailable, timeNames, setTimes);

                fields.details = user.offer.details;
                setPhoneNumber(user.phone);
                if (user.offer.car) {
                    setHasCar(user.offer.car);
                }

                // Set language (if exists) based on user
                if (user.languages) {
                    setCurrentUserObject(user.languages, languages, setLanguageChecked);
                }
                setSwitchSelected(user.availability);
                const aText = user.availability ? 'Available' : 'Unavailable'
                setAvailableText(aText);
                setAvailability(user.availability);

                async function getAssoc(locChanged) {
                    var url = "/api/association/get_assoc/?";
                    if (!user.association || locChanged) {
                        setCurrentUserObject(user.offer.tasks, defaultResources, setResources);
                        setIsLoading(false);
                        return;
                    }
                    let params = {
                        'associationID': user.association
                    }
                    let query = Object.keys(params)
                        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                        .join('&');
                    url += query;

                    const response = await fetch(url);
                    response.json().then((data) => {
                        setIsLoading(false);
                        setDefaultResources(data.resources)
                        setCurrentUserObject(user.offer.tasks, data.resources, setResources);
                    });
                }
            });
        }
        fetchData();
    }, []);


    const setCurrentUserObject = (userList, fullList, setFunction) => {
        for (var i = 0; i < fullList.length; i++) {
            const curr = fullList[i];
            const include = (userList.includes(curr)) ? true : false;
            setFunction(prev => ({ 
                ...prev,
                [curr]: include,
            }));
        }
    }

    const checkInputs = () => {
        if (Object.values(resources).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No Task Selected');
            return false;
        }

        if (Object.values(languageChecked).every(v => v === false)) {
            setShowToast(true);
            setToastMessage('No Language Selected');
            return false;
        }

        if (fields.details === "") {
            setShowToast(true);
            setToastMessage('No Details Written');
            return false;
        }

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (phoneOnlyDigits.length != 0 && phoneOnlyDigits.length !== 10) {
            setShowToast(true);
            setToastMessage('Enter a valid phone number');
            return false;
        }

        return true;
    }

    const extractTrueObj = (obj) => {
        var result = [];
        for (const p in obj) {
            if (obj[p]) {
                result.push(p);
            }
        }
        return result;
    }

    const handleUpdate = async e => {
        e.preventDefault();
        if (checkInputs() === false) {
            return;
        }

        var resourceList = extractTrueObj(resources);
        var selectedLanguages = extractTrueObj(languageChecked);
        var selectedTimes = extractTrueObj(times);

        let form = {
            'offer': {
                'tasks': resourceList,
                'neighborhoods': getNeighborhoods,
                'details': fields.details,
                'car': hasCar,
                'timesAvailable': selectedTimes
            },
            'location': {
                'type': 'Point',
                'coordinates': [props.state.longitude, props.state.latitude]
            },
            'languages': selectedLanguages,
            'availability': availability,
            'association': association
        };

        const phoneOnlyDigits = phoneNumber.replace(/\D/g,'').substring(0,10);
        if (phoneNumber.length > 0) {
            form['phone'] = phoneOnlyDigits;
        } else {
            form['phone'] = ''
        }

        fetch_a('/api/users/update', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        }).then((response) => {
            if (response.ok) {
                console.log("Offer successfully created");
                window.location.reload(true);
            } else {
                console.log("Offer not successful")
            }
        }).catch((e) => {
            console.log("Error");
        });
    };

    if (isLoading) {
        return <div>Loading ... </div>;
    } else {
        return (
            
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
                    <Col>
                        <Alert show={showAlert} variant={'danger'}>
                            Your location has changed! Press update to reflect this.
                        </Alert>
                        <Alert style={{marginTop: 10, marginBottom: 0}} variant={'danger'}>
                            If you are showing any symptoms or have traveled in the past 2 weeks, please refrain from marking yourself as available.
                        </Alert>
                        <Form onSubmit={handleUpdate} style = {{textAlign: "left"}}>
                            <Availability availableText={availableText}
                                          setAvailableText={setAvailableText}
                                          switchSelected={switchSelected}
                                          setSwitchSelected={setSwitchSelected}
                                          setAvailability={setAvailability}/>
                            <h5 className="volunteerName">What can you help with?</h5>
                            <NewLanguages languages={defaultResources}
                                       languageChecked={resources} 
                                       setLanguageChecked={setResources}/>
                            <Details fields={fields.details} 
                                     handleFieldChange={handleFieldChange}/>
                            <Form.Group controlId="phone" bssize="large">
                                <h5 className="volunteerName">Phone Number</h5>
                                <p style={{fontSize: 15}} id="locationInfo">Optional</p>
                                <PhoneNumber phoneNumber={phoneNumber} 
                                             setPhoneNumber={setPhoneNumber}/> 
                            </Form.Group>
                            <h5 className="volunteerName">What languages do you speak?</h5>
                            <NewLanguages languages={languages}
                                       languageChecked={languageChecked} 
                                       setLanguageChecked={setLanguageChecked}/>
                            <h5 className="volunteerName">What is your general availability?</h5>
                            <NewLanguages languages={timeNames} languageChecked={times} setLanguageChecked={setTimes}/>
                            <h5 className="volunteerName" style={{marginBottom: 5}}>Can you drive?</h5>
                            <NewCar hasCar={hasCar} 
                                    setHasCar={setHasCar}/>
                            <br/>
                            <Button id="nextPage" type="submit" >
                                Update your offer
                            </Button>
                        </Form>
                    </Col>
                </Row>
        );
    }
}