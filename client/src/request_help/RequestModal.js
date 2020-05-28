import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import RequestPage1 from './RequestPage1';
import RequestPage2 from './RequestPage2';

import OrgHeader from '../association_request_headers/OrgHeader';
import DefaultHeader from '../association_request_headers/DefaultHeader';
import { generalRequestText } from '../constants';
import CurrentLocation from '../location_tools/CurrentLocation';
import {translations} from '../translations/translations';
import LocalizedStrings from 'react-localization';

/**
 * Request Support Modal 
 */

 let translatedStrings = new LocalizedStrings({translations});

export default function RequestHelp(props) {
    const [firstPage, setFirstPage] = useState({});
    const [completed, setCompleted] = useState(false);
    const [language, setLanguage] = useState('en');

    const requestHeaderText = () => {
        if (props.requestHelpMode === 'bulletin') {
            return 'After submitting a matched request, the volunteer will reach out to you directly. If you have any problems, please contact covaidco@gmail.com.'
        }
        return generalRequestText;
    }


    const resetState = () => {
        props.hideModal();
        setCompleted(false);
        setTimeout(function () {
            setFirstPage(true);
        }, 700);
    }

    const requestFormInfo = () => {
        var topHeader = <DefaultHeader setSwithToLanguage={props.setSwithToLanguage} switchToLanguage={props.switchToLanguage} 
                        requestHeaderText={requestHeaderText()} modal={true}/>;
        if (props.currentAssoc && Object.keys(props.currentAssoc).length > 0) {
            topHeader = <OrgHeader etSwithToLanguage={props.setSwithToLanguage} switchToLanguage={props.switchToLanguage} assoc={props.currentAssoc} modal={true}/>;
        }
        return (
            <>
                {topHeader}
                <CurrentLocation locationProps={{locality: props.locality, zipcode: props.zipcode}} 
                                 showModal={() => {props.showModalType('location-request')}}/>
                <p id="requestCall" style={{marginTop: -15, marginBottom: 15}}>&nbsp;</p>
            </>
        )
    }

    var assoc_id = (props.currentAssoc._id && props.currentAssoc._id.length > 0) 
                        ? props.currentAssoc._id : "5e88cf8a6ea53ef574d1b80c";
    
    const handleSubmit = (secondPage) => {
        let form = {
            request: {
                personal_info: {
                    'requester_name': firstPage.name,
                    'requester_phone': firstPage.phone,
                    'requester_email': firstPage.email,
                    'languages': secondPage.languages,
                },
                request_info: {
                    'resource_request': firstPage.resources,
                    'details': secondPage.details,
                    'payment': secondPage.payment,
                    'time': secondPage.time,
                    'date': secondPage.date,
                },
                location_info: {
                    'type': 'Point',
                    'coordinates': [props.longitude, props.latitude]
                },
                association: assoc_id,
                status: {
                    volunteer: props.volunteer
                }
            }
        };

        fetch('/api/request/create_request', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form)
        })
        .then((response) => {
            if (response.ok) {
                console.log("Request successfully created");
                setCompleted(true);
            } else {
                console.log("Request not successful")
            }
        })
        .catch((e) => {
            console.log(e);
        });
    }

    if (completed) {
        return (
            <Modal id="showRequestModal" show={completed} onHide={resetState}>
                <Modal.Header closeButton>
                    <Modal.Title>Your request has been sent!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p id="regular-text" style={{marginBottom: 5}}>
                        Your request has been saved and you should receive an email soon 
                        from a matched volunteer who can support you.
                    </p>
                    <Button id="large-button" style={{marginTop: 15}} onClick={resetState}>
                        Return to home
                    </Button>
                </Modal.Body>
            </Modal>
        )
    }

    if (Object.keys(firstPage).length === 0) {
        return (
            <Modal show={props.showModal} onHide={resetState} 
                   className='showRequestModal' style={{marginTop: 10, paddingBottom: 20}}>
                <Modal.Header closeButton>
                    <Modal.Title >Submit a request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {requestFormInfo()}
                    <RequestPage1 setFirstPage={setFirstPage} currentAssoc={props.currentAssoc} translations={translatedStrings} language={language} volunteer={props.volunteer}/>
                </Modal.Body>
            </Modal>
        )
    }
    return (
        <Modal show={props.showModal} onHide={resetState}
               id="showRequestModal" style={{marginTop: 10, paddingBottom: 20}}>
            <Modal.Header closeButton>
                <Modal.Title id="small-header">Almost Done!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <RequestPage2 currentAssoc={props.currentAssoc} handleSubmit={handleSubmit} translations={translatedStrings} language={language}/>
            </Modal.Body>
        </Modal>
    )
}

RequestHelp.propTypes = {
    setSwithToLanguage : PropTypes.func,
    switchToLanguage : PropTypes.string,
    showModalType: PropTypes.func,
    showModal: PropTypes.bool,
    hideModal: PropTypes.func,
    locality: PropTypes.string,
    zipcode: PropTypes.string,
    requestHelpMode: PropTypes.string,
    currentAssoc: PropTypes.object,
    latitude: PropTypes.number,
    longitude: PropTypes.number
};