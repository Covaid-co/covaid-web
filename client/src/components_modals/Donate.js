import React, {useState, useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

/**
 * If we can carry translated string from homepage.js, we can ignore this part and add props for all translatedStrings
 */
import LocalizedStrings from 'react-localization';
import {translations} from '../translations/translations';

let translatedStrings = new LocalizedStrings({translations});

export default function Donate(props) {
    const [language, setLanguage] = useState("en")
    useEffect(() => {
        if (props.switchToLanguage === "Español") {
            setLanguage("es")
        } else {
            setLanguage("en")
        }

    }, [props.switchToLanguage]);

    return (
        <Modal show={props.showModal} style={{marginTop: 10}} onHide={props.hideModal}>
            <Modal.Header closeButton>
            <Modal.Title>{translatedStrings[language].Donate}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="regular-text">{translatedStrings[language].Donate1}
                </p>
                <p id="regular-text">
                    {translatedStrings[language].Donate2}
                </p>
                <Button id="large-button" style={{marginTop: 15}} onClick={()=>window.open('https://www.gofundme.com/f/25wj3-covaid', '_blank')}>
                    {translatedStrings[language].Donate}
                </Button>
            </Modal.Body>
        </Modal>
    );
}
