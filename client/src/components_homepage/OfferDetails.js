import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { set } from 'mongoose';

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from 'react-localization';
import {translations} from '../translations/translations';

let translatedStrings = new LocalizedStrings({translations});

export default function OfferDetails(props) {
    var googleTranslate = require('google-translate')(props.googleAPI);
    const userDetails = props.modalInfo.offer.details
    const [transDetails, setTransDetails] = useState('');
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        if (!!props.switchToLanguage) {
            if (props.switchToLanguage !== "English") {
                setLanguage("es")
            } else {
                setLanguage("en")
            }
        }

        if (!!userDetails) {
            translate()
        }
    }, [props.switchToLanguage, userDetails]);


    const translate = () => {
        console.log(language)
        googleTranslate.translate(props.modalInfo.offer.details, language, function(err, translation) {
            if (!!translation) {
                setTransDetails(translation.translatedText)
            }
        });
    }


    return (
        <Modal show={props.modalOfferOpen} onHide={() => props.setModalOfferOpen(false)} style = {{marginTop: 20}}>
            <Modal.Header closeButton>
                <Modal.Title id="small-header">{props.modalInfo.first_name}'s Offer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <>
                    {props.modalInfo.pronouns === undefined || props.modalInfo.pronouns === '' ? '' :
                    <div>
                        <h5 id="regular-text-bold" style={{marginBottom: 0}}>{translatedStrings[language].Pronouns}</h5>
                        <p id="regular-text">{props.modalInfo.pronouns}</p> 
                    </div> 
                    }
                </>

                <h5 id="regular-text-bold" style={{marginBottom: 0}}>{translatedStrings[language].Neighborhoods}</h5>
                <p id="regular-text">{props.modalInfo.offer.neighborhoods.join(', ')}</p>
                <h5 id="regular-text-bold" style={{marginBottom: 5, marginTop: 16}}>{translatedStrings[language].Tasks}</h5>
                {props.modalInfo.offer.tasks.map((task, i) => {
                    return <Badge key={i} id='task-info'>{task}</Badge>
                })}
                <h5 id="regular-text-bold" style={{marginBottom: 0, marginTop: 16}}>{translatedStrings[language].Details}</h5>
                


                <p id="regular-text">{transDetails}</p>
                <Button id="large-button" style={{marginTop: 15}} onClick={() => {props.setModalOfferOpen(false); props.handleShowRequestHelp(props.modalInfo);}}>
                {translatedStrings[language].RequestSupport}
                </Button>
            </Modal.Body>
            <Modal.Footer>
                <p id="regular-text" style={{fontStyle: "italic", fontSize: 14}}>
                    {translatedStrings[language].OfferDetails_Reminder1} <a target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/coronavirus/2019-ncov/prepare/prevention.html"> CDC guidelines </a> 
                    {translatedStrings[language].OfferDetails_Reminder2}
                </p>
            </Modal.Footer>
        </Modal>
    );
}