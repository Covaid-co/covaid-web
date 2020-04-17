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
import Details from './Details';
import { generateURL } from './Helpers'
import { defaultResources } from './constants';
import CheckForm from './CheckForm';

import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyCikN5Wx3CjLD-AJuCOPTVTxg4dWiVFvxY");


export default function YourOffer(props) {
    const [fields, handleFieldChange] = useFormFields({
        details: ""
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [availability, setAvailability] = useState(false);
    const [resources, setResources] = useState({});

    useEffect(() => {
        fields.details = props.user.offer.details;
        setAvailability(props.user.availability);
        async function getResources() {
            if (!props.user.association) {
                setCurrentUserObject(props.user.offer.tasks, defaultResources, setResources);
                setIsLoading(false);
                return;
            }
            let params = {'associationID': props.user.association}
            var url = generateURL("/api/association/get_assoc/?", params);
            const response = await fetch(url);
            response.json().then((data) => {
                setCurrentUserObject(props.user.offer.tasks, data.resources, setResources);
                setIsLoading(false);
            });
        }
        getResources();
    }, [props.user]);

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
            setToastMessage('No task selected');
            return false;
        }

        if (fields.details === "") {
            setShowToast(true);
            setToastMessage('No details written');
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

    const handleUpdate = (publish) => {
        if (checkInputs() === false) {
            return;
        }

        var resourceList = extractTrueObj(resources);

        let form = {
            'offer.tasks': resourceList,
            'offer.details': fields.details,
            'availability': publish,
        };


        fetch_a('token', '/api/users/update', {
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

    var visibleText = <></>
    var publishButton = <></>
    if (availability) {
        visibleText = <h5 id="medium-text" style={{color: "#45A03D"}}>
            *Your offer is currently live and on the community bulletin</h5>
        publishButton = <Button id="large-button" style={{backgroundColor: "#AE2F2F", borderColor: "#AE2F2F", marginTop: 10}} onClick={() => handleUpdate(false)}>Unpublish your offer</Button>
    } else {
        visibleText = <h5 id="medium-text" style={{color: "#AE2F2F"}}>
            *Your offer is currently inactive</h5> 
        publishButton = <Button id="large-button" style={{marginTop: 10}} onClick={() => handleUpdate(true)} >Publish your offer</Button>  
    }

    if (isLoading) {
        return <div>Loading ... </div>;
    } else {
        return (
                <Row >
                    <Col>
                        <Toast
                            show={showToast}
                            delay={3000}
                            onClose={() => setShowToast(false)}
                            autohide
                            id="volunteer-error-toast">
                            <Toast.Header>
                                <strong className="mr-auto">Covaid</strong>
                            </Toast.Header>
                            <Toast.Body>{toastMessage}</Toast.Body>
                        </Toast>
                        <Alert style={{marginTop: 10, marginBottom: 20, color: '#721c24'}} variant={'danger'} id="regular-text">
                            If you are showing any symptoms or have traveled in the past 2 weeks, please refrain from marking yourself as available.
                        </Alert>
                        <Form onSubmit={handleUpdate} style = {{textAlign: "left"}}>
                            {visibleText}
                            <h5 id="regular-text-bold" style={{marginBottom: 5}}>What can you help with?</h5>
                            <CheckForm obj={resources} setObj={setResources}/>
                            <Details fields={fields.details} handleFieldChange={handleFieldChange}/>
                            {publishButton}
                        </Form>
                    </Col>
                </Row>
        );
    }
}